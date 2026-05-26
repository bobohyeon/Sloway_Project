package com.sloway.app.place.repository.workStay;

import com.querydsl.core.Tuple;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.place.dto.response.station.StationDetailRespDto;
import com.sloway.app.place.dto.response.station.StationUpdateDetailRespDto;
import com.sloway.app.place.dto.response.workStay.WorkStayImageListRespDto;
import com.sloway.app.place.dto.response.workStay.WorkStayUpdateDetailRespDto;
import com.sloway.app.reservation.rsvn.entity.RsvnStatus;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;

import static com.sloway.app.member.entity.QMemberEntity.memberEntity;
import static com.sloway.app.place.entity.place.QPlaceEntity.placeEntity;
import static com.sloway.app.place.entity.workStay.QImgWorkStayEntity.imgWorkStayEntity;
import static com.sloway.app.place.entity.workStay.workOffice.QWorkOfficeEntity.workOfficeEntity;
import static com.sloway.app.place.entity.workStay.workOffice.QImgWorkStayOfficeEntity.imgWorkStayOfficeEntity;
import static com.sloway.app.place.entity.hostPlace.QHostPlaceEntity.hostPlaceEntity;
import static com.sloway.app.host.entity.QHostEntity.hostEntity;
import static com.sloway.app.reservation.rsvn.entity.QRsvnEntity.rsvnEntity;
import static com.sloway.app.review.review.entity.QReviewEntity.reviewEntity;
import static com.sloway.app.place.entity.workStay.QWorkStayEntity.workStayEntity;
import static com.sloway.app.place.entity.amenity.workStay.QWorkAmenityEntity.workAmenityEntity;
import static com.sloway.app.place.entity.workStay.QWorkExceptionPeriodEntity.workExceptionPeriodEntity;
import static com.sloway.app.place.entity.amenity.workStay.workOffice.QWorkOfficeAmenityEntity.workOfficeAmenityEntity;

@RequiredArgsConstructor
public class WorkStayRepositoryImpl implements WorkStayRepositoryCustom{

    private final JPAQueryFactory queryFactory;

    @Override
    public WorkStayImageListRespDto selectImageList(Long no, Long memberNo) {
        List<WorkStayImageListRespDto.ImageInfo> stayList = queryFactory
                .select(Projections.constructor(WorkStayImageListRespDto.ImageInfo.class,
                        imgWorkStayEntity.no,
                        imgWorkStayEntity.currentUrl,
                        imgWorkStayEntity.sort
                ))
                .from(imgWorkStayEntity)
                .join(hostPlaceEntity).on(imgWorkStayEntity.workStayEntity.no.eq(hostPlaceEntity.workStayEntity.no))
                .join(hostEntity).on(hostPlaceEntity.hostEntity.no.eq(hostEntity.no))
                .where(
                        imgWorkStayEntity.workStayEntity.no.eq(no),
                        hostEntity.memberNo.eq(memberNo)
                )
                .orderBy(imgWorkStayEntity.sort.asc())
                .fetch();

        // 워크앤스테이 내 오피스 이미지 리스트 조회
        List<WorkStayImageListRespDto.ImageInfo> officeList = queryFactory
                .select(Projections.constructor(WorkStayImageListRespDto.ImageInfo.class,
                        imgWorkStayOfficeEntity.no,
                        imgWorkStayOfficeEntity.currentUrl,
                        imgWorkStayOfficeEntity.sort
                ))
                .from(imgWorkStayOfficeEntity)
                .join(imgWorkStayOfficeEntity.workOfficeEntity, workOfficeEntity)
                .join(hostPlaceEntity).on(workOfficeEntity.workStayEntity.no.eq(hostPlaceEntity.workStayEntity.no))
                .join(hostEntity).on(hostPlaceEntity.hostEntity.no.eq(hostEntity.no))
                .where(
                        workOfficeEntity.workStayEntity.no.eq(no),
                        hostEntity.memberNo.eq(memberNo)
                )
                .orderBy(imgWorkStayOfficeEntity.sort.asc())
                .fetch();

        return WorkStayImageListRespDto.builder()
                .workStayImages(stayList != null ? stayList : List.of())
                .officeImages(officeList != null ? officeList : List.of())
                .build();
    }

