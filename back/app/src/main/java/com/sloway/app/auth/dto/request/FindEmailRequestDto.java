package com.sloway.app.auth.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 아이디(이메일) 찾기 요청.
 * 이름 + 전화번호로 가입된 이메일을 조회.
 */
@Getter
@NoArgsConstructor
public class FindEmailRequestDto {
    private String name;
    private String phone;
}