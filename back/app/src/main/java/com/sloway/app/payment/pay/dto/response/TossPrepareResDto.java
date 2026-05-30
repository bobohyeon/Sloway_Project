package com.sloway.app.payment.pay.dto.response;

// 토스 결제 준비(prepare) 응답 DTO — 프론트가 토스 SDK requestPayment() 호출 시 쓸 값
//
// TODO: 클래스 어노테이션 — @Getter @Builder (PayReadyResDto 참고)
//
// TODO: 필드 선언 — 프론트 SDK가 결제창 열 때 필요한 것만
//   - orderId   (String)  : "SLOWAY_" + payNo  ← confirm 때 이 값으로 결제 매칭
//   - amount    (Integer) : finalAmt           ← SDK amount + 나중에 위변조 검증 기준
//   - orderName (String)  : 결제창에 표시될 주문명 (예: "Sloway 공간예약")
//   ※ payNo도 같이 내려주면 프론트 confirm/complete 흐름이 편할 수 있음 (설계 선택)
//
// TODO: static of(PayEntity entity, ...) 팩토리 메서드
//   힌트: PayReadyResDto.of(...) 패턴 — 빌더로 entity 값 꺼내 매핑
public class TossPrepareResDto {

    // TODO: 필드 + 팩토리 메서드
}