    @Override
    public StationDetailRespDto selectWorkStayDetailDashBoard(Long no, Long memberNo) {
        // 1. 기본 정보 및 대표 이미지 조회 (Tuple)
        Tuple tuple = fetchWorkStayBasicInfo(no, memberNo);

        if (tuple == null) {
            throw new IllegalArgumentException("해당 워케이션 정보를 찾을 수 없거나 권한이 없습니다. id=" + no);
        }

        // 2. 통계 카드 데이터 조회 (매출, 예약수, 평점)
        StationDetailRespDto.SummaryCard summary = fetchSummaryCard(no);

        // 3. 헤더 정보 및 상세 기본 정보 빌드
        StationDetailRespDto.HeaderInfo headerInfo = buildWorkStayHeaderInfo(tuple, summary);
        StationDetailRespDto.BasicInfo basicInfo = buildWorkStayBasicInfo(tuple);

        // 4. 편의시설 텍스트 리스트 조회
        List<String> facilities = fetchFacilities(no);

        // 5. 최근 예약 내역 조회 (최대 3건)
        List<StationDetailRespDto.RecentBooking> recentBookings = fetchRecentBookings(no);

        // 6.최종 대시보드 DTO 조립 반환
        return StationDetailRespDto.builder()
                .header(headerInfo)
                .basicInfo(basicInfo)
                .summary(summary)
                .facilities(facilities)
                .recentBookings(recentBookings)
                .build();
    }


    private Tuple fetchWorkStayBasicInfo(Long workStayId, Long memberNo) {
        return queryFactory
                .select(
                        workStayEntity.title,
                        placeEntity.title,
                        placeEntity.type,
                        hostPlaceEntity.status,
                        placeEntity.address,
                        workStayEntity.maxCnt,
                        workStayEntity.cnt,
                        workStayEntity.monPrice,
                        workStayEntity.holPrice,
                        workStayEntity.checkinTime,
                        workStayEntity.checkoutTime,
                        imgWorkStayEntity.currentUrl
                )
                .from(workStayEntity)
                .join(placeEntity).on(placeEntity.no.eq(workStayEntity.placeEntity.no))
                .leftJoin(imgWorkStayEntity).on(imgWorkStayEntity.workStayEntity.no.eq(workStayId).and(imgWorkStayEntity.sort.eq(1)))
                .leftJoin(hostPlaceEntity).on(hostPlaceEntity.placeEntity.no.eq(placeEntity.no))
                .where(
                        workStayEntity.no.eq(workStayId),
                        hostPlaceEntity.hostEntity.memberNo.eq(memberNo)
                )
                .fetchOne();
    }

    private WorkStayUpdateDetailRespDto fetchWorkStayMainUpdateInfo(Long workStayId, Long memberNo) {
        return queryFactory
                .select(Projections.fields(WorkStayUpdateDetailRespDto.class,
                        placeEntity.no.as("placeNo"),
                        placeEntity.title.as("placeTitle"),
                        workStayEntity.title,
                        workStayEntity.content,
                        workStayEntity.maxCnt.as("maxPeople"),
                        workStayEntity.cnt.as("basePeople"),
                        workStayEntity.rooms,
                        workStayEntity.checkinTime.as("checkIn"),
                        workStayEntity.checkoutTime.as("checkOut"),
                        workStayEntity.monPrice,
                        workStayEntity.tuePrice,
                        workStayEntity.wedPrice,
                        workStayEntity.thuPrice,
                        workStayEntity.friPrice,
                        workStayEntity.satPrice,
                        workStayEntity.sunPrice,
                        workStayEntity.holPrice
                ))
                .from(workStayEntity)
                .join(placeEntity).on(placeEntity.no.eq(workStayEntity.placeEntity.no))
                .join(hostPlaceEntity).on(hostPlaceEntity.placeEntity.no.eq(placeEntity.no))
                .where(
                        workStayEntity.no.eq(workStayId),
                        hostPlaceEntity.hostEntity.memberNo.eq(memberNo)
                )
                .fetchOne();
    }

