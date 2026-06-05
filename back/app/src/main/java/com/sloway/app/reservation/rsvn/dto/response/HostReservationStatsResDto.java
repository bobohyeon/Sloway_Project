package com.sloway.app.reservation.rsvn.dto.response;

import lombok.Builder;
import lombok.Getter;

/**
 * 어드민 호스트 상세 — 예약 건수 통계.
 * 진행중(대기 P + 확정 S) / 완료(이용완료 E). 취소(C)·거절(R)은 제외.
 */
@Getter
@Builder
public class HostReservationStatsResDto {

    private long ongoingReservationCount;   // 진행중 = P + S
    private long completedReservationCount; // 완료 = E

    public static HostReservationStatsResDto of(long ongoing, long completed) {
        return HostReservationStatsResDto.builder()
                .ongoingReservationCount(ongoing)
                .completedReservationCount(completed)
                .build();
    }
}
