package com.sloway.app.place.repository.station;

import com.querydsl.core.Tuple;
import com.querydsl.core.types.Expression;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.place.dto.response.place.PlaceImgListRespDto;
import com.sloway.app.place.dto.response.station.StationDetailRespDto;
import com.sloway.app.place.dto.response.station.StationUpdateDetailRespDto;
import com.sloway.app.place.entity.station.QStationEntity;
import com.sloway.app.reservation.rsvn.entity.RsvnStatus;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;

import static com.sloway.app.host.entity.QHostEntity.hostEntity;
import static com.sloway.app.place.entity.hostPlace.QHostPlaceEntity.hostPlaceEntity;
import static com.sloway.app.place.entity.station.QImgStationEntity.imgStationEntity;
import static com.sloway.app.place.entity.station.QStationEntity.stationEntity;
import static com.sloway.app.place.entity.place.QPlaceEntity.placeEntity;
import static com.sloway.app.reservation.rsvn.entity.QRsvnEntity.rsvnEntity;
import static com.sloway.app.review.review.entity.QReviewEntity.reviewEntity;
import static com.sloway.app.place.entity.amenity.station.QStationAmenityEntity.stationAmenityEntity;
import static com.sloway.app.member.entity.QMemberEntity.memberEntity;
import static com.sloway.app.place.entity.station.QStationExceptionPeriodEntity.stationExceptionPeriodEntity;

@RequiredArgsConstructor
public class StationRepositoryImpl implements StationRepositoryCustom{

    private final JPAQueryFactory queryFactory;

    @Override
    public PlaceImgListRespDto selectImageList(Long no, Long memberNo) {
            List<PlaceImgListRespDto.ImageInfo> stationList = queryFactory
                    .select(Projections.constructor(PlaceImgListRespDto.ImageInfo.class,
                            imgStationEntity.no,
                            imgStationEntity.currentUrl,
                            imgStationEntity.sort
                    ))
                    .from(imgStationEntity)
                    .join(hostPlaceEntity).on(imgStationEntity.stationEntity.no.eq(hostPlaceEntity.stationEntity.no))
                    .join(hostEntity).on(hostPlaceEntity.hostEntity.no.eq(hostEntity.no))
                    .where(
                            imgStationEntity.stationEntity.no.eq(no),
                            hostEntity.memberNo.eq(memberNo)
                    )
                    .orderBy(imgStationEntity.sort.asc())
                    .fetch();

            return PlaceImgListRespDto.builder()
                    .placeImages(stationList != null ? stationList : List.of())
                    .build();

    }

    @Override
    public StationDetailRespDto selectStationDetailDashBoard(Long no, Long memberNo) {
        // 1. 기본 장소 정보 & 이미지 조회 (HeaderInfo, BasicInfo 용)
        Tuple placeTuple = fetchPlaceBasicInfo(no, memberNo);

        // 2. 통계 요약 정보 조회 (SummaryCard 용)
        StationDetailRespDto.SummaryCard summaryCard = fetchSummaryCard(no);

        // 3. 편의시설 리스트 조회
        List<String> facilities = fetchFacilities(no);

        // 4. 최근 예약 내역 조회
        List<StationDetailRespDto.RecentBooking> recentBookings = fetchRecentBookings(no);

        // --- 조립 (Builder Pattern) ---
        if (placeTuple == null) {
            throw new IllegalArgumentException("해당 장소를 찾을 수 없습니다. id=" + no);
        }

        return StationDetailRespDto.builder()
                .header(buildHeaderInfo(placeTuple, summaryCard))
                .basicInfo(buildBasicInfo(placeTuple))
                .summary(summaryCard)
                .facilities(facilities)
                .recentBookings(recentBookings)
                .build();
    }

