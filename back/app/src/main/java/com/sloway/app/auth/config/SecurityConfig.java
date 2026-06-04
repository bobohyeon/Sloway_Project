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

                                // ── 그 외 — 점진 도입 단계, 다른 담당자 API 진행 위해 일단 공개 ──
                                .anyRequest().permitAll()
                )
                .addFilterAt(userLoginFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(hostLoginFilter,userLoginFilter.getClass())
                .addFilterBefore(adminLoginFilter,userLoginFilter.getClass())
                .addFilterBefore(new JwtAuthenticationFilter(jwtUtil), LoginFilter.class)
                .cors(cors -> cors.configurationSource(new CorsConfigurationSource() {
                    @Override
                    public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
                        CorsConfiguration config = new CorsConfiguration();
                        config.setAllowedOrigins(Collections.singletonList("http://localhost:5173"));
                        config.setAllowedMethods(Collections.singletonList("*"));
                        config.setAllowedHeaders(Collections.singletonList("*"));
                        config.setAllowCredentials(true);
                        config.setExposedHeaders(Collections.singletonList("Authorization"));
                        config.setMaxAge(3600L);
                        return config;
                    }
                }));

        return hs.build();

    }

}//class