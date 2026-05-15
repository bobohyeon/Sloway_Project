package com.sloway.app.payment.settlement.settle.dto.request;

import com.sloway.app.payment.settlement.settle.common.SettleStatus;
import com.sloway.app.payment.settlement.settle.entity.SettleEntity;
import jakarta.persistence.Column;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
public class SettleCreateReqDto {

    private Long hostNo;
    private LocalDate settleStartDate;
    private LocalDate settleEndDate;

    public SettleEntity toEntity() {
        return SettleEntity.builder()
                .hostNo(hostNo)
                .settleStartDate(settleStartDate)
                .settleEndDate(settleEndDate)
                .status(SettleStatus.WAITING)
                .build();
    }
}