    @Override
    public StationUpdateDetailRespDto selectDetailForUpdate(Long no, Long memberNo) {
        // 1. 메인 정보 조회 (단건 정보)
        StationUpdateDetailRespDto mainInfoDto = fetchStationMainUpdateInfo(no, memberNo);

        if (mainInfoDto == null) {
            throw new IllegalArgumentException("해당 숙소 정보를 찾을 수 없거나 권한이 없습니다. id=" + no);
        }

        // 2. 편의시설 리스트 조회 (AmenityDto)
        List<StationUpdateDetailRespDto.AmenityDto> facilityList = fetchStationAmenities(no);

        // 3. 예외 기간 요금 리스트 조회 (ExceptionPeriodDto)
        List<StationUpdateDetailRespDto.ExceptionPeriodDto> exceptionPeriods = fetchExceptionPeriods(no);

        // 4. 자바 단에서 리스트 데이터 세팅 후 반환
        return StationUpdateDetailRespDto.builder()
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
                .facilityList(facilityList)       // ✨ 편의시설 주입
                .exceptionPeriods(exceptionPeriods) // ✨ 예외 기간 주입
                .build();
    }

    /**
     * 1. 메인 숙소 및 장소 정보 쿼리 (Projections.fields 사용으로 순서 스트레스 방지)
     */
    private StationUpdateDetailRespDto fetchStationMainUpdateInfo(Long stationId, Long memberNo) {
        return queryFactory
                .select(Projections.fields(StationUpdateDetailRespDto.class,
                        placeEntity.no.as("placeNo"),
                        placeEntity.title.as("placeTitle"),
                        stationEntity.title,
                        stationEntity.content,
                        stationEntity.maxCnt.as("maxPeople"),
                        stationEntity.cnt.as("basePeople"),
                        stationEntity.rooms,   // 방 개수 컬럼 가정
                        stationEntity.checkinTime.as("checkIn"),
                        stationEntity.checkoutTime.as("checkOut"),
                        stationEntity.monPrice,
                        stationEntity.tuePrice,
                        stationEntity.wedPrice,
                        stationEntity.thuPrice,
                        stationEntity.friPrice,
                        stationEntity.satPrice,
                        stationEntity.sunPrice,
                        stationEntity.holPrice
                ))
                .from(stationEntity)
                .join(placeEntity).on(placeEntity.no.eq(stationEntity.placeEntity.no))
                .join(hostPlaceEntity).on(hostPlaceEntity.placeEntity.no.eq(placeEntity.no))
                .where(
                        stationEntity.no.eq(stationId),
                        hostPlaceEntity.hostEntity.memberNo.eq(memberNo) // 본인 숙소인지 검증
                )
                .fetchOne();
    }

    /**
     * 2. 편의시설 식별 번호 목록 조회
     */
    private List<StationUpdateDetailRespDto.AmenityDto> fetchStationAmenities(Long stationId) {
        return queryFactory
                .select(Projections.fields(StationUpdateDetailRespDto.AmenityDto.class,
                        stationAmenityEntity.amenityEntity.no.as("amenityNo")
                ))
                .from(stationAmenityEntity)
                .where(stationAmenityEntity.stationEntity.no.eq(stationId))
                .fetch();
    }

    /**
     * 3. 예외 기간 요금 목록 조회
     */
    private List<StationUpdateDetailRespDto.ExceptionPeriodDto> fetchExceptionPeriods(Long stationId) {
        // ⚠️ 해당 프로젝트의 '예외 기간 요금 엔티티'명(예: stationExceptionPriceEntity 등)으로 매핑해야 합니다.
        return queryFactory
                .select(Projections.fields(StationUpdateDetailRespDto.ExceptionPeriodDto.class,
                        stationExceptionPeriodEntity.startDate.as("startDate"),
                        stationExceptionPeriodEntity.endDate.as("endDate"),
                        stationExceptionPeriodEntity.monPrice.as("monPrice"),
                        stationExceptionPeriodEntity.tuePrice.as("tuePrice"),
                        stationExceptionPeriodEntity.wedPrice.as("wedPrice"),
                        stationExceptionPeriodEntity.thuPrice.as("thuPrice"),
                        stationExceptionPeriodEntity.friPrice.as("friPrice"),
                        stationExceptionPeriodEntity.satPrice.as("satPrice"),
                        stationExceptionPeriodEntity.sunPrice.as("sunPrice"),
                        stationExceptionPeriodEntity.holPrice.as("holPrice")
                ))
                .from(stationExceptionPeriodEntity)
                .where(stationExceptionPeriodEntity.stationEntity.no.eq(stationId))
                .fetch();
    }

    /// ///////////////////////////////////////////////////////////////////////////
    // 섹션별 개별 쿼리 및 빌더 메서드 분리

