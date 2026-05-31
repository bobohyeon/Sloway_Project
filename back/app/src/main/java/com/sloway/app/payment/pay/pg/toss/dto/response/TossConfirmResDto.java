package com.sloway.app.payment.pay.pg.toss.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

// 토스페이먼츠 결제 승인(confirm) 응답 DTO — Payment 객체 중 우리가 쓸 필드만
// 토스 응답 JSON은 camelCase라 Jackson 기본 매핑이 그대로 먹음 (카카오와 다른 점 — @JsonProperty 불필요)
// 단, Payment 객체엔 card/virtualAccount/receipt 등 수십 개 필드가 같이 오므로
// ignoreUnknown = true 안 붙이면 모르는 필드에서 역직렬화 폭발 → 필수
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@JsonIgnoreProperties(ignoreUnknown = true)
public class TossConfirmResDto {

    private String paymentKey;   // 토스 결제 고유 키 — 취소/조회에 쓰이므로 PayEntity에 저장 필요
    private String orderId;      // 우리가 보낸 주문번호
    private String status;       // "DONE"이면 결제 완료 → PayEntity COMPLETED 전이
    private Integer totalAmount; // 총 결제 금액
    private String method;       // "카드" / "간편결제" 등 (한글 노출명)
    private String approvedAt;   // 승인 시각 (ISO8601 + 09:00 문자열)
}
