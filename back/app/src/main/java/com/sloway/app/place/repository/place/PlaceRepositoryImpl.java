package com.sloway.app.place.repository.place;

import com.querydsl.core.Tuple;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.*;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.place.dto.request.place.PlaceUpdateReqDto;
import com.sloway.app.place.dto.response.place.*;
import com.sloway.app.place.entity.cashing.PlaceSummary;
import com.sloway.app.place.entity.hostPlace.QHostPlaceEntity;
import com.sloway.app.place.entity.place.PlaceStatus;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

import static com.sloway.app.place.entity.place.QPlaceEntity.placeEntity;
import static com.sloway.app.place.entity.hostPlace.QHostPlaceEntity.hostPlaceEntity;
import static com.sloway.app.host.entity.QHostEntity.hostEntity;
import static com.sloway.app.place.entity.workStay.QWorkStayEntity.workStayEntity;
import static com.sloway.app.place.entity.workStay.QImgWorkStayEntity.imgWorkStayEntity;
import static com.sloway.app.place.entity.office.QOfficeEntity.officeEntity;
import static com.sloway.app.place.entity.place.QImgPlaceEntity.imgPlaceEntity;
import static com.sloway.app.place.entity.office.QImgOfficeEntity.imgOfficeEntity;
import static com.sloway.app.place.entity.station.QImgStationEntity.imgStationEntity;
import static com.sloway.app.place.entity.station.QStationEntity.stationEntity;
import static com.sloway.app.reservation.rsvn.entity.QRsvnEntity.rsvnEntity;
import static com.sloway.app.review.review.entity.QReviewEntity.reviewEntity;
import static com.sloway.app.place.entity.office.QOfficePeriodEntity.officePeriodEntity;
import static com.sloway.app.place.entity.amenity.QAmenityEntity.amenityEntity;
import static com.sloway.app.place.entity.amenity.workStay.QWorkAmenityEntity.workAmenityEntity;
import static com.sloway.app.place.entity.cashing.QPlaceSummary.placeSummary;

@RequiredArgsConstructor
public class PlaceRepositoryImpl implements PlaceRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<PlaceDetailListRespDto> findPlaceDetailListByHostNo(Long placeNo, Long memberNo) {
        // 해당 placeNo의 가장 최신 HOST_PLACE ID를 가져오는 서브쿼리
        var latestHostPlaceIdSubQuery = JPAExpressions
                .select(hostPlaceEntity.no.max())
                .from(hostPlaceEntity)
                .where(hostPlaceEntity.placeEntity.no.eq(placeNo));

        // 1. 리뷰 평균값 계산 서브쿼리
        var subQueryReviewAvg = JPAExpressions
                .select(reviewEntity.scoreTotal.avg())
                .from(reviewEntity)
                .join(rsvnEntity).on(reviewEntity.rsvnNo.no.eq(rsvnEntity.no))
                .where(
                        rsvnEntity.workStayNo.no.eq(workStayEntity.no)
                                .or(rsvnEntity.officeNo.no.eq(officeEntity.no))
                                .or(rsvnEntity.stationNo.no.eq(stationEntity.no))
                );

        // 2. 유닛 상태값 조회 쿼리
        var subQueryStatus = JPAExpressions
                .select(hostPlaceEntity.status.stringValue())
                .from(hostPlaceEntity)
                .where(
                        // 타입별로 최신 ID를 찾기 위한 조건
                        hostPlaceEntity.no.eq(
                                JPAExpressions.select(hostPlaceEntity.no.max())
                                        .from(hostPlaceEntity)
                                        .where(
                                                new CaseBuilder()
                                                        .when(placeEntity.type.eq("WORK_STAY")).then(hostPlaceEntity.workStayEntity.no)
                                                        .when(placeEntity.type.eq("OFFICE")).then(hostPlaceEntity.officeEntity.no)
                                                        .when(placeEntity.type.eq("STATION")).then(hostPlaceEntity.stationEntity.no)
                                                        .otherwise((Long) null)
                                                        .eq(
                                                                new CaseBuilder()
                                                                        .when(placeEntity.type.eq("WORK_STAY")).then(workStayEntity.no)
                                                                        .when(placeEntity.type.eq("OFFICE")).then(officeEntity.no)
                                                                        .when(placeEntity.type.eq("STATION")).then(stationEntity.no)
                                                                        .otherwise((Long) null)
                                                        )
                                        )
                        )
                );

