package com.sloway.app.payment.pay.pg.kakao.dto.request;

// 카카오페이 결제 승인(approve) 요청 DTO — JSON 바디
//
// TODO: 클래스 어노테이션 — @Getter @Builder
//
// TODO: 필드 — 강사 callback() jsonMap 키와 동일 (approve 요청 스펙)
//   cid, tid, partnerOrderId, partnerUserId, pgToken
//
//   ※ tid : ready 응답에서 받은 값을 보관했다가 사용
//           (강사는 세션 저장 → 본인은 PayEntity.tid 에 저장하는 방향 고려)
//   ※ pgToken : 사용자 인증 후 approval_url 로 돌아올 때 쿼리로 받는 값
//   ※ snake_case 매핑은 ReqDto 와 동일 방식(@JsonProperty)
public class KakaoApproveReqDto {

    // TODO: 필드 선언
}
