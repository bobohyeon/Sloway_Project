package com.sloway.app.common.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /** 비즈니스 예외 — ErrorCode가 HTTP 상태·메시지 결정 */
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ErrorResponseDto> handleCustomException(CustomException e) {
        ErrorCode errorCode = e.getErrorCode();
        log.warn("비즈니스 예외: {} - {}", errorCode.getClass().getSimpleName(), errorCode.getMsg());
        return ResponseEntity
                .status(errorCode.getStatus())
                .body(new ErrorResponseDto(errorCode.getMsg()));
    }

    /**
     * 입력값 검증 실패 — 400.
     * <p>D5에 @Valid + CustomException으로 전면 교체 예정. 그때까지의 안전망.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponseDto> handleIllegalArgument(IllegalArgumentException e) {
        log.warn("잘못된 입력: {}", e.getMessage());
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponseDto(e.getMessage()));
    }

    /** 미처리 예외 — 500. 운영 중 메시지 노출 방지. */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDto> handleException(Exception e) {
        log.error("예상치 못한 예외 발생", e);
        return ResponseEntity
                .internalServerError()
                .body(new ErrorResponseDto("서버 처리 중 오류가 발생했습니다"));
    }
}