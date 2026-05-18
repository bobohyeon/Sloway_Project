package com.sloway.app.auth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * 비밀번호 암호화 Bean
 *
 * <p>BCrypt는 단방향 해시 + salt 자동 처리. 같은 비밀번호도 매번 다른 해시.
 * 검증은 {@code encoder.matches(rawPassword, encodedPassword)}로.
 */
@Configuration
public class PasswordConfig {

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
