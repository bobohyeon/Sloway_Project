package com.sloway.app.auth.dto.response;

import lombok.Builder;
import lombok.Getter;

/**
 * 아이디(이메일) 찾기 응답.
 * 보안상 이메일은 마스킹해서 전달 (예: hong***@sloway.com).
 */
@Getter
@Builder
public class FindEmailResponseDto {
    private String maskedEmail;
}