        return queryFactory
                .select(Projections.constructor(PlaceDetailListRespDto.class,
                        new CaseBuilder()
                                .when(placeEntity.type.eq("WORK_STAY")).then(workStayEntity.no)
                                .when(placeEntity.type.eq("OFFICE")).then(officeEntity.no)
                                .when(placeEntity.type.eq("STATION")).then(stationEntity.no)
                                .otherwise((Long) null),

                        placeEntity.type,

                        new CaseBuilder()
                                .when(placeEntity.type.eq("WORK_STAY")).then(imgWorkStayEntity.currentUrl)
                                .when(placeEntity.type.eq("OFFICE")).then(imgOfficeEntity.currentUrl)
                                .when(placeEntity.type.eq("STATION")).then(imgStationEntity.currentUrl)
                                .otherwise((String) null),

                        // [수정] 서브쿼리로 처리
                        subQueryStatus,

                        new CaseBuilder()
                                .when(placeEntity.type.eq("WORK_STAY")).then(workStayEntity.title)
                                .when(placeEntity.type.eq("OFFICE")).then(officeEntity.title)
                                .when(placeEntity.type.eq("STATION")).then(stationEntity.title)
                                .otherwise((String) null),

                        new CaseBuilder()
                                .when(placeEntity.type.eq("WORK_STAY")).then(workStayEntity.createdAt)
                                .when(placeEntity.type.eq("OFFICE")).then(officeEntity.createdAt)
                                .when(placeEntity.type.eq("STATION")).then(stationEntity.createdAt)
                                .otherwise((LocalDateTime) null).stringValue(),
                        Expressions.numberTemplate(Double.class, "COALESCE(ROUND({0}, 1), 0.0)", subQueryReviewAvg)
                ))
                .from(placeEntity)
                .join(hostPlaceEntity).on(
                        hostPlaceEntity.placeEntity.eq(placeEntity)
                                .and(hostPlaceEntity.no.in(latestHostPlaceIdSubQuery))
                )
                .join(hostPlaceEntity.hostEntity, hostEntity)

                // 불필요한 중복 조인 제거
                .leftJoin(workStayEntity).on(workStayEntity.placeEntity.eq(placeEntity))
                .leftJoin(officeEntity).on(officeEntity.placeEntity.eq(placeEntity))
                .leftJoin(stationEntity).on(stationEntity.placeEntity.eq(placeEntity))

                .leftJoin(imgWorkStayEntity).on(imgWorkStayEntity.workStayEntity.eq(workStayEntity).and(imgWorkStayEntity.sort.eq(1)))
                .leftJoin(imgOfficeEntity).on(imgOfficeEntity.officeEntity.eq(officeEntity).and(imgOfficeEntity.sort.eq(1)))
                .leftJoin(imgStationEntity).on(imgStationEntity.stationEntity.eq(stationEntity).and(imgStationEntity.sort.eq(1)))

