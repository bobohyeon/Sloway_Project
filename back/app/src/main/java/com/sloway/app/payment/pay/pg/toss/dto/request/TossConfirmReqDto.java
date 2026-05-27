package com.sloway.app.payment.pay.pg.toss.dto.request;

// 토스페이먼츠 결제 승인(confirm) 요청 DTO
//
// TODO: 클래스 어노테이션 — @Getter @Builder
//
// TODO: 필드 — 토스 confirm 요청 스펙(문서) 기준 (3개)
//   paymentKey, orderId, amount
//
//   ※ 토스는 JSON 전송이라 카카오처럼 snake_case 변환 고민 없음 (필드명 그대로)
//   ※ 이 3개는 프론트 결제창 성공 콜백에서 넘어온 값을 그대로 서버로 전달받는 구조
public class TossConfirmReqDto {

    // TODO: 필드 선언
}
