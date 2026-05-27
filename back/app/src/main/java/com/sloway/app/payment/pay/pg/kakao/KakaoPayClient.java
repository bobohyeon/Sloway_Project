package com.sloway.app.payment.pay.pg.kakao;

// 카카오페이 연동 클라이언트 — ready / approve 2단계 호출
//
// 결제 흐름:
//   1) ready   : 서버 → 카카오. tid + 결제 redirect URL 발급
//   2) (사용자) : redirect URL 에서 결제 인증 → approval_url 로 pg_token 받고 복귀
//   3) approve : 서버 → 카카오. pg_token 으로 최종 승인 → 결제 완료
//
// 호출 공통(문서 확인):
//   - base url   : https://kapi.kakao.com  (application-secret.properties 에서 주입)
//   - 헤더        : Authorization = "KakaoAK {admin key}", Content-Type = application/x-www-form-urlencoded;charset=utf-8
//   - 요청 바디    : form 형식(MultiValueMap) — JSON 아님 주의
//   - cid 테스트값 : TC0ONETIME
//
// TODO: 클래스 어노테이션 — @Component / @RequiredArgsConstructor / @Slf4j
//
// TODO: 의존성 — RestTemplate + @Value 로 설정값 주입 (cid / admin-key / base-url)
public class KakaoPayClient {

    // TODO: ready(...) 메서드
    //   - POST {base}/v1/payment/ready
    //   - 요청 파라미터(문서): cid, partner_order_id, partner_user_id, item_name,
    //                       quantity, total_amount, tax_free_amount,
    //                       approval_url, cancel_url, fail_url
    //   - 응답 → KakaoReadyResDto (tid, next_redirect_pc_url)
    //   - 매개변수/반환 타입은 본인이 결정 (KakaoReadyReqDto 받아서 처리할지 등)

    // TODO: approve(...) 메서드
    //   - POST {base}/v1/payment/approve
    //   - 요청: cid, tid, partner_order_id, partner_user_id, pg_token
    //   - 응답 → KakaoApproveResDto (aid, tid, amount 등)
}
