package com.sloway.app.payment.pay.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PayStatsResDto {
    private long total;
    private long completed;
    private long completedAmt;
    private long refunded;
    private long failed;
}
