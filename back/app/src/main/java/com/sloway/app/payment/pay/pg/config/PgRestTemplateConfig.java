package com.sloway.app.payment.pay.pg.config;

// 외부 PG(카카오/토스) 호출용 RestTemplate Bean 설정
//
// TODO: 클래스 어노테이션 — @Configuration
//
// TODO: @Bean 으로 RestTemplate 하나 등록
//       - 카카오/토스 공용으로 쓰고, 인증 헤더는 각 Client 에서 요청마다 세팅
//       - (선택) connectTimeout / readTimeout 설정은 나중에
//
// 참고: WebClient 로 가도 되지만, 학습 부담 줄이려면 RestTemplate 가 단순
//       (PayService 등 다른 곳은 외부 호출이 없어 지금까진 RestTemplate 가 없었음)
public class PgRestTemplateConfig {

    // TODO: @Bean RestTemplate restTemplate() { ... }
}
