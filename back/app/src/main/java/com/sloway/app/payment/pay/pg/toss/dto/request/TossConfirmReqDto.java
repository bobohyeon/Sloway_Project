package com.sloway.app.payment.pay.pg.toss.dto.request;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

// 토스페이먼츠 결제 승인(confirm) 요청 DTO
// 토스는 JSON(camelCase) 전송이라 카카오처럼 @JsonProperty(snake_case) 변환이 필요 없음 — 필드명 그대로 직렬화됨
// 카카오 ReqDto 패턴과 동일하게 pg 전용 DTO → @Getter @Builder 중심
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class TossConfirmReqDto {

    // 프론트 결제창 성공 콜백에서 넘어온 3개 값을 그대로 토스 서버로 전달
    private String paymentKey; // 토스가 발급한 결제 고유 키
    private String orderId;    // 우리가 prepare 단계에서 발급한 주문번호 ("SLOWAY_" + payNo)
    private Integer amount;    // 결제 금액 — confirm 전 서버 finalAmt와 일치 검증 필요(위변조 방어)
}
