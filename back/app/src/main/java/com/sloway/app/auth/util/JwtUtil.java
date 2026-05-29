package com.sloway.app.auth.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JWT(JSON Web Token) 발급·검증 유틸리티
 *
 * <p>JWT는 [헤더].[페이로드].[서명] 3부분 문자열. 서버가 비밀키로 서명하므로
 * 클라이언트가 내용을 위조하면 서명 검증에서 걸러짐. 로그인 성공 시 발급하고,
 * 이후 요청마다 Authorization 헤더로 받아 신원 확인.
 *
 * <h3>프로퍼티 (팀 공유: application-private.properties)</h3>
 * <pre>
 *   jwt.secret             = (64자 hex, 512bit — HS256 안전)
 *   jwt.access-expiration  = 36000000    (Access 만료, 10시간)
 *   jwt.refresh-expiration = 1209600000  (Refresh 만료, 14일)
 * </pre>
 *
 * <ul>
 *   <li>Access Token  — 짧게. claim: memberNo, email, role</li>
 *   <li>Refresh Token — 길게. claim: memberNo (재발급 전용)</li>
 * </ul>
 */

@Component
public class JwtUtil {

    private final SecretKey secretKey;            // 서명·검증용 비밀키
    private final long accessTokenExpirationMs;   // Access 만료(ms)
    private final long refreshTokenExpirationMs;  // Refresh 만료(ms)

    public JwtUtil(
            @Value("${jwt.secret}") String secretStr,
            @Value("${jwt.access-expiration}") long accessTokenExpirationMs,
            @Value("${jwt.refresh-expiration}") long refreshTokenExpirationMs) {
        byte[] bytes = secretStr.getBytes(StandardCharsets.UTF_8);
        this.secretKey = Keys.hmacShaKeyFor(bytes);
        this.accessTokenExpirationMs = accessTokenExpirationMs;
        this.refreshTokenExpirationMs = refreshTokenExpirationMs;
    }

    public String createAccessToken(Long memberNo, String email, String role, String name) {
        return Jwts.builder()
                .claim("memberNo", memberNo)
                .claim("email", email)
                .claim("role", role)
                .claim("name", name)   // name이 null이면 jjwt가 이 claim을 생략함 → 프론트는 폴백
                .claim("type", "ACCESS")
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + accessTokenExpirationMs))
                .signWith(secretKey)
                .compact();
    }

    //RefreshToken
    public String createRefreshToken(Long memberNo) {
        return Jwts.builder()
                .claim("memberNo", memberNo)
                .claim("type", "REFRESH")
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + refreshTokenExpirationMs))
                .signWith(secretKey)
                .compact()
                ;
    }
    // ─── 토큰 파싱 (검증 포함) ──────────────────────

    /**
     * 토큰 파싱 중복 합쳤음
     * 토큰을 파싱하고 서명·만료를 검증한 뒤 Claims(페이로드)를 반환.
     *
     * <p>verifyWith(secretKey)로 서명 검증. 위조·만료 토큰이면
     * 여기서 JwtException 발생 → 호출부(JwtAuthenticationFilter)가 try-catch.
     *
     * <p>모든 get 메서드가 이 한 곳을 거치므로:
     * <ul>
     *   <li>토큰 파싱 로직이 1군데로 통일 (변경 시 여기만 수정)</li>
     *   <li>한 요청에서 여러 claim 꺼낼 때 파싱 1회로 재사용 가능</li>
     * </ul>
     */
    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public Long getMemberNo(String token) {
        return parseClaims(token).get("memberNo", Long.class);
    }

    public String getEmail(String token) {
        return parseClaims(token).get("email", String.class);
    }

    public String getRole(String token) {
        return parseClaims(token).get("role", String.class);
    }

    public String getType(String token) {
        return parseClaims(token).get("type", String.class);
    }

    /**
     * <p>주의: parseClaims()가 만료된 토큰에 ExpiredJwtException을 던지므로,
     * 사실 이 메서드가 true를 반환하기 전에 예외가 먼저 발생함.
     * 실무에선 보통 try-catch로 만료를 잡음. 이건 명시적 확인이 필요한
     * 특수 상황용 보조 메서드!!!!!!!!!!!.
     *
     * @return
     */

    public boolean isExpired(String token) {
        return parseClaims(token).getExpiration().before(new Date());
    }

    /**
     * Refresh Token 만료 시간(ms) 반환.
     *
     * <p>지금은 미사용. Phase 6에서 RefreshToken을 DB에 저장하는 기능을
     * 만들 때 사용 예정. TokenService가 RefreshToken 엔티티의 "만료 시각
     * (expiredAt)" 컬럼을 계산할 때 이 값이 필요함.
     *
     * <pre>{@code
     * // 나중에 TokenService에서 이렇게 쓰일 예정
     * LocalDateTime expiredAt = LocalDateTime.now()
     *         .plus(jwtUtil.getRefreshTokenExpirationMs(), ChronoUnit.MILLIS);
     * }</pre>
     *
     * @return refresh token 만료 시간 (밀리초)
     */
    public long getRefreshTokenExpirationMs() {
        return refreshTokenExpirationMs;
    }

}//class