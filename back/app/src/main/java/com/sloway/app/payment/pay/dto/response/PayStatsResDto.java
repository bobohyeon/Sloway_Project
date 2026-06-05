package com.sloway.app.payment.pay.dto.response;

import lombok.Builder;
import lombok.Getter;

// 관리자 결제 목록 상단 통계 카드용 응답 DTO
// 목록(페이징)과 별개로, 기간 내 "전체" 결제를 상태별로 집계한 값을 담는다.
// (서버 페이지네이션이라 현재 페이지 10건만으로는 전체 통계를 낼 수 없어 별도 집계)
@Getter
@Builder
public class PayStatsResDto {
    private long total;         // 전체 건수
    private long completed;     // 결제 완료(COMPLETED) 건수
    private long completedAmt;  // 결제 완료 금액 합계
    private long refunded;      // 환불(CANCELED) 건수
    private long failed;        // 결제 실패(FAILED) 건수
}
