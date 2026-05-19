package com.sloway.app.auth.config;


import com.sloway.app.auth.filter.JwtAuthenticationFilter;
import com.sloway.app.auth.filter.LoginFilter;
import com.sloway.app.auth.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
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
 * <h3>데모 모드</h3>
 * 모든 요청 permitAll(). 운영 전환 시 requestMatchers로 권한별 제한.
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final AuthenticationConfiguration authenticationConfiguration;
    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper;


    @Bean
    public AuthenticationManager authenticationManager() throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity hs) throws Exception {
        LoginFilter loginFilter = new LoginFilter(authenticationManager(), objectMapper, jwtUtil);
        loginFilter.setFilterProcessesUrl("/api/auth/login");

        hs
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(
                        auth -> auth
                                .anyRequest().permitAll()
                )
                .addFilterAt(loginFilter, UsernamePasswordAuthenticationFilter.class)
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