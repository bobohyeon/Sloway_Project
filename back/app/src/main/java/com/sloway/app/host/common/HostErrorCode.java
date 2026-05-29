package com.sloway.app.host.common;

import com.sloway.app.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

/**
 * 호스트 도메인 에러 코드.
 *
 * <p>HTTP 상태 + 사용자 노출 메시지를 한 자리에 모음.
 * Service에서 {@code throw new CustomException(HostErrorCode.XXX)} 형태로 사용.
 *
 * <h3>상태 코드 결정 기준</h3>
 * <ul>
 *   <li>404 NOT_FOUND       — 자원이 존재하지 않음</li>
 *   <li>409 CONFLICT        — 자원은 있으나 현재 상태와 충돌 (이미 처리됨 등)</li>
 *   <li>400 BAD_REQUEST     — 입력값 자체가 부적절</li>
 * </ul>
 */
@Getter
@RequiredArgsConstructor
public enum HostErrorCode implements ErrorCode {

    HOST_NOT_FOUND(HttpStatus.NOT_FOUND, "호스트 신청 정보를 찾을 수 없습니다"),
    INVALID_APPROVAL_STATE(HttpStatus.CONFLICT, "대기 중인 신청만 처리할 수 있습니다"),
    REJECT_REASON_REQUIRED(HttpStatus.BAD_REQUEST, "반려 사유를 입력해주세요"),
    DUPLICATE_BUSINESS_NO(HttpStatus.CONFLICT, "이미 등록된 사업자등록번호입니다"),
    MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "회원 정보를 찾을 수 없습니다");

    private final HttpStatus status;
    private final String msg;
}