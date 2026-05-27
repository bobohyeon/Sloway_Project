package com.sloway.app.payment.pay.pg.kakao.dto;

// 카카오페이 결제 승인(approve) 요청 DTO
//
// TODO: 클래스 어노테이션 — @Getter @Builder
//
// TODO: 필드 — 카카오 approve 요청 스펙(문서) 기준
//   cid, tid, partnerOrderId, partnerUserId, pgToken
//
//   ※ tid 는 ready 응답에서 받은 값을 보관했다가 사용 (PayEntity.tid 필드 활용 가능)
//   ※ pgToken 은 사용자 결제 인증 후 approval_url 로 돌아올 때 받는 값
public class KakaoApproveReqDto {

    // TODO: 필드 선언
}
