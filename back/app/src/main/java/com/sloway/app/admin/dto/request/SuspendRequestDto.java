package com.sloway.app.admin.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 회원 정지 요청 입력.
 */
@Getter
@Setter
@NoArgsConstructor
public class SuspendRequestDto {

    /** 정지 사유 (필수, 회원에게 노출됨) */
    private String reason;

    /** 정지 기간 (일 단위). null/음수 = 영구 정지 */
    private Integer days;
}