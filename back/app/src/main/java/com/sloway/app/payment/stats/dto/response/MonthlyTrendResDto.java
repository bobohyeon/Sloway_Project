package com.sloway.app.payment.stats.dto.response;

import lombok.Builder;
import lombok.Getter;

// TODO: 월별 시계열 추이 — "한 행" DTO (Service가 List로 반환, 달마다 한 행)
//
// 필드 후보:
//   · yearMonth — 어느 달인지 ("2026-05" 문자열 또는 연/월)
//   · totalAmt  — 그 달 매출 합
//
// 만드는 방식 두 갈래 (Service에서 판단):
//   · 월마다 반복 조회해서 행을 모으기 (단순, 쿼리 N번)
//   · groupBy(연-월) 한 방에 모으기 (효율적, 날짜 함수 처리 필요)
@Getter
@Builder
public class MonthlyTrendResDto {

    // TODO: 필드 선언

    // TODO: of(...) 정적 팩토리
}
