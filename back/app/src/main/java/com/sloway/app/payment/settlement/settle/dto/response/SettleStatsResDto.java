package com.sloway.app.payment.settlement.settle.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SettleStatsResDto {
    private long waiting;
    private long complete;
    private long invoice;
    private long totalPayout;

}
