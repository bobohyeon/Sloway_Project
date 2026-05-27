package com.sloway.app.payment.pay.pg.toss.dto;

// 토스페이먼츠 결제 승인(confirm) 응답 DTO — 결제 최종 결과
//
// TODO: 클래스 어노테이션 — @Getter (+ @NoArgsConstructor)
//
// TODO: 필드 — 토스 confirm 응답 중 우리가 쓸 것
//   paymentKey, orderId, status, totalAmount, method, approvedAt
//
//   ※ status 가 "DONE" 이면 결제 완료 → PayEntity COMPLETED 전이
//   ※ 토스 응답 JSON 은 camelCase 라 Jackson 기본 매핑이 그대로 먹음 (카카오와 다른 점)
public class TossConfirmResDto {

    // TODO: 필드 선언
}
