package com.sloway.app.auth.config;


import com.sloway.app.auth.filter.JwtAuthenticationFilter;
import com.sloway.app.auth.filter.LoginFilter;
import com.sloway.app.auth.service.AdminDetailsService;
import com.sloway.app.auth.service.HostDetailService;
import com.sloway.app.auth.service.UserDetailsServiceImpl;
import com.sloway.app.auth.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import tools.jackson.databind.ObjectMapper;

import java.util.Collections;
import java.util.List;

/**
 * Spring Security 설정 (LoginFilter 방식).
 *
 * <p>로그인을 Controller가 아닌 LoginFilter에서 처리.
 * AuthenticationManager가 UserDetailsServiceImpl + PasswordEncoder로 인증.
 *
 * <h3>보안 정책</h3>
 * URL 패턴별 권한 제어 (인증 담당이 단독 관리).
 * 매트릭스 문서와 짝으로 유지. 새 API 추가 시 정책 수신 후 반영.
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper;
    private final UserDetailsServiceImpl userDetailsService;
    private final HostDetailService hostDetailService;
    private final AdminDetailsService adminDetailsService;
    private final PasswordEncoder passwordEncoder;


    private AuthenticationManager buildauthenticationManager(UserDetailsService uds) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(uds);
        provider.setPasswordEncoder(passwordEncoder);
        return new ProviderManager(provider);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity hs) throws Exception {
        // 일반회원 로그인 필터
        LoginFilter userLoginFilter = new LoginFilter(buildauthenticationManager(userDetailsService), objectMapper, jwtUtil);
        userLoginFilter.setFilterProcessesUrl("/api/auth/login");

        //호스트 로그인 필터
        LoginFilter hostLoginFilter = new LoginFilter(buildauthenticationManager(hostDetailService), objectMapper, jwtUtil);
        hostLoginFilter.setFilterProcessesUrl("/api/host/auth/login");

        //관리자 로그인 필터
        LoginFilter adminLoginFilter = new LoginFilter(buildauthenticationManager(adminDetailsService), objectMapper, jwtUtil);
        adminLoginFilter.setFilterProcessesUrl("/api/admin/auth/login");

        hs
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(
                        auth -> auth
                                // ── 로그인·가입 (공개) ──
                                .requestMatchers("/api/auth/**").permitAll()
                                .requestMatchers("/api/host/auth/**").permitAll()
                                .requestMatchers("/api/host/join/**").permitAll()
                                .requestMatchers("/api/admin/auth/**").permitAll()

                                //websocket
                                .requestMatchers("/ws/**").permitAll()

                                // ── 역할 prefix 보호 ──
                                .requestMatchers("/api/user/**").hasRole("USER")
                                .requestMatchers("/api/host/**").hasRole("HOST")
                                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                                // ══ 결제 도메인 (/api/payment) ══════════════════════════
                                // 기능 prefix 아래 user·host·admin이 섞여 있어 역할별로 개별 지정.
                                // ⚠️ 순서 규칙: 구체 경로(공개→HOST→USER) 먼저, 포괄 /**(ADMIN) 맨 뒤.
                                //    Spring Security는 위에서부터 첫 매칭을 적용하므로 순서가 곧 정책.

                                // ── 공개 ──
                                // PG 콜백 — 결제대행사가 토큰 없이 호출 → 반드시 공개
                                .requestMatchers(HttpMethod.GET, "/api/payment/pay/approve").permitAll()
                                // 쿠폰 이벤트 게시 목록 — 비로그인·user 모두 조회 (download(POST·USER)보다 위)
                                .requestMatchers(HttpMethod.GET, "/api/payment/coupon/event").permitAll()

                                // ── HOST (정산·통계·계좌) ──
                                .requestMatchers(HttpMethod.GET, "/api/payment/settlement/settle/host").hasRole("HOST")
                                // 정산 상세 — host(본인) + admin 둘 다 조회
                                .requestMatchers(HttpMethod.GET, "/api/payment/settlement/settle/{no}").hasAnyRole("HOST", "ADMIN")
                                .requestMatchers(HttpMethod.GET, "/api/payment/stats/host").hasRole("HOST")
                                .requestMatchers(HttpMethod.POST, "/api/payment/account").hasRole("HOST")
                                .requestMatchers(HttpMethod.GET, "/api/payment/account/host").hasRole("HOST")
                                // 수수료 정책 조회 — host(조회) + admin 둘 다 (등록 POST 는 catch-all 로 ADMIN)
                                .requestMatchers(HttpMethod.GET, "/api/payment/settlement/fee", "/api/payment/settlement/fee/**").hasAnyRole("HOST", "ADMIN")

                                // ── USER (결제·쿠폰·포인트·환불) ──
                                // 결제 상세 — user(본인) + admin 둘 다 (approve(permitAll)보다 아래)
                                .requestMatchers(HttpMethod.GET, "/api/payment/pay/{no}").hasAnyRole("USER", "ADMIN")
                                .requestMatchers(HttpMethod.POST, "/api/payment/pay/ready", "/api/payment/pay/toss/**").hasRole("USER")
                                .requestMatchers(HttpMethod.GET, "/api/payment/pay/member/**", "/api/payment/coupon/member/**",
                                        "/api/payment/point/member/**", "/api/payment/refund/member/**").hasRole("USER")
                                .requestMatchers(HttpMethod.POST, "/api/payment/coupon/event/*/download",
                                        "/api/payment/point/use", "/api/payment/refund").hasRole("USER")

                                // ── ADMIN (나머지 결제 도메인 전부 — 반드시 위 구체 경로들 다음) ──
                                .requestMatchers("/api/payment/**").hasRole("ADMIN")


                                // ══ 리뷰 도메인 (/api/review) ══════════════════════════
                                // ⚠️ 순서 규칙: 구체 경로(HOST→ADMIN→USER) 먼저, 공개 GET 맨 마지막.
                                //    report 경로는 메서드로 역할이 갈림(GET/PUT=ADMIN, POST=USER).
                                .requestMatchers(HttpMethod.GET, "/api/review/host/stats").hasRole("HOST")
                                .requestMatchers(HttpMethod.GET, "/api/review/report").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.PUT, "/api/review/report/**").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.GET, "/api/review/my").hasRole("USER")
                                .requestMatchers(HttpMethod.GET, "/api/review/helpful/*/mine").hasRole("USER")
                                .requestMatchers(HttpMethod.POST, "/api/review", "/api/review/report", "/api/review/reply",
                                        "/api/review/helpful").hasRole("USER")
                                .requestMatchers(HttpMethod.PUT, "/api/review/**").hasRole("USER")
                                .requestMatchers(HttpMethod.DELETE, "/api/review/**").hasRole("USER")
                                .requestMatchers(HttpMethod.GET, "/api/review", "/api/review/**").permitAll()

                                // ══ 예약 도메인 (/api/reservation) ══════════════════════════
                                // ⚠️ host·admin 구체 경로 먼저, 포괄 USER가 맨 뒤 (USER /** 가 host·admin 안 가리게).
                                .requestMatchers(HttpMethod.GET, "/api/reservation/host", "/api/reservation/host/**").hasRole("HOST")
                                .requestMatchers(HttpMethod.POST, "/api/reservation/*/reject").hasRole("HOST")
                                .requestMatchers(HttpMethod.GET, "/api/reservation/admin/**").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.POST, "/api/reservation/admin/**").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.POST, "/api/reservation", "/api/reservation/*/cancel").hasRole("USER")
                                .requestMatchers(HttpMethod.GET, "/api/reservation", "/api/reservation/**").hasRole("USER")

                                // 헬스 체크
                                .requestMatchers("/actuator/health").permitAll()

                                // ── 그 외 — 점진 도입 단계, 다른 담당자 API 진행 위해 일단 공개 ──
                                .anyRequest().permitAll()

                )
                .addFilterAt(userLoginFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(hostLoginFilter, userLoginFilter.getClass())
                .addFilterBefore(adminLoginFilter, userLoginFilter.getClass())
                .addFilterBefore(new JwtAuthenticationFilter(jwtUtil), LoginFilter.class)
                .cors(cors -> cors.configurationSource(new CorsConfigurationSource() {
                    @Override
                    public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
                        CorsConfiguration config = new CorsConfiguration();
                        config.setAllowedOrigins(List.of("http://localhost:5173", "https://sloway.store" , "https://www.sloway.store"));
                        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                        config.setAllowedHeaders(Collections.singletonList("*"));
                        config.setAllowCredentials(true);
                        config.setExposedHeaders(Collections.singletonList("Authorization"));
                        config.setMaxAge(3600L);
                        return config;
                    }
                }));

        return hs.build();

    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        // /ws로 시작하는 모든 요청을 Spring Security 필터 체인에서 제외
        return (web) -> web.ignoring().requestMatchers("/ws/**");
    }

}//class