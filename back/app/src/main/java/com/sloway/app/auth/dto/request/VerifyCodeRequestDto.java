package com.sloway.app.auth.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 이메일 인증번호 확인 요청.
 *
 * <p>사용자가 메일로 받은 6자리 코드를 가입 화면에 입력 → [인증] 버튼 클릭 시 호출.
 */
@Getter
@Setter
@NoArgsConstructor
public class VerifyCodeRequestDto {

    /** 인증 대상 이메일 */
    private String email;

    /** 사용자 입력 6자리 코드 */
    private String code;
}