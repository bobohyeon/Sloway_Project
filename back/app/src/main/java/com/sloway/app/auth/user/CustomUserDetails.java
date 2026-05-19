package com.sloway.app.auth.user;

import com.sloway.app.member.common.MemberRole;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * Spring Security 인증 주체.
 *
 * <p>JwtAuthenticationFilter에서 토큰을 파싱한 뒤 이 객체를 만들어
 * SecurityContext에 담는다. Controller에서는 @AuthenticationPrincipal로 받아 사용.
 *
 */
@Getter
@RequiredArgsConstructor
public class CustomUserDetails implements UserDetails {

    private final Long memberNo;
    private final String email;
    private final String password;
    private final MemberRole role;

    /**
     * Spring Security 권한.
     *
     * {@code role.getCode()}로 풀네임 가져와 "ROLE_" prefix 붙임.
     * 결과: {@code "ROLE_USER"} / {@code "ROLE_HOST"} / {@code "ROLE_ADMIN"}
     *
     * 이렇게 해야 {@code hasRole("USER")} 같은 Spring 표준 매칭이 동작.
     */
    public CustomUserDetails(Long memberNo, String email, MemberRole role) {
        this(memberNo, email, null, role);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.getCode()));
    }

    /**
     * 비밀번호는 토큰 기반 인증에서 사용하지 않음.
     * UserDetails 인터페이스 요구사항만 충족.
     */
    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }
}