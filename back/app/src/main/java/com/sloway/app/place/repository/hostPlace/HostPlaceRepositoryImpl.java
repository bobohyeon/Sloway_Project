package com.sloway.app.place.repository.hostPlace;

import com.querydsl.core.Tuple;
import com.querydsl.core.types.ExpressionUtils;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.place.dto.response.hostPlace.ApprovalCheckRespDto;
import com.sloway.app.place.dto.response.hostPlace.ApprovalDetailRespDto;
import com.sloway.app.place.dto.response.hostPlace.HostPlaceListRespDto;
import com.sloway.app.place.entity.hostPlace.ApprovalStatus;
import com.sloway.app.place.entity.hostPlace.HostPlaceEntity;
import com.sloway.app.place.entity.place.QPlaceEntity;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;


import static com.sloway.app.host.entity.QHostEntity.hostEntity;
import static com.sloway.app.place.entity.place.QPlaceEntity.placeEntity;
import static com.sloway.app.place.entity.workStay.QWorkStayEntity.workStayEntity;
import static com.sloway.app.place.entity.workStay.workOffice.QWorkOfficeEntity.workOfficeEntity;
import static com.sloway.app.place.entity.office.QOfficeEntity.officeEntity;
import static com.sloway.app.place.entity.office.QOfficePeriodEntity.officePeriodEntity;
import static com.sloway.app.place.entity.station.QStationEntity.stationEntity;
import static com.sloway.app.place.entity.hostPlace.QHostPlaceEntity.hostPlaceEntity;
import static com.sloway.app.member.entity.QMemberEntity.memberEntity;
import static com.sloway.app.place.entity.place.QImgPlaceEntity.imgPlaceEntity;
import static com.sloway.app.place.entity.station.QImgStationEntity.imgStationEntity;
import static com.sloway.app.place.entity.office.QImgOfficeEntity.imgOfficeEntity;
import static com.sloway.app.place.entity.workStay.QImgWorkStayEntity.imgWorkStayEntity;
import static com.sloway.app.place.entity.workStay.workOffice.QImgWorkStayOfficeEntity.imgWorkStayOfficeEntity;
import static com.sloway.app.place.entity.amenity.station.QStationAmenityEntity.stationAmenityEntity;
import static com.sloway.app.place.entity.amenity.workStay.QWorkAmenityEntity.workAmenityEntity;
import static com.sloway.app.place.entity.amenity.workStay.workOffice.QWorkOfficeAmenityEntity.workOfficeAmenityEntity;
import static com.sloway.app.place.entity.amenity.office.QOfficeAmenityEntity.officeAmenityEntity;


@RequiredArgsConstructor
public class HostPlaceRepositoryImpl implements HostPlaceRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<HostPlaceListRespDto> findHostPlaceList() {
        QPlaceEntity workStayPlace = new QPlaceEntity("workStayPlace");

        QPlaceEntity officePlace = new QPlaceEntity("officePlace");

        QPlaceEntity stationPlace = new QPlaceEntity("stationPlace");

        // 1. 오피스 최소 가격 서브쿼리 정의
        var minOfficePriceSubQuery = JPAExpressions
                .select(officePeriodEntity.price.min().stringValue())
                .from(officePeriodEntity)
                .where(officePeriodEntity.officeEntity.no.eq(officeEntity.no));

