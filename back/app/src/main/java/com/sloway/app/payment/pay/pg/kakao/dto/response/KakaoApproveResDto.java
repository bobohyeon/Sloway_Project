package com.sloway.app.payment.pay.pg.kakao.dto.response;

// 카카오페이 결제 승인(approve) 응답 DTO — 결제 최종 결과
//
// TODO: 클래스 어노테이션 — @Getter + @NoArgsConstructor (Jackson 역직렬화용)
//
// TODO: 필드 — approve 응답 중 우리가 쓸 것
//   aid, tid, cid, partnerOrderId, paymentMethodType,
//   amount(중첩: total 등), itemName, approvedAt
//
//   ※ 강사 코드는 sb 문자열만 출력했지만("필요한 데이터 꺼내서 DB 저장"),
//      본인은 이 응답을 DTO 로 받아 PayEntity 를 COMPLETED 로 전이시킨다.
//      (기존 completeAsLevel1 → 실 PG 승인 흐름으로 확장)
//   ※ amount 는 중첩 JSON({"total":..}). 중첩 DTO 로 받거나 total 만 평탄화할지 결정.
//   ※ tid 는 환불(취소) 때도 필요 — PayEntity.tid 에 보관해 두는 게 좋음
public class KakaoApproveResDto {

    // TODO: 필드 선언
}
