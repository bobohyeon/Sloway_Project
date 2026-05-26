package com.sloway.app.place.repository.place;

import com.querydsl.core.types.ExpressionUtils;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.CaseBuilder; // CaseBuilder 임포트
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.place.dto.request.place.PlaceUpdateReqDto;
import com.sloway.app.place.dto.response.place.MasterPlaceRespDto;
import com.sloway.app.place.dto.response.place.PlaceDetailListRespDto;
import com.sloway.app.place.dto.response.place.PlaceImgListRespDto;
import com.sloway.app.place.dto.response.place.PlaceListRespDto;
import com.sloway.app.place.dto.response.workStay.WorkStayImageListRespDto;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

import static com.sloway.app.place.entity.place.QPlaceEntity.placeEntity;
import static com.sloway.app.place.entity.hostPlace.QHostPlaceEntity.hostPlaceEntity;
import static com.sloway.app.host.entity.QHostEntity.hostEntity;
import static com.sloway.app.member.entity.QMemberEntity.memberEntity;
import static com.sloway.app.place.entity.workStay.QWorkStayEntity.workStayEntity;
import static com.sloway.app.place.entity.workStay.QImgWorkStayEntity.imgWorkStayEntity;
import static com.sloway.app.place.entity.office.QOfficeEntity.officeEntity;
import static com.sloway.app.place.entity.place.QImgPlaceEntity.imgPlaceEntity;
import static com.sloway.app.place.entity.office.QImgOfficeEntity.imgOfficeEntity;
import static com.sloway.app.place.entity.station.QImgStationEntity.imgStationEntity;
import static com.sloway.app.place.entity.station.QStationEntity.stationEntity;
import static com.sloway.app.place.entity.workStay.workOffice.QImgWorkStayOfficeEntity.imgWorkStayOfficeEntity;
import static com.sloway.app.place.entity.workStay.workOffice.QWorkOfficeEntity.workOfficeEntity;
import static com.sloway.app.reservation.rsvn.entity.QRsvnEntity.rsvnEntity;
import static com.sloway.app.review.review.entity.QReviewEntity.reviewEntity;
import static com.sloway.app.place.entity.office.QOfficePeriodEntity.officePeriodEntity;

@RequiredArgsConstructor
public class PlaceRepositoryImpl implements PlaceRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<PlaceDetailListRespDto> findPlaceDetailListByHostNo(Long placeNo, Long memberNo) {

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

        // 2. 메인 유닛 리스트 조회 쿼리
        return queryFactory
                .select(Projections.constructor(PlaceDetailListRespDto.class,
                        // NO동적 선택
                        new CaseBuilder()
                                .when(placeEntity.type.eq("WORK_STAY")).then(workStayEntity.no)
                                .when(placeEntity.type.eq("OFFICE")).then(officeEntity.no)
                                .when(placeEntity.type.eq("STATION")).then(stationEntity.no)
                                .otherwise((Long) null),

                        placeEntity.type,

                        // S3 URL을 동적선택
                        new CaseBuilder()
                                .when(placeEntity.type.eq("WORK_STAY")).then(imgWorkStayEntity.currentUrl)
                                .when(placeEntity.type.eq("OFFICE")).then(imgOfficeEntity.currentUrl)
                                .when(placeEntity.type.eq("STATION")).then(imgStationEntity.currentUrl)
                                .otherwise((String) null),                              // thumbnail (AWS S3 경로)

                        new CaseBuilder()
                                .when(placeEntity.type.eq("WORK_STAY")).then(workStayEntity.title)
                                .when(placeEntity.type.eq("OFFICE")).then(officeEntity.title)
                                .when(placeEntity.type.eq("STATION")).then(stationEntity.title)
                                .otherwise((String) null),

                        placeEntity.createdAt.stringValue(),                    // createdAt
                        Expressions.numberTemplate(Double.class, "COALESCE(ROUND({0}, 1), 0.0)", subQueryReviewAvg) // rating
                ))
                .from(placeEntity)
                .join(hostPlaceEntity).on(hostPlaceEntity.placeEntity.eq(placeEntity))
                .join(hostEntity).on(hostPlaceEntity.hostEntity.eq(hostEntity))

                // 각 메인 서브 개념 공간 조인
                .leftJoin(workStayEntity).on(workStayEntity.placeEntity.eq(placeEntity))
                .leftJoin(officeEntity).on(officeEntity.placeEntity.eq(placeEntity))
                .leftJoin(stationEntity).on(stationEntity.placeEntity.eq(placeEntity))

                .leftJoin(imgWorkStayEntity).on(
                        imgWorkStayEntity.workStayEntity.eq(workStayEntity).and(imgWorkStayEntity.sort.eq(1))
                )
                .leftJoin(imgOfficeEntity).on(
                        imgOfficeEntity.officeEntity.eq(officeEntity).and(imgOfficeEntity.sort.eq(1))
                )
                .leftJoin(imgStationEntity).on(
                        imgStationEntity.stationEntity.eq(stationEntity).and(imgStationEntity.sort.eq(1))
                )

