package com.sloway.app.payment.pay.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MonthlySumDto {

    private String month;
    private Long sum;

}