                .where(
                        placeEntity.delYn.eq("N"),
                        memberNo != null ? hostEntity.memberNo.eq(memberNo) : null, // hostEntity 조인이 필요하면 추가
                        placeEntity.no.eq(placeNo)
                )
                .orderBy(new CaseBuilder()
                        .when(placeEntity.type.eq("WORK_STAY")).then(workStayEntity.createdAt)
                        .when(placeEntity.type.eq("OFFICE")).then(officeEntity.createdAt)
                        .when(placeEntity.type.eq("STATION")).then(stationEntity.createdAt)
                        .otherwise((LocalDateTime) null).stringValue()
                        .desc())
                .fetch();
    }

    @Override
    public List<PlaceListRespDto> findPlaceListByMemberNo(Long memberNo) {
        QHostPlaceEntity subHp = new QHostPlaceEntity("subHp");

        // 1. 최신 이력(status)을 구하기 위한 서브쿼리 정의
        JPQLQuery<Long> latestHostPlaceNo = JPAExpressions
                .select(subHp.no.max())
                .from(subHp)
                .where(subHp.placeEntity.eq(placeEntity));

        return queryFactory
                .select(Projections.constructor(PlaceListRespDto.class,
                        placeEntity.no,
                        placeEntity.type,
                        hostPlaceEntity.status.stringValue(),
                        placeEntity.title,
                        placeEntity.address,
                        placeSummary.avgScore.avg().coalesce(0.0),
                        placeSummary.rsvnCount.avg().intValue().coalesce(0),
                        placeSummary.rsvnCount.avg().intValue().coalesce(0),
                        getPriceExpression(), // 앞서 바꾼 numberTemplate 메서드
                        imgPlaceEntity.currentUrl.min()
                ))
                .from(placeEntity)
                // 2. 조인 구조 최적화
                .innerJoin(hostPlaceEntity).on(hostPlaceEntity.placeEntity.eq(placeEntity)
                        .and(hostPlaceEntity.no.eq(latestHostPlaceNo)))
                .innerJoin(hostEntity).on(hostPlaceEntity.hostEntity.eq(hostEntity))
                .leftJoin(placeSummary).on(placeSummary.placeNo.eq(placeEntity.no)
                        .and(placeSummary.type.eq(placeEntity.type)))
                .leftJoin(imgPlaceEntity).on(imgPlaceEntity.placeEntity.eq(placeEntity).and(imgPlaceEntity.sort.eq(1)))
                .where(
                        placeEntity.delYn.eq("N"),
                        hostEntity.memberNo.eq(memberNo)
                )
                // 3. GROUP BY 절에 hostPlaceEntity.no 추가
                .groupBy(
                        placeEntity.no,
                        placeEntity.type,
                        hostPlaceEntity.no,
                        hostPlaceEntity.status,
                        placeEntity.title,
                        placeEntity.address
                )
                .orderBy(hostPlaceEntity.no.desc())
                .fetch();
    }

    private NumberExpression<Integer> getPriceExpression() {
        return Expressions.numberTemplate(Integer.class,
                "CASE WHEN {0} = 'WORK_STAY' THEN ({1}) " +
                        "     WHEN {0} = 'STATION' THEN ({2}) " +
                        "     WHEN {0} = 'OFFICE' THEN ({3}) " +
                        "     ELSE 0 END",
                placeEntity.type, // {0}
                JPAExpressions.select(workStayEntity.monPrice.min()).from(workStayEntity).where(workStayEntity.placeEntity.eq(placeEntity)), // {1}
                JPAExpressions.select(stationEntity.monPrice.min()).from(stationEntity).where(stationEntity.placeEntity.eq(placeEntity)), // {2}
                JPAExpressions.select(officePeriodEntity.price.min()).from(officePeriodEntity).join(officePeriodEntity.officeEntity, officeEntity).where(officeEntity.placeEntity.eq(placeEntity)) // {3}
        );
    }

    @Override
    public List<MasterPlaceRespDto> findMasterPlaceListByTypeAndMemberNo(String type, Long memberNo) {
        var latestHostPlaceIds = JPAExpressions
                .select(hostPlaceEntity.no.max())
                .from(hostPlaceEntity)
                .where(hostPlaceEntity.hostEntity.memberNo.eq(memberNo))
                .groupBy(hostPlaceEntity.placeEntity.no);

        // 2. 메인 쿼리 실행
        return queryFactory
                .select(Projections.constructor(MasterPlaceRespDto.class,
                        placeEntity.no,
                        placeEntity.title,
                        placeEntity.type
                ))
                .from(placeEntity)
                .join(hostPlaceEntity).on(hostPlaceEntity.placeEntity.eq(placeEntity))
                .where(
                        placeEntity.delYn.eq("N"),
                        placeEntity.type.eq(type),
                        // 위에서 구한 최신 이력 ID 리스트에 포함된 경우만 조회
                        hostPlaceEntity.no.in(latestHostPlaceIds)
                )
                .fetch();
    }

    @Override
    public PlaceUpdateReqDto selectPlaceForUpdate(Long memberNo, Long no) {

        // 1. 해당 PLACE에 대한 가장 최신 HOST_PLACE ID 서브쿼리
        var latestHostPlaceIdSubQuery = JPAExpressions
                .select(hostPlaceEntity.no.max())
                .from(hostPlaceEntity)
                .where(hostPlaceEntity.placeEntity.no.eq(no));

        // 2. 쿼리 실행
        return queryFactory
                .select(Projections.constructor(PlaceUpdateReqDto.class,
                        placeEntity.no,
                        placeEntity.title,
                        placeEntity.content
                ))
                .from(placeEntity)
                .join(hostPlaceEntity).on(
                        hostPlaceEntity.placeEntity.eq(placeEntity)
                                .and(hostPlaceEntity.no.in(latestHostPlaceIdSubQuery))
                )
                .join(hostPlaceEntity.hostEntity, hostEntity)
                .where(
                        placeEntity.delYn.eq("N"),
                        placeEntity.no.eq(no),
                        hostEntity.memberNo.eq(memberNo)
                )
                .fetchOne();
    }

    @Override
    public PlaceImgListRespDto selectImageList(Long no, Long memberNo) {
        // 1. 해당 장소의 가장 최신 HOST_PLACE ID 서브쿼리
        var latestHostPlaceIdSubQuery = JPAExpressions
                .select(hostPlaceEntity.no.max())
                .from(hostPlaceEntity)
                .where(hostPlaceEntity.placeEntity.no.eq(no));

        // 2. 이미지 리스트 조회
        List<PlaceImgListRespDto.ImageInfo> placeList = queryFactory
                .select(Projections.constructor(PlaceImgListRespDto.ImageInfo.class,
                        imgPlaceEntity.no,
                        imgPlaceEntity.currentUrl,
                        imgPlaceEntity.sort
                ))
                .from(imgPlaceEntity)
                // [핵심] 최신 HOST_PLACE와 조인하여 권한 검증 및 중복 방지
                .join(hostPlaceEntity).on(
                        imgPlaceEntity.placeEntity.eq(hostPlaceEntity.placeEntity)
                                .and(hostPlaceEntity.no.in(latestHostPlaceIdSubQuery))
                )
                .join(hostPlaceEntity.hostEntity, hostEntity)
                .where(
                        imgPlaceEntity.placeEntity.no.eq(no),
                        hostEntity.memberNo.eq(memberNo)
                )
                .orderBy(imgPlaceEntity.sort.asc())
                .fetch();

        return PlaceImgListRespDto.builder()
                .placeImages(placeList != null ? placeList : List.of())
                .build();
    }

    @Override
    public List<PlaceCardDto> getTop4PlacesByType() {
        return queryFactory
                .select(Projections.fields(PlaceCardDto.class,
                        placeSummary.placeNo.as("masterNo"),
                        placeSummary.targetNo.min().as("placeNo"),
                        placeEntity.title,
                        placeSummary.type,
                        placeSummary.currentUrl.as("mainImageUrl"),
                        placeSummary.address,
                        placeSummary.price.min().as("price"),
                        placeSummary.finalScore.avg().castToNum(Integer.class).as("finalScore"),
                        placeSummary.rsvnCount.sum().as("totalReservations"),
                        placeSummary.avgScore.avg().as("avgReviewScore"),
                        placeSummary.status
                ))
                .from(placeSummary)
                .leftJoin(placeEntity).on(placeSummary.placeNo.eq(placeEntity.no))
                .where(placeSummary.status.eq("I"))
                .groupBy(
                        placeSummary.placeNo,
                        placeEntity.title,
                        placeSummary.type,
                        placeSummary.currentUrl,
                        placeSummary.address,
                        placeSummary.status
                )
                .orderBy(placeSummary.finalScore.avg().desc())
                .limit(4)
                .fetch();
    }

    @Override
    public List<PlaceCardDto> getRecommendPlace() {
        return queryFactory
                .select(Projections.fields(PlaceCardDto.class,
                        placeSummary.placeNo.as("masterNo"),
                        placeSummary.targetNo.as("placeNo"),
                        placeSummary.title,
                        placeSummary.type,
                        placeSummary.currentUrl.as("mainImageUrl"),
                        placeSummary.address,
                        placeSummary.price,
                        placeSummary.finalScore,
                        placeSummary.rsvnCount.as("totalReservations"),
                        placeSummary.avgScore.as("avgReviewScore"),
                        placeSummary.status
                ))
                .from(placeSummary)
                .where(placeSummary.status.eq("I"))
                .orderBy(placeSummary.finalScore.desc())
                .limit(3)
                .fetch();
    }

    @Override
    public WorkStayCardDto getRandomWorkStay() {
        List<PlaceSummary> list = queryFactory
                .selectFrom(placeSummary)
                .where(placeSummary.type.eq("WORK_STAY").and(placeSummary.status.eq("I")))
                .orderBy(placeSummary.finalScore.desc())
                .limit(5)
                .fetch();

        if (list.isEmpty()) return null;

        PlaceSummary s = list.get(new Random().nextInt(list.size()));

        // 데이터 변환 후 리턴
        return WorkStayCardDto.builder()
                .masterNo(s.getPlaceNo())
                .workStayNo(s.getTargetNo())
                .title(s.getTitle())
                .address(s.getAddress())
                .mainImageUrl(s.getCurrentUrl())
                .price(s.getPrice())
                .amenities(s.getAmenities() != null ? Arrays.asList(s.getAmenities().split(",")) : null)
                .build();
    }

}