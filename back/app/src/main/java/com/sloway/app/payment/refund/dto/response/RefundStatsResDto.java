package com.sloway.app.payment.refund.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RefundStatsResDto {
    private long total;        // 전체 환불 건수
    private long processing;   // 처리 중 (REQUESTED/APPROVED)
    private long completed;    // 처리 완료 (COMPLETED)
    private long hostRejected; // 호스트 거절 (reason null + rate FULL)
}
