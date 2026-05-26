package com.sloway.app.payment.couponevent.dto.request;

import lombok.*;

@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class CouponDownloadReqDto {

    private Long memberNo;
}
