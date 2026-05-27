package com.sloway.app.payment.pay.pg.kakao.client;

// 카카오페이 연동 클라이언트 (신버전 오픈 API — 강사 예제 기준)
//
// 결제 흐름:
//   1) ready   : 서버 → 카카오. tid + 결제 redirect URL 발급
//   2) (사용자) : redirect URL 에서 인증 → approval_url 로 pg_token 받고 복귀
//   3) approve : 서버 → 카카오. pg_token 으로 최종 승인 → 결제 완료
//
// 호출 공통 (강사 코드 = 현재 공식 방식):
//   - base url : https://open-api.kakaopay.com/online/v1
//   - 헤더      : Authorization = "SECRET_KEY {dev secret key}"   ← KakaoAK 아님!
//                Content-Type = "application/json"               ← form 아님, JSON 바디
//   - cid 테스트: TC0ONETIME
//   - 키/url 은 application-secret.properties → @Value 주입 (코드 인라인 절대 금지)
//
// 구조: 강사님 Controller 의 HTTP 호출 부분만 여기(Client)로 옮긴다.
//       비즈니스 흐름(PayEntity 저장/상태전이/세션 or tid 보관)은 PayService 담당.
//
// RestTemplate 사용 흐름 (강사 HttpURLConnection 대체):
//   - HttpHeaders 에 Authorization / Content-Type 세팅
//   - new HttpEntity<>(reqDto, headers) 로 바디+헤더 묶기
//   - restTemplate.postForObject(url, entity, KakaoXxxResDto.class) 로 호출 + 응답 자동 매핑
//
// TODO: 클래스 어노테이션 — @Component / @RequiredArgsConstructor / @Slf4j
// TODO: 의존성 — RestTemplate + @Value (cid / secret-key / base-url)
public class KakaoPayClient {

    // TODO: ready(KakaoReadyReqDto ...) → KakaoReadyResDto
    //   - POST {base}/payment/ready (JSON)
    //   - 강사 callApi() 의 ready 호출부 참고 (URL/헤더/바디 필드)
    //   - 응답에서 tid + next_redirect_pc_url 가 핵심

    // TODO: approve(KakaoApproveReqDto ...) → KakaoApproveResDto
    //   - POST {base}/payment/approve (JSON)
    //   - 강사 callback() 의 approve 호출부 참고
}
