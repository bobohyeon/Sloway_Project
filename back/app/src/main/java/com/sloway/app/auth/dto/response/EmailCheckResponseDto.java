package com.sloway.app.auth.dto.response;

import lombok.Builder;
import lombok.Getter;

/**
 * 이메일 중복확인 응답.
 *
 * <p>일반회원/호스트 가입 화면의 실시간 중복 체크용.
 * 이메일 사용 가능 여부 + 화면 표시용 메시지를 함께 제공.
 *
 * <p>※ 본 API는 "가입 가능 여부 사전 체크"이며, 가입 시 최종 검증은
 * AuthService.userJoin / HostJoinService.join 안에서 다시 수행됨.
 */
@Getter
@Builder
public class EmailCheckResponseDto {

    /** true = 사용 가능, false = 이미 가입됨 */
    private final boolean available;

    /** 화면 표시용 메시지 */
    private final String msg;

    /**
     * 사용 가능한 이메일 응답.
     */
    public static EmailCheckResponseDto available() {
        return EmailCheckResponseDto.builder()
                .available(true)
                .msg("사용 가능한 이메일입니다")
                .build();
    }

    /**
     * 이미 가입된 이메일 응답.
     */
    public static EmailCheckResponseDto unavailable() {
        return EmailCheckResponseDto.builder()
                .available(false)
                .msg("이미 가입된 이메일입니다")
                .build();
    }
}