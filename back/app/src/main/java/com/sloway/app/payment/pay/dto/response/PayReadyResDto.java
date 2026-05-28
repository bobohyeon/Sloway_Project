package com.sloway.app.payment.pay.dto.response;

import com.sloway.app.payment.pay.entity.PayEntity;
import com.sloway.app.payment.pay.pg.kakao.dto.response.KakaoReadyResDto;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PayReadyResDto {

    private Long payNo;
    private String nextRedirectAppUrl;
    private String nextRedirectMobileUrl;
    private String nextRedirectPcUrl;
    private String createdAt;

    public static  PayReadyResDto of(PayEntity payEntity, KakaoReadyResDto kakaoReadyResDto){
        return PayReadyResDto.builder()
                .payNo(payEntity.getNo())
                .nextRedirectAppUrl(kakaoReadyResDto.getNextRedirectAppUrl())
                .nextRedirectMobileUrl(kakaoReadyResDto.getNextRedirectMobileUrl())
                .nextRedirectPcUrl(kakaoReadyResDto.getNextRedirectPcUrl())
                .build();
    }

}
