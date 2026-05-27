package com.sloway.app.payment.pay.pg.kakao.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.sloway.app.payment.pay.common.KakaoStatus;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@JsonIgnoreProperties(ignoreUnknown = true)
public class KakaoCancelResDto {

    private String aid;
    private String tid;
    private String cid;
    private KakaoStatus status;
    @JsonProperty("partner_order_id")
    private String partnerOrderId;
    @JsonProperty("partner_user_id")
    private String partnerUserId;
    @JsonProperty("payment_method_type")
    private String paymentMethodType;
    private Amount amount;
    @JsonProperty("approved_cancel_amount")
    private ApprovedCancelAmount approvedCancelAmount;
    @JsonProperty("canceled_amount")
    private CanceledAmount canceledAmount;
    @JsonProperty("cancel_available_amount")
    private CancelAvailableAmount cancelAvailableAmount;
    @JsonProperty("item_name")
    private String itemName;
    @JsonProperty("item_code")
    private String itemCode;
    private String quantity;
    @JsonProperty("created_at")
    private String createdAt;
    @JsonProperty("approved_at")
    private String approvedAt;
    @JsonProperty("canceled_at")
    private String canceledAt;
    private String payload;

    @Getter
    @NoArgsConstructor
    public static class Amount{
        private Integer total;
        @JsonProperty("tax_free")
        private Integer taxFree;
        private Integer vat;
        private Integer point;
        private Integer discount;
    }

    @Getter
    @NoArgsConstructor
    public static class ApprovedCancelAmount{
        private Integer total;
        @JsonProperty("tax_free")
        private Integer taxFree;
        private Integer vat;
        private Integer point;
        private Integer discount;
    }

    @Getter
    @NoArgsConstructor
    public static class CanceledAmount{
        private Integer total;
        @JsonProperty("tax_free")
        private Integer taxFree;
        private Integer vat;
        private Integer point;
        private Integer discount;
    }

    @Getter
    @NoArgsConstructor
    public static class CancelAvailableAmount{
        private Integer total;
        @JsonProperty("tax_free")
        private Integer taxFree;
        private Integer vat;
        private Integer point;
        private Integer discount;
    }
}
