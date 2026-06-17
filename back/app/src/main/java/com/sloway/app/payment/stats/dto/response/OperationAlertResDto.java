package com.sloway.app.payment.stats.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class OperationAlertResDto {

    private Long newMemberCount;   // 오늘 신규 회원가입 수
    private Long payCount;         // 오늘 결제 건
    private Long refundCount;      // 오늘 환불 건

    public static OperationAlertResDto of(Long newMemberCount, Long payCount, Long refundCount) {
        return OperationAlertResDto.builder()
                .newMemberCount(newMemberCount)
                .payCount(payCount)
                .refundCount(refundCount)
                .build();
    }
}
