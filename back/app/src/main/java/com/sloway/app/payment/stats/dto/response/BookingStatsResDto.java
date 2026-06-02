package com.sloway.app.payment.stats.dto.response;

import java.util.List;

// ── ⑨-1 BookingStats 응답 DTO ─────────────────────────────
// TODO: 프론트 BookingStats 계약에 맞춘 예약 통계 DTO
//  - 어노테이션: @Getter + @Builder
//  - 필드: total / confirmed / canceled / completed  (프론트가 읽는 키 그대로)
//    + trend → List<MonthlyTrendResDto> 재활용 (구조 동일, 새로 안 만듦)
//      · trend 한 칸의 totalAmt 자리에 '그 달 예약 건수'가 들어감 — 프론트는 value 로만 읽어 OK
//  - 정적 팩토리 of(...) 로 조립
public class BookingStatsResDto {

}
