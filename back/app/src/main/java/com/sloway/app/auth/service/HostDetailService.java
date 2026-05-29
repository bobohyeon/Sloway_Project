package com.sloway.app.auth.service;


import com.sloway.app.auth.user.CustomUserDetails;
import com.sloway.app.host.entity.HostEntity;
import com.sloway.app.host.repository.HostRepository;
import com.sloway.app.member.common.MemberRole;
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
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1) email로 Member(공통) 조회
        MemberEntity member =memberRepository.findByEmail(email)
                .orElseThrow(()->new UsernameNotFoundException("이메일 또는 비밀번호가 일하지 않습니다"));
        // 2) memberNo로 Host(호스트 전용) 조회
        HostEntity host = hostRepository.findByMemberNo(member.getNo())
                .orElseThrow(()->new  UsernameNotFoundException("이메일 또는 비밀번호가 일치하지 않습니다"));

        // 3) 인증 정보 반환 (승인 여부와 무관하게 로그인 허용 — 기능 제한은 각 호스트 API에서)
        return new CustomUserDetails(
                member.getNo(),
                member.getEmail(),
                host.getPassword(),
                MemberRole.H,
                member.getName()
        );


    }
}
