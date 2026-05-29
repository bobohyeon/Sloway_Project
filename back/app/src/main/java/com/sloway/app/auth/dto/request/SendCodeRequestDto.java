package com.sloway.app.auth.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 이메일 인증번호 발송 요청.
 *
 * <p>가입 화면에서 [인증번호 발송] 버튼 클릭 시 호출.
 */
@Getter
@Setter
@NoArgsConstructor
public class SendCodeRequestDto {

    /** 인증번호 받을 이메일 */
    private String email;
}