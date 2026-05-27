package com.sloway.app.payment.pay.pg.kakao.dto;

// 카카오페이 결제 승인(approve) 응답 DTO — 결제 최종 결과
//
// TODO: 클래스 어노테이션 — @Getter (+ @NoArgsConstructor)
//
// TODO: 필드 — 카카오 approve 응답 중 우리가 쓸 것
//   aid, tid, cid, partnerOrderId, paymentMethodType,
//   amount(중첩 객체: total 등), itemName, approvedAt
//
//   ※ amount 는 카카오 응답에서 중첩 JSON({"total":..,"tax_free":..}). 중첩 DTO 로 받거나
//      필요한 값(total)만 평탄화해서 받을지 본인 결정.
//   ※ 이 응답을 받으면 PayEntity 를 COMPLETED 로 전이 (기존 completeAsLevel1 → Level3 흐름으로 확장)
public class KakaoApproveResDto {

    // TODO: 필드 선언
}