    private StationDetailRespDto.SummaryCard fetchSummaryCard(Long workStayId) {
        YearMonth currentMonth = YearMonth.now();
        LocalDate startOfMonth = currentMonth.atDay(1);
        LocalDate endOfMonth = currentMonth.atEndOfMonth();

        // 1. 이번 달 예약 건수 및 매출 쿼리
        Tuple bookingStats = queryFactory
                .select(
                        rsvnEntity.no.count(),
                        rsvnEntity.amt.sum().coalesce(0) // SQL 레벨 null 방지
                )
                .from(rsvnEntity)
                .where(
                        rsvnEntity.workStayNo.no.eq(workStayId),
                        rsvnEntity.createdAt.between(startOfMonth.atStartOfDay(), endOfMonth.atTime(23, 59, 59)),
                        rsvnEntity.status.in(RsvnStatus.S, RsvnStatus.E)
                )
                .fetchOne();

        // 2. 총 리뷰 수 및 평균 평점 쿼리
        Tuple reviewStats = queryFactory
                .select(
                        reviewEntity.no.count(),
                        reviewEntity.scoreTotal.avg().coalesce(0.0) // SQL 레벨 null 방지
                )
                .from(reviewEntity)
                .where(reviewEntity.rsvnNo.workStayNo.no.eq(workStayId))
                .fetchOne();

        // 3. ✨ [자바 레벨 2중 방어] Tuple 객체 자체가 null인 경우 완벽 방어
        int monthlyBookings = 0;
        long monthlyRevenue = 0L;
        int totalReviews = 0;
        double averageRating = 0.0;

        // 3-1. 예약 통계 바인딩
        if (bookingStats != null) {
            Number bookingsValue = bookingStats.get(0, Number.class);
            Number revenueValue = bookingStats.get(1, Number.class);

            monthlyBookings = (bookingsValue != null) ? bookingsValue.intValue() : 0;
            monthlyRevenue = (revenueValue != null) ? revenueValue.longValue() : 0L;
        }

        // 3-2. 리뷰 통계 바인딩
        if (reviewStats != null) {
            Number reviewsValue = reviewStats.get(0, Number.class);
            Double ratingValue = reviewStats.get(1, Double.class);

            totalReviews = (reviewsValue != null) ? reviewsValue.intValue() : 0;
            averageRating = (ratingValue != null) ? Math.round(ratingValue * 10) / 10.0 : 0.0;
        }

        return StationDetailRespDto.SummaryCard.builder()
                .monthlyBookings(monthlyBookings)
                .monthlyRevenue(monthlyRevenue)
                .totalReviews(totalReviews)
                .averageRating(averageRating)
                .build();
    }

    private List<WorkStayUpdateDetailRespDto.AmenityDto> fetchWorkStayAmenities(Long workStayId) {
        return queryFactory
                .select(Projections.fields(WorkStayUpdateDetailRespDto.AmenityDto.class,
                        workAmenityEntity.amenityEntity.no.as("amenityNo")
                ))
                .from(workAmenityEntity)
                .where(workAmenityEntity.workStayEntity.no.eq(workStayId))
                .fetch();
    }

    private List<String> fetchFacilities(Long workStayId) {
        return queryFactory
                .select(workAmenityEntity.amenityEntity.name)
                .from(workAmenityEntity)
                .where(workAmenityEntity.workStayEntity.no.eq(workStayId))
                .fetch();
    }

