package com.sloway.app.auth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

/**
 * 로그인 응답 DTO.
 *
 * <p>로그인 성공 시 토큰 + 최소 회원정보를 클라이언트에 반환.
 */
@Getter
@Builder
@AllArgsConstructor

public class LoginResponseDto {
    private String accessToken;
    private String refreshToken;
    private Long memberNo;
    private String email;
    private String role;
    private String imgurl;
}
