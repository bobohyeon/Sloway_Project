package com.sloway.app.auth.service;

import com.sloway.app.auth.user.CustomUserDetails;
import com.sloway.app.member.common.MemberRole;
import com.sloway.app.member.common.MemberStatus;
import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.member.entity.UserEntity;
import com.sloway.app.member.repository.MemberRepository;
import com.sloway.app.member.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Spring Security 인증용 사용자 조회.
 *
 * <p>AuthenticationManager가 로그인 시 호출.
 * 우리 구조는 Member(공통) + User(비번) 2테이블이라
 * email로 Member 조회 → memberNo로 User 조회 후 합쳐서 반환.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserDetailsServiceImpl implements UserDetailsService {

    private final MemberRepository memberRepository;
    private final UserRepository userRepository;


    @Override
    public UserDetails loadUserByUsername(String emmail) throws UsernameNotFoundException {
        // 1) email로 Member(공통) 조회
        MemberEntity member = memberRepository.findByEmail(emmail)
                .orElseThrow(() -> new UsernameNotFoundException("이메일 또는 비밀번호가 일치하지 않습니다"));

        // 1-1) 탈퇴/정지 회원 차단
        if (member.getStatus() == MemberStatus.W) {
            throw new UsernameNotFoundException("탈퇴한 계정입니다.");
        }
        if (member.getStatus() == MemberStatus.B) {
            throw new UsernameNotFoundException("이용이 정지된 계정입니다.");
        }
        if (member.getStatus() == MemberStatus.S) {
            throw new UsernameNotFoundException("일시 정지된 계정입니다.");
        }

        // 2) memberNo로 User(일반회원 전용 - 비번 보유) 조회
        UserEntity user = userRepository.findByMemberNo(member.getNo())
                .orElseThrow(() -> new UsernameNotFoundException("이메일 또는 비밀번호가 일치하지 않습니다"));

        // 3) 두 테이블 정보 합쳐 CustomUserDetails 반환 (로그인용 생성자 - password 포함)
        return new CustomUserDetails(
                member.getNo(),
                member.getEmail(),
                user.getPassword(),
                MemberRole.U,
                member.getName()        // ← 추가
        );
    }
}//class
