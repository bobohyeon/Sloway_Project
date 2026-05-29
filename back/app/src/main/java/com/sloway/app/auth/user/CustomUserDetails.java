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
public class CustomUserDetails implements UserDetails {

    private final Long memberNo;
    private final String email;
    private final String password;
    private final MemberRole role;
    private final String name;   // 표시용 (nullable 허용)

    /**
     * Spring Security 권한.
     */

    /**
     * 비밀번호는 토큰 기반 인증에서 사용하지 않음.
     * UserDetails 인터페이스 요구사항만 충족.
     */
    /** 정식 생성자 (전체 필드) */
    public CustomUserDetails(Long memberNo, String email, String password,
                             MemberRole role, String name) {
        this.memberNo = memberNo;
        this.email = email;
        this.password = password;
        this.role = role;
        this.name = name;
    }

    /** 로그인용 (name 없이) — 기존 호출부 호환 */
    public CustomUserDetails(Long memberNo, String email, String password, MemberRole role) {
        this(memberNo, email, password, role, null);
    }

    /** 토큰 재구성용 (password·name 없이) — JwtAuthenticationFilter 호환 */
    public CustomUserDetails(Long memberNo, String email, MemberRole role) {
        this(memberNo, email, null, role, null);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.getCode()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

}//class