package com.sloway.app.payment.pay.dto.response;

import com.sloway.app.payment.pay.entity.PayEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TossPrepareResDto {

    private Long payNo;
    private String orderId;
    private Integer amount;
    private String orderName;

    public static TossPrepareResDto of(PayEntity payEntity, String orderId) {
        return TossPrepareResDto.builder()
                .payNo(payEntity.getNo())
                .orderId(orderId)
                .amount(payEntity.getFinalAmt())
                .orderName("Sloway 공간예약")
                .build();
    }
}
