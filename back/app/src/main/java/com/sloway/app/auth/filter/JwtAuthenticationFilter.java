package com.sloway.app.auth.filter;


import com.sloway.app.auth.user.CustomUserDetails;
import com.sloway.app.auth.util.JwtUtil;
import com.sloway.app.member.common.MemberRole;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT 토큰 파싱 필터.
 *
 * <p>모든 HTTP 요청이 컨트롤러에 닿기 전에 거치는 검문소.
 * Authorization 헤더의 Bearer 토큰을 꺼내 검증하고, 유효하면
 * SecurityContext에 인증 정보를 등록한다.
 *
 * <p>토큰이 없거나 무효해도 예외를 던지지 않고 그냥 통과시킴.
 * 실제 접근 차단은 SecurityConfig의 URL 규칙이 담당
 * (현재 데모 모드라 모두 통과).
 */

@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;


    @Override
    protected void doFilterInternal
            (HttpServletRequest request,
             HttpServletResponse response,
             FilterChain filterChain) throws ServletException, IOException {

        String token = resolveToken(request);

        if (token != null) {
            try {
                if (jwtUtil.isExpired(token)) {
                 log.debug("JWT 만료");
                }else {
                    setAuthentication(token);
                }
            }catch (JwtException e){
                log.debug("JWT 검증 실패 {}", e.getMessage());
            }catch (Exception e){
                log.info("JWT 처리 중 예외 발생 " ,e);
            }
        }
        filterChain.doFilter(request,response);
    }


    private String resolveToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        //Authorization 헤더에서 Bearer 토큰을 추출.
        if (header == null || !header.startsWith("Bearer ")) {
            return null;
        }
        // "Bearer " = 7글자, 그 뒤가 토큰
        return header.substring(7);
    }
    /**
     * 검증된 토큰에서 회원 정보를 꺼내 SecurityContext에 인증 등록.
     *
     * <p>여기서 만든 CustomUserDetails가 principal이 되어, 이후 컨트롤러에서
     * {@code @AuthenticationPrincipal CustomUserDetails user} 로 받을 수 있음.
     * 다른 도메인 담당자들이 user.getMemberNo() 로 회원 식별.
     */
    private void setAuthentication(String token) {
        Long memberNo = jwtUtil.getMemberNo(token);
        String email = jwtUtil.getEmail(token);

        MemberRole role =  MemberRole.valueOf(jwtUtil.getRole(token));

        CustomUserDetails userDetails = new CustomUserDetails(memberNo , email , role);

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                //(누구인지)
                userDetails,
                //(비번 — 토큰인증이라 불필요)
                null,
                // 권한 목록
                userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
    }

}//class
