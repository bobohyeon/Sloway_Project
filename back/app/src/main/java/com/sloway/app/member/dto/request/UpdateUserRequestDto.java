package com.sloway.app.member.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 일반회원 마이페이지 수정 요청.
 *
 * <p>수정 가능 필드만 받음. 이메일/비번/생년월일은 별도 API 또는 변경 불가.

 */
@Getter
@Setter
@NoArgsConstructor
public class UpdateUserRequestDto {

    /** 이름 (null이면 변경 안 함) */
    private String name;

    /** 전화번호 (null이면 변경 안 함) */
    private String phone;

    /** 프로필 이미지 URL (null이면 변경 안 함, 빈 문자열이면 제거) */
    private String imgUrl;
}