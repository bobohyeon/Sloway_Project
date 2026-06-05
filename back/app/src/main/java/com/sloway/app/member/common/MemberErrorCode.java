package com.sloway.app.member.common;

import com.sloway.app.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

/**
 * 회원 공통 도메인 에러 코드.
 *
 * <p>일반회원/호스트 모두가 공유하는 Member 테이블 관련 에러.
 * 어드민이 회원을 다루는 액션의 에러도 여기에 통합.
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
public enum MemberErrorCode implements ErrorCode {

    MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "회원 정보를 찾을 수 없습니다"),
    INVALID_MEMBER_STATE(HttpStatus.CONFLICT, "현재 상태에서 처리할 수 없습니다"),
    SUSPEND_REASON_REQUIRED(HttpStatus.BAD_REQUEST, "정지 사유를 입력해주세요"),

    // ─── D6 — 이메일 인증 ───────────────────────────
    INVALID_VERIFY_CODE(HttpStatus.BAD_REQUEST, "인증번호가 일치하지 않습니다"),
    EXPIRED_VERIFY_CODE(HttpStatus.BAD_REQUEST, "인증번호가 만료되었습니다. 재발송해주세요"),
    ALREADY_VERIFIED(HttpStatus.CONFLICT, "이미 인증된 코드입니다"),
    EMAIL_DUPLICATED(HttpStatus.CONFLICT, "이미 사용 중인 이메일입니다"),
    SAME_AS_OLD_EMAIL(HttpStatus.BAD_REQUEST, "현재 이메일과 동일합니다"),
    EMAIL_NOT_VERIFIED(HttpStatus.BAD_REQUEST, "이메일 인증이 완료되지 않았습니다"),

    // ─── 비밀번호 변경 ─────────────────────── ← 새로 추가
    WRONG_CURRENT_PASSWORD(HttpStatus.BAD_REQUEST, "현재 비밀번호가 일치하지 않습니다"),
    SAME_AS_OLD_PASSWORD(HttpStatus.BAD_REQUEST, "새 비밀번호는 현재 비밀번호와 달라야 합니다"),
    PASSWORD_TOO_SHORT(HttpStatus.BAD_REQUEST, "비밀번호는 8자 이상이며 영문·숫자·특수문자를 포함해야 합니다");

    private final HttpStatus status;
    private final String msg;
    }