package com.sloway.app.auth.filter;

import com.sloway.app.auth.dto.request.LoginRequestDto;
import com.sloway.app.auth.dto.response.LoginResponseDto;
import com.sloway.app.auth.user.CustomUserDetails;
import com.sloway.app.auth.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;

/**
 * 로그인 처리 필터.
 *
 * <p>{@code /api/auth/login} POST 요청을 가로채 인증 수행.
 * Controller를 거치지 않고 Spring Security 필터 체인 내에서 처리.
 *
 * <p><b>주의:</b> 로그인 URL({@code /api/auth/login})은 SecurityConfig에서
 * {@code setFilterProcessesUrl()}로 설정한다 (이 클래스 생성 직후 반드시 호출).
 */
@Slf4j
@RequiredArgsConstructor
public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final ObjectMapper objectMapper;
    private final JwtUtil jwtUtil;


    /**
     * 로그인 요청 가로채 인증 시도.
     *
     * <p>요청 body의 JSON({email, password})을 파싱 →
     * 인증 토큰 만들어 AuthenticationManager에 위임.
     * 실제 비번 매칭은 AuthenticationManager가 UserDetailsService·
     * PasswordEncoder를 통해 수행.
     */
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request,
                                                HttpServletResponse response)
            throws AuthenticationException {

        try {
            // 1) 요청 body의 JSON → LoginRequestDto 변환
            LoginRequestDto dto =
                    objectMapper.readValue(request.getInputStream(), LoginRequestDto.class);

            // 2) 인증용 토큰 생성 (아직 인증 안 된 상태)
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            dto.getEmail(), dto.getPassword());

            // 3) AuthenticationManager에 인증 위임 (UserDetailsService + 비번 매칭)
            return authenticationManager.authenticate(authToken);

        } catch (IOException e) {
            log.warn("로그인 요청 JSON 파싱 실패", e);
            throw new RuntimeException("로그인 요청 형식이 올바르지 않습니다", e);
        }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {
        // 1) 인증된 사용자 정보 꺼내기
        CustomUserDetails userDetails = (CustomUserDetails) authResult.getPrincipal();
        // 2) JWT 발급 (role엔 MemberRole.U.name() = "U" — 토큰 표준)
        String accessToken = jwtUtil.createAccessToken(
                userDetails.getMemberNo(),
                userDetails.getEmail(),
                userDetails.getRole().name()
        );
        String refreshToken = jwtUtil.createRefreshToken(
                userDetails.getMemberNo()
        );
        log.info("로그인 성공 : {} (MemberNo = {})", userDetails.getEmail(), userDetails.getMemberNo());
        // 3) 응답 구성
        LoginResponseDto dto = LoginResponseDto.builder()
                .accessToken("Bearer "+accessToken)
                .refreshToken(refreshToken)
                .memberNo(userDetails.getMemberNo())
                .email(userDetails.getEmail())
                .role(userDetails.getRole().name())
                .build();

        // 4) 응답에 실제로 쓰기
        response.setHeader("Authorization", "Bearer " + accessToken);
        response.setHeader("Refresh-Token",  refreshToken);
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        objectMapper.writeValue(response.getWriter(), dto);
    }

    /**
     * 인증 실패 → 401 + 에러 메시지.
     *
     * <p>이메일 없음·비번 불일치 모두 동일 메시지 (계정 존재 노출 방지).
     */
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {

        log.debug("로그인 실패 : {}", failed.getMessage());

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        objectMapper.writeValue(
                response.getWriter(),
                java.util.Map.of("message", "이메일 또는 비밀번호가 일치하지 않습니다"));
    }
}//class
