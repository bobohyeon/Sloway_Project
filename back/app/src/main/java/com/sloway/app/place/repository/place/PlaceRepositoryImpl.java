package com.sloway.app.place.repository.place;

import com.querydsl.core.Tuple;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.*;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.place.dto.request.place.PlaceUpdateReqDto;
import com.sloway.app.place.dto.response.place.*;
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
    public List<PlaceListRespDto> findPlaceListByHostNo(Long memberNo) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth = now.with(TemporalAdjusters.firstDayOfMonth()).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime endOfMonth = now.with(TemporalAdjusters.lastDayOfMonth()).withHour(23).withMinute(59).withSecond(59).withNano(999999999);

        // 1. PLACE별 가장 최신 HOST_PLACE ID를 구하는 서브쿼리 (PK인 no 사용)
        var latestHostPlaceIdSubQuery = JPAExpressions
                .select(hostPlaceEntity.no.max())
                .from(hostPlaceEntity)
                .groupBy(hostPlaceEntity.placeEntity.no);

        // 2. 리뷰 평점 서브쿼리
        var subQueryReviewAvg = JPAExpressions
                .select(reviewEntity.scoreTotal.avg())
                .from(reviewEntity)
                .join(rsvnEntity).on(reviewEntity.rsvnNo.no.eq(rsvnEntity.no))
                .where(
                        rsvnEntity.workStayNo.placeEntity.no.eq(placeEntity.no)
                                .or(rsvnEntity.officeNo.placeEntity.no.eq(placeEntity.no))
                                .or(rsvnEntity.stationNo.placeEntity.no.eq(placeEntity.no))
                );

        // 공간별 누적 리뷰 개수
        var subQueryReviewCount = JPAExpressions
                .select(reviewEntity.count().intValue())
                .from(reviewEntity)
                .join(rsvnEntity).on(reviewEntity.rsvnNo.no.eq(rsvnEntity.no))
                .where(
                        rsvnEntity.workStayNo.placeEntity.no.eq(placeEntity.no)
                                .or(rsvnEntity.officeNo.placeEntity.no.eq(placeEntity.no))
                                .or(rsvnEntity.stationNo.placeEntity.no.eq(placeEntity.no))
                );

        // 공간별 당월 예약 건수
        var subQueryMonthlyBookings = JPAExpressions
                .select(rsvnEntity.count().intValue())
                .from(rsvnEntity)
                .where(
                        rsvnEntity.workStayNo.placeEntity.no.eq(placeEntity.no)
                                .or(rsvnEntity.officeNo.placeEntity.no.eq(placeEntity.no))
                                .or(rsvnEntity.stationNo.placeEntity.no.eq(placeEntity.no)),
                        rsvnEntity.createdAt.between(startOfMonth, endOfMonth)
                );

        // 메인 쿼리
        return queryFactory
                .select(Projections.constructor(PlaceListRespDto.class,
                        placeEntity.no.as("id"),
                        placeEntity.type,
                        hostPlaceEntity.status.stringValue(),
                        placeEntity.title,
                        placeEntity.address,
                        Expressions.numberTemplate(Double.class, "COALESCE(ROUND({0}, 1), 0.0)", subQueryReviewAvg),
                        Expressions.numberTemplate(Integer.class, "COALESCE({0}, 0)", subQueryReviewCount),
                        Expressions.numberTemplate(Integer.class, "COALESCE({0}, 0)", subQueryMonthlyBookings),
                        new CaseBuilder()
                                .when(placeEntity.type.eq("WORK_STAY")).then(workStayEntity.monPrice.min())
                                .when(placeEntity.type.eq("OFFICE")).then(officePeriodEntity.price.min())
                                .when(placeEntity.type.eq("STATION")).then(stationEntity.monPrice.min())
                                .otherwise(0).intValue(),
                        imgPlaceEntity.currentUrl
                ))
                .from(placeEntity)
                // 최신 상태값(hostPlaceEntity) 조인
                .join(hostPlaceEntity).on(
                        hostPlaceEntity.placeEntity.eq(placeEntity)
                                .and(hostPlaceEntity.no.in(latestHostPlaceIdSubQuery))
                )
                .join(hostEntity).on(hostPlaceEntity.hostEntity.eq(hostEntity))
                .leftJoin(workStayEntity).on(workStayEntity.placeEntity.eq(placeEntity))
                .leftJoin(officeEntity).on(officeEntity.placeEntity.eq(placeEntity))
                .leftJoin(officePeriodEntity).on(officePeriodEntity.officeEntity.eq(officeEntity))
                .leftJoin(stationEntity).on(stationEntity.placeEntity.eq(placeEntity))
                .leftJoin(imgPlaceEntity).on(imgPlaceEntity.placeEntity.eq(placeEntity).and(imgPlaceEntity.sort.eq(1)))
                .where(
                        placeEntity.delYn.eq("N"),
                        memberNo != null ? hostEntity.memberNo.eq(memberNo) : null
                )
                .groupBy(
                        placeEntity.no,
                        placeEntity.type,
                        hostPlaceEntity.status,
                        placeEntity.title,
                        placeEntity.address,
                        imgPlaceEntity.currentUrl
                )
                .orderBy(hostPlaceEntity.no.max().desc())
                .fetch();
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
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusDays(7);

        // 1. 점수 로직 정의
        NumberExpression<Integer> finalScore = new CaseBuilder()
                .when(rsvnEntity.no.countDistinct().eq(0L))
                .then(new CaseBuilder().when(placeEntity.createdAt.goe(oneWeekAgo)).then(0.5).otherwise(0.0))
                .otherwise(
                        (rsvnEntity.no.countDistinct().doubleValue().multiply(0.7)
                                .add(reviewEntity.scoreTotal.avg().coalesce(0.0).multiply(0.3)))
                                .multiply(new CaseBuilder().when(placeEntity.createdAt.goe(oneWeekAgo)).then(0.5).otherwise(1.0))
                )
                .multiply(100)
                .round()
                .intValue();

        // 2. 재사용 가능한 식 정의 (SELECT와 GROUP BY에서 동일하게 사용)
        NumberExpression<Long> targetNo = stationEntity.no.coalesce(officeEntity.no).coalesce(workStayEntity.no);
        StringExpression combinedTitle = placeEntity.title.concat(" ").concat(
                stationEntity.title.coalesce(officeEntity.title).coalesce(workStayEntity.title)
        );

        return queryFactory
                .select(Projections.constructor(PlaceCardDto.class,
                        placeEntity.no,
                        targetNo,
                        combinedTitle,
                        placeEntity.type,
                        imgPlaceEntity.currentUrl,
                        placeEntity.address,
                        Expressions.asNumber(0),
                        finalScore,
                        rsvnEntity.no.countDistinct().intValue(),
                        reviewEntity.scoreTotal.avg().coalesce(0.0),
                        placeEntity.createdAt.goe(oneWeekAgo),
                        placeEntity.status.stringValue()
                ))
                .from(placeEntity)
                .leftJoin(stationEntity).on(stationEntity.placeEntity.no.eq(placeEntity.no))
                .leftJoin(officeEntity).on(officeEntity.placeEntity.no.eq(placeEntity.no))
                .leftJoin(workStayEntity).on(workStayEntity.placeEntity.no.eq(placeEntity.no))
                .leftJoin(rsvnEntity).on(rsvnEntity.stationNo.eq(stationEntity)
                        .or(rsvnEntity.officeNo.eq(officeEntity))
                        .or(rsvnEntity.workStayNo.eq(workStayEntity)))
                .leftJoin(reviewEntity).on(reviewEntity.rsvnNo.eq(rsvnEntity))
                .leftJoin(imgPlaceEntity).on(imgPlaceEntity.placeEntity.no.eq(placeEntity.no).and(imgPlaceEntity.sort.eq(1)))
                .where(placeEntity.status.eq(PlaceStatus.I))
                // 핵심: SELECT 절에 사용된 연산식을 그대로 GROUP BY에 삽입
                .groupBy(
                        stationEntity.no, officeEntity.no, workStayEntity.no,
                        placeEntity.title, stationEntity.title, officeEntity.title, workStayEntity.title,
                        placeEntity.type,
                        placeEntity.address,
                        placeEntity.status,
                        imgPlaceEntity.currentUrl,
                        placeEntity.no,
                        placeEntity.createdAt
                )
                .orderBy(finalScore.desc())
                .limit(4)
                .fetch();
    }

    @Override
    public List<PlaceCardDto> getRecommendPlace() {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusDays(7);

        // 1. Office 최소 가격 서브쿼리
        JPQLQuery<Integer> subQuery = JPAExpressions
                .select(officePeriodEntity.price.min())
                .from(officePeriodEntity)
                .where(officePeriodEntity.officeEntity.eq(officeEntity)
                        .and(officePeriodEntity.exceptionStartDate.isNull()));
        NumberExpression<Integer> minOfficePrice = Expressions.asNumber(subQuery);

        // 2. 가격 병합 로직 복구
        NumberExpression<Integer> combinedPrice = stationEntity.monPrice
                .coalesce(minOfficePrice)
                .coalesce(workStayEntity.monPrice)
                .coalesce(0);

        // 3. 점수 로직
        String scoreLogic = "ROUND((CASE WHEN COUNT(DISTINCT {1}) = 0 " +
                "THEN (CASE WHEN {2} >= {0} THEN 0.5 ELSE 0.0 END) " +
                "ELSE ((COUNT(DISTINCT {1}) * 0.7) + (COALESCE(AVG({3}), 0) * 0.3)) * (CASE WHEN {2} >= {0} THEN 0.5 ELSE 1.0 END) " +
                "END) * 100, 0)";
        NumberExpression<Double> scoreDouble = Expressions.numberTemplate(Double.class, scoreLogic,
                oneWeekAgo, rsvnEntity.no, placeEntity.createdAt, reviewEntity.scoreTotal);

        return queryFactory
                .select(Projections.constructor(PlaceCardDto.class,
                        placeEntity.no,
                        stationEntity.no.coalesce(officeEntity.no).coalesce(workStayEntity.no), // targetNo
                        placeEntity.title.concat(" - ").concat(stationEntity.title.coalesce(officeEntity.title).coalesce(workStayEntity.title)), // combinedTitle
                        placeEntity.type,
                        imgPlaceEntity.currentUrl,
                        placeEntity.address,
                        combinedPrice, // 가격 정보 복구 완료
                        scoreDouble.intValue(),
                        rsvnEntity.no.countDistinct().intValue(),
                        reviewEntity.scoreTotal.avg().coalesce(0.0),
                        placeEntity.createdAt.goe(oneWeekAgo),
                        placeEntity.status.stringValue()
                ))
                .from(placeEntity)
                .leftJoin(stationEntity).on(stationEntity.placeEntity.no.eq(placeEntity.no))
                .leftJoin(officeEntity).on(officeEntity.placeEntity.no.eq(placeEntity.no))
                .leftJoin(workStayEntity).on(workStayEntity.placeEntity.no.eq(placeEntity.no))
                .leftJoin(rsvnEntity).on(rsvnEntity.stationNo.eq(stationEntity)
                        .or(rsvnEntity.officeNo.eq(officeEntity))
                        .or(rsvnEntity.workStayNo.eq(workStayEntity)))
                .leftJoin(reviewEntity).on(reviewEntity.rsvnNo.eq(rsvnEntity))
                .leftJoin(imgPlaceEntity).on(imgPlaceEntity.placeEntity.no.eq(placeEntity.no).and(imgPlaceEntity.sort.eq(1)))
                .where(placeEntity.status.eq(PlaceStatus.I))
                // 에러 방지: SELECT 절의 모든 원본 컬럼과 가격 로직 포함
                .groupBy(
                        placeEntity.no,
                        stationEntity.no, officeEntity.no, workStayEntity.no,
                        placeEntity.title, stationEntity.title, officeEntity.title, workStayEntity.title,
                        placeEntity.type,
                        imgPlaceEntity.currentUrl,
                        placeEntity.address,
                        placeEntity.createdAt,
                        placeEntity.status,
                        stationEntity.monPrice,
                        workStayEntity.monPrice // 그룹핑에 가격 관련 원본 컬럼 추가
                )
                .orderBy(scoreDouble.desc())
                .limit(3)
                .fetch();
    }

    @Override
    public WorkStayCardDto getRandomWorkStay() {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusDays(7);

        // 1. 점수 로직 (WorkStay 기준 예약/리뷰)
        String scoreLogic = "ROUND((CASE WHEN COUNT(DISTINCT {1}) = 0 " +
                "THEN (CASE WHEN {2} >= {0} THEN 0.5 ELSE 0.0 END) " +
                "ELSE ((COUNT(DISTINCT {1}) * 0.7) + (COALESCE(AVG({3}), 0) * 0.3)) * (CASE WHEN {2} >= {0} THEN 0.5 ELSE 1.0 END) " +
                "END) * 100, 0)";

        NumberExpression<Double> scoreDouble = Expressions.numberTemplate(Double.class, scoreLogic,
                oneWeekAgo, rsvnEntity.no, placeEntity.createdAt, reviewEntity.scoreTotal);

        // 2. 쿼리 구성 (WorkStay 중심)
        List<Tuple> results = queryFactory
                .select(
                        workStayEntity.placeEntity.no,
                        workStayEntity.no,
                        placeEntity.title.concat(" ").concat(workStayEntity.title),
                        placeEntity.address,
                        imgPlaceEntity.currentUrl,
                        workStayEntity.monPrice.coalesce(0),
                        Expressions.stringTemplate("string_agg({0}, ',')", amenityEntity.name),
                        placeEntity.no //추가(보현)
                )
                .from(workStayEntity)
                .join(placeEntity).on(workStayEntity.placeEntity.no.eq(placeEntity.no))
                .leftJoin(imgPlaceEntity).on(imgPlaceEntity.placeEntity.no.eq(placeEntity.no).and(imgPlaceEntity.sort.eq(1)))
                .leftJoin(rsvnEntity).on(rsvnEntity.workStayNo.eq(workStayEntity)) // station/office 관련 조인 제거
                .leftJoin(reviewEntity).on(reviewEntity.rsvnNo.eq(rsvnEntity))
                .leftJoin(workAmenityEntity).on(workAmenityEntity.workStayEntity.no.eq(workStayEntity.no))
                .leftJoin(amenityEntity).on(amenityEntity.no.eq(workAmenityEntity.amenityEntity.no))
                .where(placeEntity.status.eq(PlaceStatus.I))
                .groupBy(
                        workStayEntity.no,
                        placeEntity.title,
                        workStayEntity.title,
                        placeEntity.address,
                        placeEntity.createdAt,
                        imgPlaceEntity.currentUrl,
                        workStayEntity.monPrice,
                        placeEntity.no // 추가(보현)
                )
                .orderBy(scoreDouble.desc())
                .limit(5)
                .fetch();

        // 3. 변환 (DTO 매핑 및 랜덤 선택)
        List<WorkStayCardDto> candidates = results.stream().map(tuple -> WorkStayCardDto.builder()
                .masterNo(tuple.get(0, Long.class))
                .workStayNo(tuple.get(1, Long.class))
                .title(tuple.get(2, String.class))
                .address(tuple.get(3, String.class))
                .mainImageUrl(tuple.get(4, String.class))
                .price(tuple.get(5, Integer.class))
                .amenities(tuple.get(6, String.class) != null ? Arrays.asList(tuple.get(5, String.class).split(",")) : null)
                .placeNo(tuple.get(7, Long.class)) // 추가(보현)
                .build()).toList();

        return candidates.isEmpty() ? null : candidates.get(new Random().nextInt(candidates.size()));
    }

}