package com.sloway.app.payment.pay.dto.response;

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


    // TODO: 정적 팩토리 메서드
    //   ※ PayResDto.from(entity) 와 다른 점:
    //      payNo 는 PayEntity 에서, nextRedirectPcUrl 은 KakaoReadyResDto 에서 온다 (출처가 2곳).
    //      → from(entity) 처럼 인자 1개로는 안 됨. 두 값을 받는 of(...) 를 둘지,
    //        아니면 서비스에서 builder 직접 호출할지 결정. (어제 정리한 of vs builder 트레이드오프 참고)

    public static  PayReadyResDto of(){
        return PayReadyResDto.builder()
                .payNo()
                .nextRedirectAppUrl()
                .nextRedirectMobileUrl()
                .nextRedirectPcUrl()
                .build();
    }

}
