package com.sloway.app.payment.stats.dto.response;

import lombok.Builder;
import lombok.Getter;

// TODO: 환불 통계 응답 DTO (한 달치 스칼라)
//
// 필드 후보 (타입 직접 정할 것):
//   · refundCount  — 환불 건수
//   · refundAmtSum — 환불액 합 (RefundEntity.refundAmt 가 BigDecimal)
//   · refundRate   — 환불율 (환불액 ÷ 결제액). 결제액 0일 때 방어 필요.
//                    비율을 어떤 타입으로 노출할지 고민 — double? BigDecimal? 정수 퍼센트?
//
// 결제액 합은 MonthlySales 쪽 집계 쿼리를 재활용할 수 있음 (같은 월 totalAmt).
@Getter
@Builder
public class RefundStatResDto {

    // TODO: 필드 선언

    // TODO: of(...) 정적 팩토리
}
