package com.sloway.app.auth.service;


import com.sloway.app.auth.exception.SuspendedAccountException;
import com.sloway.app.auth.user.CustomUserDetails;
import com.sloway.app.host.entity.HostEntity;
import com.sloway.app.host.repository.HostRepository;
import com.sloway.app.member.common.MemberRole;
import com.sloway.app.member.common.MemberStatus;
import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 호스트 인증용 사용자 조회.
 *
 * <p>{@code /api/host/auth/login} 요청 시 AuthenticationManager가 호출.
 * Member(공통) + Host(호스트 전용 - 비번) 2테이블 조인.
 *
 * <p><b>정책:</b> 승인 여부와 무관하게 로그인 허용 (팀 결정).
 * 미승인 호스트도 토큰 발급됨. "승인 전 기능 제한"은 인증이 아닌
 * 각 호스트 API에서 approvalState를 검사해 처리한다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HostDetailService implements UserDetailsService {

    private final MemberRepository memberRepository;
    private final HostRepository hostRepository;


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException, SuspendedAccountException {
        // 1) email로 Member(공통) 조회
        MemberEntity member =memberRepository.findByEmail(email)
                .orElseThrow(()->new UsernameNotFoundException("이메일 또는 비밀번호가 일하지 않습니다"));
        // 2) memberNo로 Host(호스트 전용) 조회
        HostEntity host = hostRepository.findByMemberNo(member.getNo())
                .orElseThrow(()->new  UsernameNotFoundException("이메일 또는 비밀번호가 일치하지 않습니다"));

        // 탈퇴
        if (member.getStatus() == MemberStatus.W) {
            throw new SuspendedAccountException(
                    "탈퇴한 계정입니다. 동일 이메일로 30일간 재가입이 제한됩니다.");
        }

        // 영구 정지 (suspendUntil 없음)
        if (member.getStatus() == MemberStatus.B) {
            String reason = member.getSuspendReason() != null
                    ? member.getSuspendReason() : "운영 정책 위반";
            throw new SuspendedAccountException(
                    "이용이 영구 정지된 계정입니다. 사유: " + reason);
        }

        // 기간 정지 (suspendUntil = 해제 날짜)
        if (member.getStatus() == MemberStatus.S) {
            String reason = member.getSuspendReason() != null
                    ? member.getSuspendReason() : "운영 정책 위반";
            String until = member.getSuspendUntil() != null
                    ? member.getSuspendUntil().toLocalDate().toString()
                    : "기한 미정";
            throw new SuspendedAccountException(
                    "일시 정지된 계정입니다. 사유: " + reason + " / 정지 해제일: " + until);
        }
        // 3) 인증 정보 반환 (승인 여부와 무관하게 로그인 허용 — 기능 제한은 각 호스트 API에서)
        return new CustomUserDetails(
                member.getNo(),
                member.getEmail(),
                host.getPassword(),
                MemberRole.H,
                member.getName(),
                member.getImgUrl()      // ← 프로필 사진 URL (로그인 응답에 실어 보냄)
        );


    }
}