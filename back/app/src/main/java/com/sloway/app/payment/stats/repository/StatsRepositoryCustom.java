package com.sloway.app.payment.stats.repository;

import com.sloway.app.member.common.MemberStatus;
import com.sloway.app.place.entity.hostPlace.ApprovalStatus;
import com.sloway.app.reservation.rsvn.entity.RsvnStatus;

import java.time.LocalDateTime;

public interface StatsRepositoryCustom {

    Long countHostPlace();

    Long countHostPlaceByOffice();

    Long countHostPlaceByStation();

    Long countHostPlaceByWorkStay();

    Long countHostPlaceByStatus(ApprovalStatus status);

    Long countHostPlaceByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    Long countRsvnByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    Long countRsvnByStatusAndCreatedAtBetween(RsvnStatus status, LocalDateTime start, LocalDateTime end);

    Long countMember();

    Long countMemberByStatus(MemberStatus status);

    Long countMemberByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}
