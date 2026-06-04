package com.sloway.app.auth.exception;

import org.springframework.security.core.AuthenticationException;

/**
 * 정지/탈퇴 계정 로그인 시도 예외.
 *
 * <p>UsernameNotFoundException은 DaoAuthenticationProvider의
 * hideUserNotFoundExceptions(기본 true)에 의해 BadCredentials로 가려져 메시지가 사라진다.
 * AuthenticationException을 직접 상속해 메시지(정지 사유)를 LoginFilter까지 그대로 전달.
 */
public class SuspendedAccountException extends AuthenticationException {
    public SuspendedAccountException(String message) {
        super(message);
    }
}