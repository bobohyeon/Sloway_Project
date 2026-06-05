package com.sloway.app.payment.stats.dto.response;

import com.sloway.app.payment.pay.common.PayMethod;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PayMethodStatResDto {

    private PayMethod payMethod;
    private Integer payCount;
    private Long totalAmt;   // 결제수단별 월 매출 — int 오버플로우 방지로 Long

    public static PayMethodStatResDto of(PayMethod payMethod, Integer payCount, Long totalAmt) {
        return PayMethodStatResDto.builder()
                .payMethod(payMethod)
                .payCount(payCount)
                .totalAmt(totalAmt)
                .build();
    }


}
