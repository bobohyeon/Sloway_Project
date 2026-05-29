package com.sloway.app.place.repository.hostPlace;

import com.querydsl.core.Tuple;
import com.querydsl.core.types.ExpressionUtils;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.place.dto.response.hostPlace.ApprovalCheckRespDto;
import com.sloway.app.place.dto.response.hostPlace.ApprovalDetailRespDto;
import com.sloway.app.place.dto.response.hostPlace.HostPlaceListRespDto;
import com.sloway.app.place.entity.hostPlace.ApprovalStatus;
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
        List<Tuple> results = queryFactory
                .select(
                        hostPlaceEntity.no,
                        placeEntity.title,
                        hostEntity.businessName,
                        hostPlaceEntity.status,
                        hostPlaceEntity.createdAt,
                        workStayEntity.monPrice,
                        stationEntity.monPrice,
                        ExpressionUtils.as(
                                JPAExpressions
                                        .select(officePeriodEntity.price.min())
                                        .from(officePeriodEntity)
                                        .where(officePeriodEntity.officeEntity.eq(officeEntity)),
                                "minOfficePrice"
                        )
                )
                .from(hostPlaceEntity)
                .join(hostPlaceEntity.hostEntity, hostEntity)
                .join(hostPlaceEntity.placeEntity, placeEntity)
                .leftJoin(workStayEntity).on(workStayEntity.placeEntity.eq(placeEntity))
                .leftJoin(officeEntity).on(officeEntity.placeEntity.eq(placeEntity))
                .leftJoin(stationEntity).on(stationEntity.placeEntity.eq(placeEntity))
                .fetch();

        return results.stream().map(tuple -> {
            String type = "PLACE";
            String price = "0";

            if (tuple.get(workStayEntity.monPrice) != null) {
                type = "WORK_STAY";
                price = String.valueOf(tuple.get(workStayEntity.monPrice)); // 예시: 월요일 요금
            } else if (tuple.get(officeEntity.cnt) != null) {
                type = "OFFICE";
                price = "오피스 가격 정책 적용";
            } else if (tuple.get(stationEntity.monPrice) != null) {
                type = "STATION";
                price = String.valueOf(tuple.get(stationEntity.monPrice));
            }

            String formattedDate = tuple.get(hostPlaceEntity.createdAt) != null
                    ? tuple.get(hostPlaceEntity.createdAt).toLocalDate().toString() : "";

            return HostPlaceListRespDto.builder()
                    .no(tuple.get(hostPlaceEntity.no))
                    .name(tuple.get(placeEntity.title))
                    .host(tuple.get(hostEntity.businessName))
                    .status(tuple.get(hostPlaceEntity.status.stringValue()))
                    .type(type)
                    .price(price)
                    .date(formattedDate)
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    public ApprovalCheckRespDto checkRejectReason(String type, Long no, Long memberNo) {
        // 1. type에 따라 필터링할 상세 공간 번호 조건 생성
        BooleanExpression targetCondition = Expressions.asBoolean(true); // 기본값 true

        if ("WORK_STAY".equals(type)) {
            targetCondition = hostPlaceEntity.workStayEntity.no.eq(no);
        } else if ("OFFICE".equals(type)) {
            targetCondition = hostPlaceEntity.officeEntity.no.eq(no);
        } else if ("STATION".equals(type)) {
            targetCondition = hostPlaceEntity.stationEntity.no.eq(no);
        } else {
            targetCondition = hostPlaceEntity.placeEntity.no.eq(no);
        }

        // 2. 쿼리 실행
        return queryFactory
                .select(Projections.constructor(ApprovalCheckRespDto.class,
                        hostPlaceEntity.rejectedReason
                ))
                .from(hostPlaceEntity)
                .join(hostPlaceEntity.hostEntity, hostEntity)
                .where(
                        hostPlaceEntity.status.eq(ApprovalStatus.R),
                        targetCondition,                  // 동적으로 생성한 공간 번호 조건
                        hostEntity.memberNo.eq(memberNo)  // 본인 확인
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
                .where(placeEntity.no.eq(no))
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
        // stationEntity.checkinTime/checkoutTime이 LocalDateTime이라면
        // DTO 생성자에서 해당 위치에 LocalDateTime을 받는 생성자가 있어야 합니다.
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
                        Expressions.constant(0), // maxCnt는 Integer로 고정
                        stationEntity.checkinTime, // LocalDateTime
                        stationEntity.checkoutTime  // LocalDateTime
                ))
                .from(stationEntity)
                .join(stationEntity.placeEntity, placeEntity)
                .join(hostPlaceEntity).on(hostPlaceEntity.stationEntity.eq(stationEntity))
                .join(hostEntity).on(hostPlaceEntity.hostEntity.eq(hostEntity))
                .join(memberEntity).on(hostEntity.memberNo.eq(memberEntity.no))
                .where(stationEntity.no.eq(no))
                .fetchOne();

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
                                .where(
                                        officePeriodEntity.officeEntity.no.eq(no),
                                        (officePeriodEntity.exceptionStartDate.isNull())
                                ),
                        officeEntity.cnt,
                        Expressions.constant(0), // maxCnt
                        Expressions.nullExpression(LocalDateTime.class),
                        Expressions.nullExpression(LocalDateTime.class)
                ))
                .from(officeEntity)
                .join(officeEntity.placeEntity, placeEntity)
                .leftJoin(hostPlaceEntity).on(hostPlaceEntity.officeEntity.eq(officeEntity))
                .leftJoin(hostEntity).on(hostPlaceEntity.hostEntity.eq(hostEntity))
                .leftJoin(memberEntity).on(hostEntity.memberNo.eq(memberEntity.no))
                .where(officeEntity.no.eq(no))
                .fetchOne();

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
                .leftJoin(hostPlaceEntity).on(hostPlaceEntity.workStayEntity.eq(workStayEntity))
                .leftJoin(hostEntity).on(hostPlaceEntity.hostEntity.eq(hostEntity))
                .leftJoin(memberEntity).on(hostEntity.memberNo.eq(memberEntity.no))
                .where(workStayEntity.no.eq(no))
                .fetchOne();

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

            List<ApprovalDetailRespDto.AmenityDto> mainAmenities = queryFactory
                    .select(Projections.constructor(ApprovalDetailRespDto.AmenityDto.class,
                            workAmenityEntity.amenityEntity.no,
                            workAmenityEntity.amenityEntity.name))
                    .from(workAmenityEntity)
                    .where(workAmenityEntity.workStayEntity.no.eq(no))
                    .fetch();

            // 2. 워크스테이 내 오피스 편의시설 조회
            List<ApprovalDetailRespDto.AmenityDto> officeAmenities = queryFactory
                    .select(Projections.constructor(ApprovalDetailRespDto.AmenityDto.class,
                            workOfficeAmenityEntity.amenityEntity.no,
                            workOfficeAmenityEntity.amenityEntity.name))
                    .from(workOfficeAmenityEntity)
                    .join(workOfficeAmenityEntity.workOfficeEntity, workOfficeEntity)
                    .where(workOfficeEntity.workStayEntity.no.eq(no))
                    .fetch();

            // 3. 두 리스트 병합 후 no 기준 중복 제거
            List<ApprovalDetailRespDto.AmenityDto> combinedAmenities = new ArrayList<>(Stream.concat(mainAmenities.stream(), officeAmenities.stream())
                    .collect(Collectors.toMap(
                            ApprovalDetailRespDto.AmenityDto::getNo, // Key: no
                            amenity -> amenity,                      // Value: 객체 자체
                            (existing, replacement) -> existing      // 중복 시 기존 것 유지
                    ))
                    .values());

            dto.setAmenities(combinedAmenities);
        }
        return dto;
    }
}