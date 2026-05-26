package com.sloway.app.payment.stats.dto.response;

import lombok.Builder;
import lombok.Getter;

// TODO: 결제수단별 분포 — "한 행" DTO (Service가 List로 반환, 결제수단마다 한 행)
//
// 필드 후보:
//   · method — PayMethod (KAKAOPAY / TOSSPAY / NAVERPAY)
//   · count  — 그 수단 결제 건수
//   · amt    — 그 수단 결제액 합
//
// 이 DTO는 QueryDSL groupBy(method) 집계 결과의 한 행을 매핑하는 용도.
//   groupBy + 여러 컬럼 select 는 Tuple 또는 Projections 로 받게 됨 → 그 한 행을 of(...) 로 변환.
@Getter
@Builder
public class PayMethodStatResDto {

    // TODO: 필드 선언

    // TODO: of(...) 정적 팩토리
}