        return queryFactory
                .select(Projections.constructor(HostPlaceListRespDto.class,
                        new CaseBuilder()
                                .when(hostPlaceEntity.workStayEntity.no.isNotNull()).then(hostPlaceEntity.workStayEntity.no)
                                .when(hostPlaceEntity.officeEntity.no.isNotNull()).then(hostPlaceEntity.officeEntity.no)
                                .when(hostPlaceEntity.stationEntity.no.isNotNull()).then(hostPlaceEntity.stationEntity.no)
                                .when(hostPlaceEntity.placeEntity.no.isNotNull()).then(hostPlaceEntity.placeEntity.no)
                                .otherwise((Long) null),
                        hostPlaceEntity.no,
                        // 타이틀: 타입에 따른 PLACE 타이틀과 상세 타이틀 결합
                        new CaseBuilder()
                                .when(hostPlaceEntity.workStayEntity.isNotNull()).then(workStayPlace.title.concat(" - ").concat(workStayEntity.title))
                                .when(hostPlaceEntity.officeEntity.isNotNull()).then(officePlace.title.concat(" - ").concat(officeEntity.title))
                                .when(hostPlaceEntity.stationEntity.isNotNull()).then(stationPlace.title.concat(" - ").concat(stationEntity.title))
                                .otherwise(placeEntity.title),
                        hostEntity.businessName,
                        // 타입 구분
                        new CaseBuilder()
                                .when(hostPlaceEntity.workStayEntity.isNotNull()).then("WORK_STAY")
                                .when(hostPlaceEntity.officeEntity.isNotNull()).then("OFFICE")
                                .when(hostPlaceEntity.stationEntity.isNotNull()).then("STATION")
                                .otherwise("PLACE"),
                        // 가격 처리
                        hostPlaceEntity.status.stringValue(),
                        new CaseBuilder()
                                .when(hostPlaceEntity.workStayEntity.isNotNull()).then(workStayEntity.monPrice.stringValue())
                                .when(hostPlaceEntity.stationEntity.isNotNull()).then(stationEntity.monPrice.stringValue())
                                .when(hostPlaceEntity.officeEntity.isNotNull()).then(minOfficePriceSubQuery)
                                .otherwise("0"),
                        hostPlaceEntity.createdAt.stringValue()
                ))
                .from(hostPlaceEntity)
                .join(hostEntity).on(hostPlaceEntity.hostEntity.eq(hostEntity))
                .leftJoin(placeEntity).on(hostPlaceEntity.placeEntity.eq(placeEntity))
                .leftJoin(workStayEntity).on(hostPlaceEntity.workStayEntity.eq(workStayEntity))
                .leftJoin(workStayPlace).on(workStayPlace.eq(workStayEntity.placeEntity)) // 별칭 Q클래스 활용
                .leftJoin(officeEntity).on(hostPlaceEntity.officeEntity.eq(officeEntity))
                .leftJoin(officePlace).on(officePlace.eq(officeEntity.placeEntity))
                .leftJoin(stationEntity).on(hostPlaceEntity.stationEntity.eq(stationEntity))
                .leftJoin(stationPlace).on(stationPlace.eq(stationEntity.placeEntity))
                .orderBy(
                        new CaseBuilder()
                                .when(hostPlaceEntity.status.eq(ApprovalStatus.P)).then(1)
                                .when(hostPlaceEntity.status.eq(ApprovalStatus.R)).then(2)
                                .when(hostPlaceEntity.status.eq(ApprovalStatus.A)).then(3)
                                .otherwise(4).asc(),
                        hostPlaceEntity.no.desc()
                ).fetch();
    }

    @Override
    public ApprovalCheckRespDto checkRejectReason(String type, Long no, Long memberNo) {
        // 1. type에 따른 동적 타겟 조건 및 최신 ID 서브쿼리용 조건 설정
        BooleanExpression typeCondition;

        if ("WORK_STAY".equals(type)) {
            typeCondition = hostPlaceEntity.workStayEntity.no.eq(no);
        } else if ("OFFICE".equals(type)) {
            typeCondition = hostPlaceEntity.officeEntity.no.eq(no);
        } else if ("STATION".equals(type)) {
            typeCondition = hostPlaceEntity.stationEntity.no.eq(no);
        } else {
            typeCondition = hostPlaceEntity.placeEntity.no.eq(no);
        }

        // 2. 해당 타입/번호에 대한 가장 최신 HOST_PLACE ID 서브쿼리
        // (반려 상태인 것 중 최신 것을 찾기 위해 상태 조건도 서브쿼리에 포함)
        var latestRejectHostPlaceIdSubQuery = JPAExpressions
                .select(hostPlaceEntity.no.max())
                .from(hostPlaceEntity)
                .where(typeCondition.and(hostPlaceEntity.status.eq(ApprovalStatus.R)));

        // 3. 쿼리 실행
        return queryFactory
                .select(Projections.constructor(ApprovalCheckRespDto.class,
                        hostPlaceEntity.rejectedReason
                ))
                .from(hostPlaceEntity)
                .join(hostPlaceEntity.hostEntity, hostEntity)
                .where(
                        hostPlaceEntity.no.in(latestRejectHostPlaceIdSubQuery), // 최신 반려 이력 1건 고정
                        hostEntity.memberNo.eq(memberNo) // 본인 확인
                )
                .fetchOne();
    }

    @Override
    public ApprovalDetailRespDto findCommonData(Long no) {
        // 1. 리스트 필드를 제외한 생성자 파라미터 개수(11개)에 맞춰 조회
        ApprovalDetailRespDto dto = queryFactory
                .select(Projections.constructor(ApprovalDetailRespDto.class,
                        hostPlaceEntity.no,
                        placeEntity.no,
                        Expressions.constant("PLACE"),
                        placeEntity.title,
                        placeEntity.content,
                        placeEntity.address,
                        memberEntity.name,
                        Expressions.constant(0),
                        Expressions.constant(0),
                        Expressions.constant(0),
                        Expressions.nullExpression(LocalDateTime.class),
                        Expressions.nullExpression(LocalDateTime.class)
                ))
                .from(hostPlaceEntity)
                .join(hostPlaceEntity.placeEntity, placeEntity)
                .leftJoin(hostPlaceEntity).on(hostPlaceEntity.placeEntity.eq(placeEntity))
                .leftJoin(hostEntity).on(hostPlaceEntity.hostEntity.eq(hostEntity))
                .leftJoin(memberEntity).on(hostEntity.memberNo.eq(memberEntity.no))
                .where(
                        placeEntity.no.eq(no),
                        hostPlaceEntity.status.eq(ApprovalStatus.P)
                )
                .fetchOne();

        // 2. 이미지는 별도 쿼리로 조회하여 주입
        if (dto != null) {
            List<ApprovalDetailRespDto.ImageDto> images = queryFactory
                    .select(Projections.constructor(ApprovalDetailRespDto.ImageDto.class,
                            imgPlaceEntity.no, imgPlaceEntity.currentUrl, imgPlaceEntity.sort))
                    .from(imgPlaceEntity)
                    .where(imgPlaceEntity.placeEntity.no.eq(no))
                    .fetch();

            dto.setImages(images);
        }

        return dto;
    }

    @Override
    public ApprovalDetailRespDto findStationDetail(Long no) {
        // 1. 해당 스테이션에 대한 가장 최신 '대기중(P)'인 HOST_PLACE ID 서브쿼리
        var latestPendingHostPlaceIdSubQuery = JPAExpressions
                .select(hostPlaceEntity.no.max())
                .from(hostPlaceEntity)
                .where(hostPlaceEntity.stationEntity.no.eq(no)
                        .and(hostPlaceEntity.status.eq(ApprovalStatus.P)));

        // 2. 쿼리 실행 (최신 이력 1건으로 고정)
        ApprovalDetailRespDto dto = queryFactory
                .select(Projections.constructor(ApprovalDetailRespDto.class,
                        hostPlaceEntity.no,
                        placeEntity.no,
                        placeEntity.type,
                        stationEntity.title,
                        stationEntity.content,
                        placeEntity.address,
                        memberEntity.name,
                        stationEntity.monPrice,
                        stationEntity.cnt,
                        Expressions.constant(0),
                        stationEntity.checkinTime,
                        stationEntity.checkoutTime
                ))
                .from(stationEntity)
                .join(stationEntity.placeEntity, placeEntity)
                .join(hostPlaceEntity).on(hostPlaceEntity.stationEntity.eq(stationEntity))
                .join(hostPlaceEntity.hostEntity, hostEntity)
                .join(memberEntity).on(memberEntity.no.eq(hostEntity.memberNo))
                .where(
                        stationEntity.no.eq(no),
                        hostPlaceEntity.no.in(latestPendingHostPlaceIdSubQuery) // [핵심 수정] 최신 이력 1건 필터링
                )
                .fetchOne();

        // 3. 이미지 및 편의시설 데이터 주입
        if (dto != null) {
            dto.setImages(queryFactory
                    .select(Projections.constructor(ApprovalDetailRespDto.ImageDto.class,
                            imgStationEntity.no,
                            imgStationEntity.currentUrl,
                            imgStationEntity.sort))
                    .from(imgStationEntity)
                    .where(imgStationEntity.stationEntity.no.eq(no))
                    .fetch());

            dto.setAmenities(queryFactory
                    .select(Projections.constructor(ApprovalDetailRespDto.AmenityDto.class,
                            stationAmenityEntity.amenityEntity.no,
                            stationAmenityEntity.amenityEntity.name))
                    .from(stationAmenityEntity)
                    .where(stationAmenityEntity.stationEntity.no.eq(no))
                    .fetch());
        }
        return dto;
    }

    @Override
    public ApprovalDetailRespDto findOfficeDetail(Long no) {
        // 1. 해당 오피스에 대한 가장 최신 '대기중(P)'인 HOST_PLACE ID 서브쿼리
        var latestPendingHostPlaceIdSubQuery = JPAExpressions
                .select(hostPlaceEntity.no.max())
                .from(hostPlaceEntity)
                .where(hostPlaceEntity.officeEntity.no.eq(no)
                        .and(hostPlaceEntity.status.eq(ApprovalStatus.P)));

        // 2. 쿼리 실행
        ApprovalDetailRespDto dto = queryFactory
                .select(Projections.constructor(ApprovalDetailRespDto.class,
                        hostPlaceEntity.no,
                        officeEntity.no,
                        placeEntity.type,
                        officeEntity.title,
                        officeEntity.content,
                        placeEntity.address,
                        memberEntity.name,
                        JPAExpressions
                                .select(officePeriodEntity.price.min())
                                .from(officePeriodEntity)
                                .where(officePeriodEntity.officeEntity.no.eq(no)
                                        .and(officePeriodEntity.exceptionStartDate.isNull())),
                        officeEntity.cnt,
                        Expressions.constant(0),
                        Expressions.nullExpression(LocalDateTime.class),
                        Expressions.nullExpression(LocalDateTime.class)
                ))
                .from(officeEntity)
                .join(officeEntity.placeEntity, placeEntity)
                // 최신 대기 이력 1건만 조인
                .join(hostPlaceEntity).on(hostPlaceEntity.no.in(latestPendingHostPlaceIdSubQuery))
                .join(hostPlaceEntity.hostEntity, hostEntity)
                .join(memberEntity).on(memberEntity.no.eq(hostEntity.memberNo))
                .where(officeEntity.no.eq(no))
                .fetchOne();

        // 3. 이미지 및 편의시설 주입
        if (dto != null) {
            dto.setImages(queryFactory
                    .select(Projections.constructor(ApprovalDetailRespDto.ImageDto.class,
                            imgOfficeEntity.no, imgOfficeEntity.currentUrl, imgOfficeEntity.sort))
                    .from(imgOfficeEntity)
                    .where(imgOfficeEntity.officeEntity.no.eq(no))
                    .fetch());

            dto.setAmenities(queryFactory
                    .select(Projections.constructor(ApprovalDetailRespDto.AmenityDto.class,
                            officeAmenityEntity.amenityEntity.no,
                            officeAmenityEntity.amenityEntity.name))
                    .from(officeAmenityEntity)
                    .where(officeAmenityEntity.officeEntity.no.eq(no))
                    .fetch());
        }
        return dto;
    }

    @Override
    public ApprovalDetailRespDto findWorkStayDetail(Long no) {
        // 1. 해당 워케이션에 대한 가장 최신 '대기중(P)'인 HOST_PLACE ID 서브쿼리
        var latestPendingHostPlaceIdSubQuery = JPAExpressions
                .select(hostPlaceEntity.no.max())
                .from(hostPlaceEntity)
                .where(hostPlaceEntity.workStayEntity.no.eq(no)
                        .and(hostPlaceEntity.status.eq(ApprovalStatus.P)));

        // 2. 쿼리 실행 (최신 이력 1건으로 고정)
        ApprovalDetailRespDto dto = queryFactory
                .select(Projections.constructor(ApprovalDetailRespDto.class,
                        hostPlaceEntity.no,
                        placeEntity.no,
                        placeEntity.type,
                        workStayEntity.title,
                        workStayEntity.content,
                        placeEntity.address,
                        memberEntity.name,
                        workStayEntity.monPrice,
                        workStayEntity.cnt,
                        workStayEntity.maxCnt,
                        workStayEntity.checkinTime,
                        workStayEntity.checkoutTime
                ))
                .from(workStayEntity)
                .join(workStayEntity.placeEntity, placeEntity)
                // 최신 대기 이력 1건만 조인
                .join(hostPlaceEntity).on(hostPlaceEntity.no.in(latestPendingHostPlaceIdSubQuery))
                .join(hostPlaceEntity.hostEntity, hostEntity)
                .join(memberEntity).on(memberEntity.no.eq(hostEntity.memberNo))
                .where(workStayEntity.no.eq(no))
                .fetchOne();

        // 3. 이미지 및 편의시설 데이터 주입
        if (dto != null) {
            dto.setImages(queryFactory
                    .select(Projections.constructor(ApprovalDetailRespDto.ImageDto.class,
                            imgWorkStayEntity.no, imgWorkStayEntity.currentUrl, imgWorkStayEntity.sort))
                    .from(imgWorkStayEntity)
                    .where(imgWorkStayEntity.workStayEntity.no.eq(no))
                    .fetch());

            dto.setSubImages(queryFactory
                    .select(Projections.constructor(ApprovalDetailRespDto.ImageDto.class,
                            imgWorkStayOfficeEntity.no, imgWorkStayOfficeEntity.currentUrl, imgWorkStayOfficeEntity.sort))
                    .from(imgWorkStayOfficeEntity)
                    .join(workOfficeEntity).on(imgWorkStayOfficeEntity.workOfficeEntity.eq(workOfficeEntity))
                    .where(workOfficeEntity.workStayEntity.no.eq(no))
                    .fetch());

            // 편의시설 조회 로직은 유지
            List<ApprovalDetailRespDto.AmenityDto> mainAmenities = queryFactory
                    .select(Projections.constructor(ApprovalDetailRespDto.AmenityDto.class,
                            workAmenityEntity.amenityEntity.no,
                            workAmenityEntity.amenityEntity.name))
                    .from(workAmenityEntity)
                    .where(workAmenityEntity.workStayEntity.no.eq(no))
                    .fetch();

            List<ApprovalDetailRespDto.AmenityDto> officeAmenities = queryFactory
                    .select(Projections.constructor(ApprovalDetailRespDto.AmenityDto.class,
                            workOfficeAmenityEntity.amenityEntity.no,
                            workOfficeAmenityEntity.amenityEntity.name))
                    .from(workOfficeAmenityEntity)
                    .join(workOfficeAmenityEntity.workOfficeEntity, workOfficeEntity)
                    .where(workOfficeEntity.workStayEntity.no.eq(no))
                    .fetch();

            List<ApprovalDetailRespDto.AmenityDto> combinedAmenities = new ArrayList<>(Stream.concat(mainAmenities.stream(), officeAmenities.stream())
                    .collect(Collectors.toMap(
                            ApprovalDetailRespDto.AmenityDto::getNo,
                            amenity -> amenity,
                            (existing, replacement) -> existing
                    ))
                    .values());

            dto.setAmenities(combinedAmenities);
        }
        return dto;
    }

    @Override
    public HostPlaceEntity findHostPlaceLatest(Long no, Long hostNo) {
        return queryFactory
                .selectFrom(hostPlaceEntity)
                .where(
                        hostPlaceEntity.placeEntity.no.eq(no),
                        hostPlaceEntity.hostEntity.memberNo.eq(hostNo),
                        hostPlaceEntity.status.eq(ApprovalStatus.P)
                )
                .orderBy(hostPlaceEntity.no.desc())
                .fetchFirst();
    }

    @Override
    public HostPlaceEntity findHostWorkLatest(Long no, Long hostNo) {
        Long latestNo = queryFactory
                .select(hostPlaceEntity.no.max())
                .from(hostPlaceEntity)
                .where(
                        hostPlaceEntity.workStayEntity.no.eq(no),
                        hostPlaceEntity.hostEntity.memberNo.eq(hostNo),
                        hostPlaceEntity.status.eq(ApprovalStatus.P)
                )
                .fetchOne();

        // 2. 해당 ID로 실제 엔티티 조회 (latestNo가 없을 경우 null 반환)
        if (latestNo == null) {
            return null;
        }

        return queryFactory
                .selectFrom(hostPlaceEntity)
                .where(hostPlaceEntity.no.eq(latestNo))
                .fetchOne();
    }

    @Override
    public HostPlaceEntity findHostStationLatest(Long no, Long hostNo) {
        // 1. 해당 장소(place) + 호스트 + 대기중인 상태의 가장 최신 ID 조회
        Long latestNo = queryFactory
                .select(hostPlaceEntity.no.max())
                .from(hostPlaceEntity)
                .where(
                        hostPlaceEntity.stationEntity.no.eq(no),
                        hostPlaceEntity.hostEntity.memberNo.eq(hostNo),
                        hostPlaceEntity.status.eq(ApprovalStatus.P)
                )
                .fetchOne();

        // 2. 해당 ID로 실제 엔티티 조회 (latestNo가 없을 경우 null 반환)
        if (latestNo == null) {
            return null;
        }

        return queryFactory
                .selectFrom(hostPlaceEntity)
                .where(hostPlaceEntity.no.eq(latestNo))
                .fetchOne();
    }

    @Override
    public HostPlaceEntity findHostOfficeLatest(Long no, Long hostNo) {
        // 1. 해당 장소(place) + 호스트 + 대기중인 상태의 가장 최신 ID 조회
        Long latestNo = queryFactory
                .select(hostPlaceEntity.no.max())
                .from(hostPlaceEntity)
                .where(
                        hostPlaceEntity.officeEntity.no.eq(no),
                        hostPlaceEntity.hostEntity.memberNo.eq(hostNo),
                        hostPlaceEntity.status.eq(ApprovalStatus.P)
                )
                .fetchOne();

        // 2. 해당 ID로 실제 엔티티 조회 (latestNo가 없을 경우 null 반환)
        if (latestNo == null) {
            return null;
        }

        return queryFactory
                .selectFrom(hostPlaceEntity)
                .where(hostPlaceEntity.no.eq(latestNo))
                .fetchOne();
    }
}