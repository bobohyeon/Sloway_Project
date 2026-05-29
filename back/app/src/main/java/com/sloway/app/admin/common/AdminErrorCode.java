package com.sloway.app.admin.common;

import com.sloway.app.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

/**
 * 어드민 도메인 에러 코드.
 *
 * <p>어드민 본인 정보 조회/수정, 회원 관리(D4), 호스트 자격 관리(D4)에서 사용.
 *
 * <h3>상태 코드 결정 기준</h3>
 * <ul>
 *   <li>404 NOT_FOUND    — 자원 부재</li>
 *   <li>409 CONFLICT     — 자원은 있으나 현재 상태와 충돌</li>
 *   <li>400 BAD_REQUEST  — 입력값 부적절</li>
 * </ul>
 */
@Getter
@RequiredArgsConstructor
public enum AdminErrorCode implements ErrorCode {

    ADMIN_NOT_FOUND(HttpStatus.NOT_FOUND, "어드민 정보를 찾을 수 없습니다");

    private final HttpStatus status;
    private final String msg;

}
