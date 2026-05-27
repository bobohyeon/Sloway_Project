package com.sloway.app.payment.pay.pg.kakao.dto;

// 카카오페이 결제 준비(ready) 요청 DTO — 서버가 카카오로 보낼 값
//
// TODO: 클래스 어노테이션 — @Getter @Builder (+ 필요 시 @NoArgs/@AllArgs)
//
// TODO: 필드 — 카카오 ready 요청 스펙(문서) 기준
//   cid, partnerOrderId, partnerUserId, itemName, quantity,
//   totalAmount, taxFreeAmount, approvalUrl, cancelUrl, failUrl
//
//   ※ 카카오 파라미터명은 snake_case(partner_order_id 등). form 전송 시
//      MultiValueMap 에 담을 때 키를 snake_case 로 맞춰야 함 (이 DTO 필드는 camelCase 두고
//      Client 에서 매핑하거나, 전송 직전에 키 변환). 어느 방식이 깔끔할지 본인 결정.
public class KakaoReadyReqDto {

    // TODO: 필드 선언
}
