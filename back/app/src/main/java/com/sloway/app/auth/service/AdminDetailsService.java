package com.sloway.app.auth.service;

import com.sloway.app.admin.entity.AdminEntity;
import com.sloway.app.admin.repository.AdminRepository;
import com.sloway.app.auth.user.CustomUserDetails;
import com.sloway.app.member.common.MemberRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 관리자 인증용 사용자 조회.
 *
 * <p>{@code /api/admin/auth/login} 요청 시 AuthenticationManager가 호출.
 * Admin은 회원 체계와 분리된 독립 테이블 → Member 조인 없이 단일 조회.
 */

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminDetailsService implements UserDetailsService {

    private final AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        AdminEntity admin = adminRepository.findByEmail(email)
                .orElseThrow(()->new UsernameNotFoundException("이메일 또는 비밀번호가 일치하지 않습니다"));

        return new CustomUserDetails(
                admin.getNo(),
                admin.getEmail(),
                admin.getPassword(),
                MemberRole.A,
                admin.getName()
        );
    }
}
