package com.sloway.app.payment.settlement.settle.dto.request;

import com.sloway.app.host.entity.HostEntity;
import com.sloway.app.payment.settlement.settle.common.SettleStatus;
import com.sloway.app.payment.settlement.settle.entity.SettleEntity;
import lombok.*;

import java.time.LocalDate;

@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class SettleCreateReqDto {

    private Long hostNo;
    private LocalDate settleStartDate;
    private LocalDate settleEndDate;

    public SettleEntity toEntity(HostEntity hostEntity) {
        return SettleEntity.builder()
                .hostNo(hostEntity)
                .settleStartDate(settleStartDate)
                .settleEndDate(settleEndDate)
                .status(SettleStatus.WAITING)
                .build();
    }
}
