package com.sloway.app.payment.pay.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder(toBuilder = true)
public class PayStatsResDto {
    private long total;
    private long completed;
    private long completedAmt;
    private long refunded;     // 카드용 — 실제 환불(refund 테이블) 완료 건수
    private long canceledPay;  // 탭용 — 취소된 결제(PAY.CANCELED) 건수. 환불 탭 목록과 일치
    private long failed;
}