                .where(
                        placeEntity.delYn.eq("N"),
                        memberNo != null ? hostEntity.memberNo.eq(memberNo) : null,
                        placeEntity.no.eq(placeNo),
                        ExpressionUtils.anyOf(
                                placeEntity.type.eq("WORK_STAY").and(workStayEntity.no.isNotNull()),
                                placeEntity.type.eq("OFFICE").and(officeEntity.no.isNotNull()),
                                placeEntity.type.eq("STATION").and(stationEntity.no.isNotNull())
                        ))
                .fetch();
    }

    @Override
    public List<PlaceListRespDto> findPlaceListByHostNo(Long memberNo) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth = now.with(TemporalAdjusters.firstDayOfMonth()).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime endOfMonth = now.with(TemporalAdjusters.lastDayOfMonth()).withHour(23).withMinute(59).withSecond(59).withNano(999999999);

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

        // [메인 쿼리]
        return queryFactory
                .select(Projections.constructor(PlaceListRespDto.class,
                        placeEntity.no,
                        placeEntity.type,
                        hostPlaceEntity.status.stringValue(),
                        placeEntity.title,
                        placeEntity.address,

                        // 집계 연산 데이터 매핑
                        Expressions.numberTemplate(Double.class, "COALESCE(ROUND({0}, 1), 0.0)", subQueryReviewAvg),
                        Expressions.numberTemplate(Integer.class, "COALESCE({0}, 0)", subQueryReviewCount),
                        Expressions.numberTemplate(Integer.class, "COALESCE({0}, 0)", subQueryMonthlyBookings),

                        // 가격정보
                        new CaseBuilder()
                                .when(placeEntity.type.eq("WORK_STAY")).then(workStayEntity.monPrice.min())
                                .when(placeEntity.type.eq("OFFICE")).then(officePeriodEntity.price.min())
                                .when(placeEntity.type.eq("STATION")).then(stationEntity.monPrice.min())
                                .otherwise(0)
                                .coalesce(0).as("price"),

                        imgPlaceEntity.currentUrl
                ))
                .from(placeEntity)
                .join(hostPlaceEntity).on(hostPlaceEntity.placeEntity.eq(placeEntity))
                .join(hostEntity).on(hostPlaceEntity.hostEntity.eq(hostEntity))

                .leftJoin(workStayEntity).on(workStayEntity.placeEntity.eq(placeEntity))
                .leftJoin(officeEntity).on(officeEntity.placeEntity.eq(placeEntity))
                .leftJoin(officePeriodEntity).on(officePeriodEntity.officeEntity.eq(officeEntity)) // ★ 오피스 가격 연동을 위한 조인 추가
                .leftJoin(stationEntity).on(stationEntity.placeEntity.eq(placeEntity))

                // 대표 썸네일 이미지 조인
                .leftJoin(imgPlaceEntity).on(
                        imgPlaceEntity.placeEntity.eq(placeEntity)
                                .and(imgPlaceEntity.sort.eq(1))
                )
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
                .fetch();
    }

    @Override
    public List<MasterPlaceRespDto> findMasterPlaceListByTypeAndMemberNo(String type, Long memberNo) {
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
                        hostPlaceEntity.hostEntity.memberNo.eq(memberNo) // 본인 소유의 마스터 공간만 조회
                )
                .fetch();
    }

    @Override
    public PlaceUpdateReqDto selectPlaceForUpdate(Long memberNo, Long no) {
        return queryFactory
                .select(Projections.constructor(PlaceUpdateReqDto.class,
                        placeEntity.no,
                        placeEntity.title,
                        placeEntity.content
                ))
                .from(placeEntity)
                .join(hostPlaceEntity).on(hostPlaceEntity.placeEntity.eq(placeEntity))
                .where(
                        placeEntity.delYn.eq("N"),
                        placeEntity.no.eq(no),
                        hostPlaceEntity.hostEntity.memberNo.eq(memberNo)
                )
                .fetchOne();
    }

    @Override
    public PlaceImgListRespDto selectImageList(Long no, Long memberNo) {
        List<PlaceImgListRespDto.ImageInfo> placeList = queryFactory
                .select(Projections.constructor(PlaceImgListRespDto.ImageInfo.class,
                        imgPlaceEntity.no,
                        imgPlaceEntity.currentUrl,
                        imgPlaceEntity.sort
                ))
                .from(imgPlaceEntity)
                .join(hostPlaceEntity).on(imgPlaceEntity.placeEntity.eq(hostPlaceEntity.placeEntity))
                .join(hostEntity).on(hostPlaceEntity.hostEntity.eq(hostEntity))
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
}