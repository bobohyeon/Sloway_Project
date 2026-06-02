package com.sloway.app.payment.stats.dto.response;

import java.util.List;

// ── ⑩-1 MemberStats 응답 DTO ─────────────────────────────
// TODO: 프론트 MemberStats 계약에 맞춘 회원 통계 DTO
//  - 어노테이션: @Getter + @Builder
//  - 필드: total / newSignup / active / withdrawn  (프론트가 읽는 키 그대로)
//    + trend → List<MonthlyTrendResDto> 재활용 (그 달 가입 건수가 totalAmt 자리에 들어감)
//  - 정적 팩토리 of(...) 로 조립
public class MemberStatsResDto {

}