    /**
     * 1. 장소 기본 정보 및 대표 이미지 쿼리 (Tuple 반환)
     */
    private Tuple fetchPlaceBasicInfo(Long stationId, Long memberNo) {
        return queryFactory
                .select(
                        stationEntity.title,
                        placeEntity.title,
                        placeEntity.type,
                        hostPlaceEntity.status,
                        placeEntity.address,
                        stationEntity.maxCnt,
                        stationEntity.cnt,
                        stationEntity.monPrice,
                        stationEntity.holPrice,
                        stationEntity.checkinTime,
                        stationEntity.checkoutTime,
                        imgStationEntity.currentUrl
                )
                .from(stationEntity)
                .join(placeEntity).on(placeEntity.no.eq(stationEntity.placeEntity.no))
                .leftJoin(imgStationEntity).on(imgStationEntity.stationEntity.no.eq(stationId).and(imgStationEntity.sort.eq(1)))
                .leftJoin(hostPlaceEntity).on(hostPlaceEntity.placeEntity.no.eq(stationEntity.placeEntity.no))
                .where(
                        stationEntity.no.eq(stationId),
                        hostPlaceEntity.hostEntity.memberNo.eq(memberNo)
                )
                .fetchOne();
    }

    /**
     * 2. 요약 카드 통계 쿼리 (이번 달 매출, 예약 수, 평점)
     */
    private StationDetailRespDto.SummaryCard fetchSummaryCard(Long stationId) {
        // 이번 달 기준 시간 구하기
        YearMonth currentMonth = YearMonth.now();
        LocalDate startOfMonth = currentMonth.atDay(1);
        LocalDate endOfMonth = currentMonth.atEndOfMonth();

        // 2-1. 이번 달 예약 건수 및 매출
        Tuple bookingStats = queryFactory
                .select(
                        rsvnEntity.no.count(),
                        rsvnEntity.amt.sum().coalesce(0) // null 방지 (DB 컬럼이 정수형이면 Integer 반환 가능)
                )
                .from(rsvnEntity)
                .where(
                        rsvnEntity.stationNo.no.eq(stationId),
                        rsvnEntity.createdAt.between(startOfMonth.atStartOfDay(), endOfMonth.atTime(23, 59, 59)),
                        rsvnEntity.status.in(RsvnStatus.S, RsvnStatus.E)
                )
                .fetchOne();

        // 2-2. 총 리뷰 수 및 평균 평점
        Tuple reviewStats = queryFactory
                .select(
                        reviewEntity.no.count(),
                        reviewEntity.scoreTotal.avg().coalesce(0.0)
                )
                .from(reviewEntity)
                .where(reviewEntity.rsvnNo.stationNo.no.eq(stationId))
                .fetchOne();

        // ✨ [수정 포인트] Integer / Long 캐스팅 에러 방지를 위해 최상위 숫자형인 Number로 먼저 꺼냅니다.
        Number monthlyBookingsValue = bookingStats != null ? bookingStats.get(0, Number.class) : 0;
        Number monthlyRevenueValue = bookingStats != null ? bookingStats.get(1, Number.class) : 0L;
        Number totalReviewsValue = reviewStats != null ? reviewStats.get(0, Number.class) : 0;

        return StationDetailRespDto.SummaryCard.builder()
                .monthlyBookings(monthlyBookingsValue != null ? monthlyBookingsValue.intValue() : 0)
                .monthlyRevenue(monthlyRevenueValue != null ? monthlyRevenueValue.longValue() : 0L) // 여기서 Integer든 Long이든 안전하게 가공됩니다.
                .totalReviews(totalReviewsValue != null ? totalReviewsValue.intValue() : 0)
                .averageRating(reviewStats != null ? Math.round(reviewStats.get(1, Double.class) * 10) / 10.0 : 0.0)
                .build();
    }

    /**
     * 3. 편의시설 리스트 쿼리
     */
    private List<String> fetchFacilities(Long stationId) {
        return queryFactory
                .select(stationAmenityEntity.amenityEntity.name)
                .from(stationAmenityEntity)
                .where(stationAmenityEntity.stationEntity.no.eq(stationId))
                .fetch();
    }

