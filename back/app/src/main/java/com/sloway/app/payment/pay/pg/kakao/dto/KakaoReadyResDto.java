package com.sloway.app.payment.pay.pg.kakao.dto;

// 카카오페이 결제 준비(ready) 응답 DTO — 카카오가 돌려주는 값
//
// TODO: 클래스 어노테이션 — @Getter (+ 역직렬화용 @NoArgsConstructor)
//
// TODO: 필드 — 카카오 ready 응답 스펙(문서) 기준 중 필요한 것
//   tid, nextRedirectPcUrl, (모바일/앱 url 필요시), createdAt
//
//   ※ 카카오 응답 JSON 은 snake_case(next_redirect_pc_url). Jackson 매핑은
//      필드를 camelCase 로 두고 @JsonProperty("next_redirect_pc_url") 를 붙이거나,
//      ObjectMapper 의 SNAKE_CASE 전략 사용. 어느 쪽이든 일관되게.
public class KakaoReadyResDto {

    // TODO: 필드 선언
}
