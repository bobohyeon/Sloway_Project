package com.sloway.app.payment.stats.repository;

import com.sloway.app.member.common.MemberStatus;
import com.sloway.app.place.entity.hostPlace.ApprovalStatus;
import com.sloway.app.reservation.rsvn.entity.RsvnStatus;

import java.time.LocalDateTime;
import java.util.Map;

public interface StatsRepositoryCustom {

    Long countHostPlace();

    Long countHostPlaceByOffice();

    Long countHostPlaceByStation();

    Long countHostPlaceByWorkStay();

    Long countHostPlaceByStatus(ApprovalStatus status);

    Long countHostPlaceByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    Long countRsvnByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    // 기간 내 예약을 상태별로 한 번에 집계 (status별 count 4번 → group by 1번)
    Map<RsvnStatus, Long> countRsvnGroupByStatus(LocalDateTime start, LocalDateTime end);

    Long countMember();

    Long countMemberByStatus(MemberStatus status);

    Long countMemberByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}