    /**
     * 4. 최근 예약 내역 쿼리 (최대 3건)
     */
    private List<StationDetailRespDto.RecentBooking> fetchRecentBookings(Long stationId) {
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
                .where(rsvnEntity.stationNo.no.eq(stationId))
                .orderBy(rsvnEntity.createdAt.desc())
                .limit(3) // 기획서 상 최근 3건 노출
                .fetch();
    }

    private StationDetailRespDto.HeaderInfo buildHeaderInfo(Tuple tuple, StationDetailRespDto.SummaryCard summary) {
        // 운영 상태 및 타입 한글 변환
        Object statusObj = tuple.get(hostPlaceEntity.status);
        String operationStatus = statusObj != null ? statusObj.toString() : "운영 대기";
        if ("A".equals(operationStatus)) operationStatus = "운영중";
        else if ("P".equals(operationStatus)) operationStatus = "승인대기";
        else if ("R".equals(operationStatus)) operationStatus = "승인반려";

        Object typeObj = tuple.get(placeEntity.type);
        String placeType = typeObj != null ? typeObj.toString() : "";
        if ("STATION".equals(placeType)) placeType = "숙소";

        return StationDetailRespDto.HeaderInfo.builder()
                .imageUrl(tuple.get(imgStationEntity.currentUrl))
                .type(placeType)
                .status(operationStatus)
                .title(tuple.get(placeEntity.title)) // ✨ 이제 쿼리에서 placeEntity.title을 조회했으므로 정상적으로 값이 들어옵니다!
                .location(tuple.get(placeEntity.address))
                .rating(summary.getAverageRating())
                .reviewCount(summary.getTotalReviews())
                .build();
    }

    private StationDetailRespDto.BasicInfo buildBasicInfo(Tuple tuple) {
        // 숙소 타입 한글 변환 일치
        Object typeObj = tuple.get(placeEntity.type);
        String placeType = typeObj != null ? typeObj.toString() : "";
        if ("STATION".equals(placeType)) placeType = "숙소";

        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        return StationDetailRespDto.BasicInfo.builder()
                .name(tuple.get(stationEntity.title)) // 여기선 이미 정상적으로 잘 뽑고 계셨습니다!
                .type(placeType)
                .address(tuple.get(placeEntity.address))
                .capacity(tuple.get(stationEntity.maxCnt))
                .baseCapacity(tuple.get(stationEntity.cnt))
                .basePrice(tuple.get(stationEntity.monPrice) != null ? tuple.get(stationEntity.monPrice).longValue() : 0L)
                .weekendPrice(tuple.get(stationEntity.holPrice) != null ? tuple.get(stationEntity.holPrice).longValue() : 0L)
                .checkInTime(formatToTimeOnly(tuple.get(stationEntity.checkinTime), timeFormatter, "15:00"))
                .checkOutTime(formatToTimeOnly(tuple.get(stationEntity.checkoutTime), timeFormatter, "11:00")).build();
    }

    private String formatToTimeOnly(Object timeObj, DateTimeFormatter formatter, String defaultTime) {
        if (timeObj == null) {
            return defaultTime; // 데이터가 없으면 기본값("15:00" 등) 리턴
        }

        try {
            // 1. DB에서 이미 LocalTime 객체로 인식해서 가져온 경우
            if (timeObj instanceof LocalTime) {
                return ((LocalTime) timeObj).format(formatter);
            }

            // 2. DB에서 LocalDateTime(날짜+시간) 객체로 가져온 경우 -> 시간만 추출
            if (timeObj instanceof LocalDateTime) {
                return ((LocalDateTime) timeObj).toLocalTime().format(formatter);
            }

            // 3. DB나 드라이버 특성상 String("2026-05-26 15:00:00" 등)으로 넘어온 경우
            String timeStr = timeObj.toString().trim();
            if (timeStr.contains(" ")) {
                // 공백을 기준으로 쪼개어 뒤의 시간 문자열("15:00:00")만 확보
                timeStr = timeStr.split(" ")[1];
            }

            // "HH:mm" 형태인 앞 5글자만 따서 파싱 후 포맷팅
            return LocalTime.parse(timeStr.substring(0, 5)).format(formatter);

        } catch (Exception e) {
            // 혹시 모를 파싱 예외 발생 시 서버가 터지지 않도록 안전하게 기본값 리턴
            return defaultTime;
        }
    }
}
