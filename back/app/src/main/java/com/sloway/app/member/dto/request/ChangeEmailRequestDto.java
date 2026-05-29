package com.sloway.app.member.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** 이메일 변경 요청 — 새 이메일 (인증 완료된 상태여야 함) */
@Getter
@Setter
@NoArgsConstructor
public class ChangeEmailRequestDto {
    private String newEmail;
}