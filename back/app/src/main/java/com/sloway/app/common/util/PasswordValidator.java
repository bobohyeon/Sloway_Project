package com.sloway.app.common.util;

import com.sloway.app.common.exception.CustomException;
import com.sloway.app.member.common.MemberErrorCode;
import java.util.regex.Pattern;

/**
 * 비밀번호 정책 검증 유틸.
 * 정책: 8자 이상 + 영문 + 숫자 + 특수문자 각 1개 이상.
 * 회원가입/비번변경/비번재설정 등 비번이 설정되는 모든 지점에서 공통 사용.
 */
public final class PasswordValidator {

    // 영문/숫자/특수문자 각 1개 이상 + 8자 이상
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
            "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=]).{8,}$"
    );

    private PasswordValidator() {} // 인스턴스화 방지

    /**
     * 비밀번호 정책 검증. 위반 시 CustomException.
     */
    public static void validate(String password) {
        if (password == null || !PASSWORD_PATTERN.matcher(password).matches()) {
            throw new CustomException(MemberErrorCode.PASSWORD_TOO_SHORT);
        }
    }
}