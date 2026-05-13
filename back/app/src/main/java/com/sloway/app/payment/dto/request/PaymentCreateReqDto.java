package com.sloway.app.payment.dto.request;

import com.sloway.app.payment.common.PaymentMethod;
import com.sloway.app.payment.common.PaymentStatus;
import com.sloway.app.payment.entity.PaymentEntity;
import lombok.Getter;

@Getter
public class PaymentCreateReqDto {

    private Long rsvnNo;
    private PaymentMethod method;
    private Integer baseAmt;
    private Integer addAmt;

    public PaymentEntity toEntity(){
        return PaymentEntity.builder()
                .rsvnNo(rsvnNo)
                .method(method)
                .baseAmt(baseAmt)
                .addAmt(addAmt)
                .finalAmt(baseAmt+addAmt)
                .status(PaymentStatus.READY)
                .usedPoint(0)
                .dcAmt(0)
                .build();
    }
}