    private List<WorkStayUpdateDetailRespDto.ExceptionPeriodDto> fetchExceptionPeriods(Long workStayId) {
        return queryFactory
                .select(Projections.fields(WorkStayUpdateDetailRespDto.ExceptionPeriodDto.class,
                        workExceptionPeriodEntity.startDate.as("startDate"),
                        workExceptionPeriodEntity.endDate.as("endDate"),
                        workExceptionPeriodEntity.monPrice.as("monPrice"),
                        workExceptionPeriodEntity.tuePrice.as("tuePrice"),
                        workExceptionPeriodEntity.wedPrice.as("wedPrice"),
                        workExceptionPeriodEntity.thuPrice.as("thuPrice"),
                        workExceptionPeriodEntity.friPrice.as("friPrice"),
                        workExceptionPeriodEntity.satPrice.as("satPrice"),
                        workExceptionPeriodEntity.sunPrice.as("sunPrice"),
                        workExceptionPeriodEntity.holPrice.as("holPrice")
                ))
                .from(workExceptionPeriodEntity)
                .where(workExceptionPeriodEntity.workStayEntity.no.eq(workStayId))
                .fetch();
    }

    private List<StationDetailRespDto.RecentBooking> fetchRecentBookings(Long workStayId) {
        return queryFactory
                .select(Projections.constructor(StationDetailRespDto.RecentBooking.class,
                        rsvnEntity.no,
                        memberEntity.imgUrl,
                        memberEntity.name,
                        rsvnEntity.no.as("bookingCode"),
                        rsvnEntity.checkIn.stringValue().concat("-").concat(rsvnEntity.checkOut.stringValue()),
                        rsvnEntity.amt
                ))
                .from(rsvnEntity)
                .join(memberEntity).on(rsvnEntity.memberNo.eq(memberEntity))
                .where(rsvnEntity.workStayNo.no.eq(workStayId))
                .orderBy(rsvnEntity.createdAt.desc())
                .limit(3)
                .fetch();
    }

    // =========================================================================
    // [3] 매핑 빌더 및 포맷터 함수들
    // =========================================================================

    private StationDetailRespDto.HeaderInfo buildWorkStayHeaderInfo(Tuple tuple, StationDetailRespDto.SummaryCard summary) {
        Object statusObj = tuple.get(hostPlaceEntity.status);
        String operationStatus = statusObj != null ? statusObj.toString() : "운영 대기";
        if ("A".equals(operationStatus)) operationStatus = "운영중";
        else if ("P".equals(operationStatus)) operationStatus = "승인대기";
        else if ("R".equals(operationStatus)) operationStatus = "승인반려";

        Object typeObj = tuple.get(placeEntity.type);
        String placeType = typeObj != null ? typeObj.toString() : "";
        if ("WORK_STAY".equals(placeType)) placeType = "워크앤스테이";

        return StationDetailRespDto.HeaderInfo.builder()
                .imageUrl(tuple.get(imgWorkStayEntity.currentUrl))
                .type(placeType)
                .status(operationStatus)
                .title(tuple.get(placeEntity.title))
                .location(tuple.get(placeEntity.address))
                .rating(summary.getAverageRating())
                .reviewCount(summary.getTotalReviews())
                .build();
    }

    private StationDetailRespDto.BasicInfo buildWorkStayBasicInfo(Tuple tuple) {
        Object typeObj = tuple.get(placeEntity.type);
        String placeType = typeObj != null ? typeObj.toString() : "";
        if ("WORK_STAY".equals(placeType)) placeType = "워케이션";

        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        return StationDetailRespDto.BasicInfo.builder()
                .name(tuple.get(workStayEntity.title))
                .type(placeType)
                .address(tuple.get(placeEntity.address))
                .capacity(tuple.get(workStayEntity.maxCnt))
                .baseCapacity(tuple.get(workStayEntity.cnt))
                .basePrice(tuple.get(workStayEntity.monPrice) != null ? tuple.get(workStayEntity.monPrice).longValue() : 0L)
                .weekendPrice(tuple.get(workStayEntity.holPrice) != null ? tuple.get(workStayEntity.holPrice).longValue() : 0L)
                .checkInTime(formatToTimeOnly(tuple.get(workStayEntity.checkinTime), timeFormatter, "15:00"))
                .checkOutTime(formatToTimeOnly(tuple.get(workStayEntity.checkoutTime), timeFormatter, "11:00"))
                .build();
    }

