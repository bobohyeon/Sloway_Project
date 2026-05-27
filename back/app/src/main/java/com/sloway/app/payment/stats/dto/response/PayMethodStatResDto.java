package com.sloway.app.payment.stats.dto.response;

import com.sloway.app.payment.pay.common.PayMethod;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PayMethodStatResDto {

    private PayMethod payMethod;
    private Integer payCount;
    private Integer totalAmt;

    public static PayMethodStatResDto of(PayMethod payMethod,Integer payCount ,Integer totalAmt) {
        return PayMethodStatResDto.builder()
                .payMethod(payMethod)
                .payCount(payCount)
                .totalAmt(totalAmt)
                .build();
    }


}
