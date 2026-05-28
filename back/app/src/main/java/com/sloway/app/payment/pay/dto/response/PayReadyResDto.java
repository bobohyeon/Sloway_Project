package com.sloway.app.payment.pay.dto.response;

// PayReadyResDto — readyPay 가 프론트(BookingPayment)에 돌려줄 응답.
//   카카오 응답(KakaoReadyResDto)을 그대로 넘기지 않고, 프론트에 필요한 것만 추려서 전달한다.
public class PayReadyResDto {

    // TODO: 클래스 어노테이션 — @Getter, @Builder (PayResDto.java 참고)

    // TODO: 필드 2개
    //   - payNo            : 결제 완료 후 어느 결제건인지 식별 (프론트 PaymentComplete 에서 findPayByNo 호출에 사용)
    //   - nextRedirectPcUrl: 카카오 결제창 주소 (프론트가 window.location.href 로 이동)
    //   타입 생각: payNo 는? url 은?

    // TODO: 정적 팩토리 메서드
    //   ※ PayResDto.from(entity) 와 다른 점:
    //      payNo 는 PayEntity 에서, nextRedirectPcUrl 은 KakaoReadyResDto 에서 온다 (출처가 2곳).
    //      → from(entity) 처럼 인자 1개로는 안 됨. 두 값을 받는 of(...) 를 둘지,
    //        아니면 서비스에서 builder 직접 호출할지 결정. (어제 정리한 of vs builder 트레이드오프 참고)
}