    private String formatToTimeOnly(Object timeObj, DateTimeFormatter formatter, String defaultTime) {
        if (timeObj == null) return defaultTime;
        try {
            if (timeObj instanceof LocalTime) return ((LocalTime) timeObj).format(formatter);
            if (timeObj instanceof LocalDateTime) return ((LocalDateTime) timeObj).toLocalTime().format(formatter);
            String timeStr = timeObj.toString().trim();
            if (timeStr.contains(" ")) timeStr = timeStr.split(" ")[1];
            return LocalTime.parse(timeStr.substring(0, 5)).format(formatter);
        } catch (Exception e) {
            return defaultTime;
        }
    }

    private WorkStayUpdateDetailRespDto.OfficeDto fetchWorkStayOffice(Long workStayId) {
        return queryFactory
                .select(Projections.fields(WorkStayUpdateDetailRespDto.OfficeDto.class,
                        workOfficeEntity.no.as("officeNo"),
                        workOfficeEntity.cnt.as("cnt")
                ))
                .from(workOfficeEntity)
                .where(workOfficeEntity.workStayEntity.no.eq(workStayId))
                .fetchOne(); 
    }

    private List<Long> fetchOfficeAmenityIds(Long officeNo) {
        return queryFactory
                .select(workOfficeAmenityEntity.amenityEntity.no)
                .from(workOfficeAmenityEntity)
                .where(workOfficeAmenityEntity.workOfficeEntity.no.eq(officeNo))
                .fetch();
    }

    @Override
    public WorkStayUpdateDetailRespDto selectDetailForUpdate(Long no, Long memberNo) {
        WorkStayUpdateDetailRespDto mainInfoDto = fetchWorkStayMainUpdateInfo(no, memberNo);

        if (mainInfoDto == null) {
            throw new IllegalArgumentException("해당 숙소 정보를 찾을 수 없거나 권한이 없습니다. id=" + no);
        }

        List<WorkStayUpdateDetailRespDto.AmenityDto> facilityList = fetchWorkStayAmenities(no);
        List<WorkStayUpdateDetailRespDto.ExceptionPeriodDto> exceptionPeriods = fetchExceptionPeriods(no);

        WorkStayUpdateDetailRespDto.OfficeDto officeDto = fetchWorkStayOffice(no);
        if (officeDto != null) {
            List<Long> officeAmenities = fetchOfficeAmenityIds(officeDto.getOfficeNo());
            officeDto.setAmenityNoList(officeAmenities != null ? officeAmenities : List.of());
        }

        // 4. 자바 단에서 리스트 데이터 세팅 후 반환
        return WorkStayUpdateDetailRespDto.builder()
                .placeNo(mainInfoDto.getPlaceNo())
                .placeTitle(mainInfoDto.getPlaceTitle())
                .title(mainInfoDto.getTitle())
                .content(mainInfoDto.getContent())
                .maxPeople(mainInfoDto.getMaxPeople())
                .basePeople(mainInfoDto.getBasePeople())
                .rooms(mainInfoDto.getRooms())
                .checkIn(mainInfoDto.getCheckIn())
                .checkOut(mainInfoDto.getCheckOut())
                .monPrice(mainInfoDto.getMonPrice())
                .tuePrice(mainInfoDto.getTuePrice())
                .wedPrice(mainInfoDto.getWedPrice())
                .thuPrice(mainInfoDto.getThuPrice())
                .friPrice(mainInfoDto.getFriPrice())
                .satPrice(mainInfoDto.getSatPrice())
                .sunPrice(mainInfoDto.getSunPrice())
                .holPrice(mainInfoDto.getHolPrice())
                .facilityList(facilityList)
                .exceptionPeriods(exceptionPeriods)
                .office(officeDto)
                .build();
    }
}
