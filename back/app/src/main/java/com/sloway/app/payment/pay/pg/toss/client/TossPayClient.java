package com.sloway.app.payment.pay.pg.toss.client;

// 토스페이먼츠 연동 클라이언트 — 흐름이 카카오와 다름(주의)
//
// 결제 흐름(토스):
//   1) (클라) 프론트 SDK 가 결제창 호출 → 결제 성공 시 paymentKey / orderId / amount 를 받음
//   2) confirm : 서버 → 토스. 위 3개로 결제 최종 승인
//   → 카카오의 ready/approve 2단계와 달리, 서버측 핵심은 confirm 1단계
//
// 호출 공통(문서 확인):
//   - confirm url : POST https://api.tosspayments.com/v1/payments/confirm
//   - 헤더         : Authorization = "Basic " + base64(secretKey + ":")  ← 콜론 뒤 비밀번호 빈 값
//   - 요청 바디     : JSON ({ paymentKey, orderId, amount })  ← 카카오(form)와 달리 JSON
//   - 테스트 키     : test_sk_... (토스 개발자센터에서 발급, 가입 필요)
//
// TODO: 클래스 어노테이션 — @Component / @RequiredArgsConstructor / @Slf4j
// TODO: 의존성 — RestTemplate + @Value (secret-key / base-url)
public class TossPayClient {

    // TODO: confirm(...) 메서드
    //   - POST {base}/v1/payments/confirm
    //   - 요청: paymentKey, orderId, amount (JSON)
    //   - 응답 → TossConfirmResDto (paymentKey, orderId, status, totalAmount 등)
}
