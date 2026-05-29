package com.sloway.app.payment.pay.pg.kakao.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Builder(toBuilder = true)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class KakaoCancelReqDto {

    private String cid;
    private String tid;

    @JsonProperty("cancel_amount")
    private Integer cancelAmount;

    @JsonProperty("cancel_tax_free_amount")
    private Integer cancelTaxFreeAmount;

}
