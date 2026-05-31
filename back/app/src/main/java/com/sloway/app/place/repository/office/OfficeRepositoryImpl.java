package com.sloway.app.place.repository.office;

import com.querydsl.core.Tuple;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.place.dto.response.office.OfficeUpdateDetailReqDto;
import com.sloway.app.place.dto.response.place.PlaceImgListRespDto;
import com.sloway.app.place.dto.response.station.StationDetailRespDto;
import com.sloway.app.reservation.rsvn.entity.RsvnStatus;
import lombok.RequiredArgsConstructor;

import java.time.YearMonth;
import java.util.List;

import static com.sloway.app.host.entity.QHostEntity.hostEntity;
import static com.sloway.app.place.entity.hostPlace.QHostPlaceEntity.hostPlaceEntity;
import static com.sloway.app.place.entity.office.QImgOfficeEntity.imgOfficeEntity;
import static com.sloway.app.place.entity.office.QOfficeEntity.officeEntity;
import static com.sloway.app.place.entity.office.QOfficePeriodEntity.officePeriodEntity;
import static com.sloway.app.place.entity.place.QPlaceEntity.placeEntity;
import static com.sloway.app.reservation.rsvn.entity.QRsvnEntity.rsvnEntity;
import static com.sloway.app.review.review.entity.QReviewEntity.reviewEntity;
import static com.sloway.app.place.entity.amenity.office.QOfficeAmenityEntity.officeAmenityEntity;
import static com.sloway.app.member.entity.QMemberEntity.memberEntity;

@RequiredArgsConstructor
public class OfficeRepositoryImpl implements OfficeRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public PlaceImgListRespDto selectImageList(Long no, Long memberNo) {
        List<PlaceImgListRespDto.ImageInfo> officeList = queryFactory
                .select(Projections.constructor(PlaceImgListRespDto.ImageInfo.class,
                        imgOfficeEntity.no,
                        imgOfficeEntity.currentUrl,
                        imgOfficeEntity.sort
                ))
                .from(imgOfficeEntity)
                .join(officeEntity).on(imgOfficeEntity.officeEntity.eq(officeEntity))
                .join(placeEntity).on(officeEntity.placeEntity.eq(placeEntity))
                .join(hostPlaceEntity).on(placeEntity.eq(hostPlaceEntity.placeEntity))
                .join(hostEntity).on(hostPlaceEntity.hostEntity.eq(hostEntity))
                .where(
                        imgOfficeEntity.officeEntity.no.eq(no),
                        hostEntity.memberNo.eq(memberNo)
                )
                .orderBy(imgOfficeEntity.sort.asc())
                .fetch();

        return PlaceImgListRespDto.builder()
                .placeImages(officeList != null ? officeList : List.of())
                .build();
    }

    @Override
    public StationDetailRespDto selectOfficeDetailDashBoard(Long no, Long memberNo) {
        Tuple placeTuple = fetchPlaceBasicInfo(no, memberNo);
        if (placeTuple == null) throw new IllegalArgumentException("해당 오피스를 찾을 수 없습니다. id=" + no);

        StationDetailRespDto.SummaryCard summaryCard = fetchSummaryCard(no);
        List<String> facilities = fetchFacilities(no);
        List<StationDetailRespDto.RecentBooking> recentBookings = fetchRecentBookings(no);

        return StationDetailRespDto.builder()
                .header(buildHeaderInfo(placeTuple, summaryCard))
                .basicInfo(buildBasicInfo(placeTuple, no))
                .summary(summaryCard)
                .facilities(facilities)
                .recentBookings(recentBookings)
                .build();
    }

    private Tuple fetchPlaceBasicInfo(Long officeId, Long memberNo) {
        // 1. 최신 HOST_PLACE ID 서브쿼리
        var latestHostPlaceIdSubQuery = JPAExpressions
                .select(hostPlaceEntity.no.max())
                .from(hostPlaceEntity)
                .where(hostPlaceEntity.officeEntity.no.eq(officeId));

        // 2. 쿼리 실행
        return queryFactory
                .select(
                        officeEntity.title,
                        placeEntity.title,
                        placeEntity.type,
                        hostPlaceEntity.status,
                        placeEntity.address,
                        officeEntity.cnt,   // 첫 번째 cnt
                        officeEntity.cnt,   // 두 번째 cnt (DTO 생성자 파라미터 확인 필요)
                        imgOfficeEntity.currentUrl
                )
                .from(officeEntity)
                .join(placeEntity).on(officeEntity.placeEntity.eq(placeEntity))
                .leftJoin(imgOfficeEntity).on(imgOfficeEntity.officeEntity.no.eq(officeId).and(imgOfficeEntity.sort.eq(1)))
                .join(hostPlaceEntity).on(hostPlaceEntity.officeEntity.no.eq(officeEntity.no))
                .join(hostPlaceEntity.hostEntity, hostEntity)
                .where(
                        officeEntity.no.eq(officeId),
                        hostEntity.memberNo.eq(memberNo),
                        hostPlaceEntity.no.in(latestHostPlaceIdSubQuery)
                )
                .fetchOne();
    }

    private StationDetailRespDto.SummaryCard fetchSummaryCard(Long officeId) {
        YearMonth currentMonth = YearMonth.now();
        Tuple bookingStats = queryFactory
                .select(rsvnEntity.no.count(), rsvnEntity.amt.sum().coalesce(0))
                .from(rsvnEntity)
                .where(
                        rsvnEntity.officeNo.no.eq(officeId),
                        rsvnEntity.createdAt.between(currentMonth.atDay(1).atStartOfDay(), currentMonth.atEndOfMonth().atTime(23, 59, 59)),
                        rsvnEntity.status.in(RsvnStatus.S, RsvnStatus.E)
                )
                .fetchOne();

        Tuple reviewStats = queryFactory
                .select(reviewEntity.no.count(), reviewEntity.scoreTotal.avg().coalesce(0.0))
                .from(reviewEntity)
                .where(reviewEntity.rsvnNo.officeNo.no.eq(officeId))
                .fetchOne();

        // [해결] Number 타입으로 받은 뒤 안전하게 변환
        Number bookingsVal = bookingStats != null ? bookingStats.get(0, Number.class) : 0;
        Number revenueVal = bookingStats != null ? bookingStats.get(1, Number.class) : 0L;
        Number reviewsVal = reviewStats != null ? reviewStats.get(0, Number.class) : 0;
        Double scoreVal = reviewStats != null ? reviewStats.get(1, Double.class) : 0.0;

        return StationDetailRespDto.SummaryCard.builder()
                .monthlyBookings(bookingsVal.intValue())
                .monthlyRevenue(revenueVal.longValue())
                .totalReviews(reviewsVal.intValue())
                .averageRating(Math.round(scoreVal * 10) / 10.0)
                .build();
    }

    private List<String> fetchFacilities(Long officeId) {
        return queryFactory
                .select(officeAmenityEntity.amenityEntity.name)
                .from(officeAmenityEntity)
                .where(officeAmenityEntity.officeEntity.no.eq(officeId))
                .fetch();
    }

    private List<StationDetailRespDto.RecentBooking> fetchRecentBookings(Long officeId) {
        return queryFactory
                .select(Projections.constructor(StationDetailRespDto.RecentBooking.class,
                        rsvnEntity.no,                      // 1. Long (bookingId)
                        memberEntity.imgUrl,                // 2. String (userImageUrl)
                        memberEntity.name,                  // 3. String (userName)
                        rsvnEntity.no,                      // 4. Long (bookingCode) - String이 아닌 Long으로 매핑
                        Expressions.asString("00:00~23:59"), // 5. String (bookingPeriod)
                        rsvnEntity.amt.coalesce(0).intValue() // 6. Integer (totalPrice)
                ))
                .from(rsvnEntity)
                .join(memberEntity).on(rsvnEntity.memberNo.eq(memberEntity))
                .where(rsvnEntity.officeNo.no.eq(officeId))
                .orderBy(rsvnEntity.createdAt.desc())
                .limit(3)
                .fetch();
    }

    private StationDetailRespDto.BasicInfo buildBasicInfo(Tuple tuple, Long officeId) {
        Integer minPrice = queryFactory
                .select(officePeriodEntity.price.min())
                .from(officePeriodEntity)
                .where(officePeriodEntity.officeEntity.no.eq(officeId))
                .fetchOne();

        Integer weekendMinPrice = queryFactory
                .select(officePeriodEntity.price.min())
                .from(officePeriodEntity)
                .where(
                        officePeriodEntity.officeEntity.no.eq(officeId),
                        officePeriodEntity.dayOfWeek.in("sat", "sun", "hol")
                )
                .fetchOne();

        Integer capacity = tuple.get(officeEntity.cnt);

        return StationDetailRespDto.BasicInfo.builder()
                .name(tuple.get(officeEntity.title))
                .type("오피스")
                .address(tuple.get(placeEntity.address))
                .capacity(capacity)
                .baseCapacity(capacity)
                .basePrice(minPrice != null ? minPrice.longValue() : 0L)
                .weekendPrice(weekendMinPrice != null ? weekendMinPrice.longValue() : 0L)
                .checkInTime("00:00")
                .checkOutTime("24:00")
                .build();
    }

    private StationDetailRespDto.HeaderInfo buildHeaderInfo(Tuple tuple, StationDetailRespDto.SummaryCard summary) {
        return StationDetailRespDto.HeaderInfo.builder()
                .imageUrl(tuple.get(imgOfficeEntity.currentUrl))
                .type("오피스")
                .status("운영중")
                .title(tuple.get(placeEntity.title))
                .location(tuple.get(placeEntity.address))
                .rating(summary.getAverageRating())
                .reviewCount(summary.getTotalReviews())
                .build();
    }

    @Override
    public OfficeUpdateDetailReqDto selectOfficeForUpdate(Long no, Long memberNo) {
        // 1. 메인 정보 조회 (OfficeEntity 중심)
        OfficeUpdateDetailReqDto mainInfoDto = fetchOfficeMainUpdateInfo(no, memberNo);

        if (mainInfoDto == null) {
            throw new IllegalArgumentException("해당 오피스 정보를 찾을 수 없거나 권한이 없습니다. id=" + no);
        }

        // 2. 편의시설 리스트 조회
        List<OfficeUpdateDetailReqDto.AmenityDto> facilityList = fetchOfficeAmenities(no);

        // 3. 요일별/시간별 요금 정보 조회 (OfficePeriodDto)
        List<OfficeUpdateDetailReqDto.OfficePeriodDto> officePeriods = fetchOfficePeriods(no);

        // 4. 예외 기간 요금 조회 (필요 시 구현)
        List<OfficeUpdateDetailReqDto.OfficeExceptionPeriodDto> exceptionPeriods = fetchOfficeExceptionPeriods(no);

        // 5. 조립하여 반환
        return OfficeUpdateDetailReqDto.builder()
                .placeNo(mainInfoDto.getPlaceNo())
                .placeTitle(mainInfoDto.getPlaceTitle())
                .title(mainInfoDto.getTitle())
                .content(mainInfoDto.getContent())
                .basePeople(mainInfoDto.getBasePeople())
                .facilityList(facilityList)
                .officePeriods(officePeriods)
                .exceptionPeriods(exceptionPeriods)
                .build();
    }

    private OfficeUpdateDetailReqDto fetchOfficeMainUpdateInfo(Long officeId, Long memberNo) {
        var latestHostPlaceIdSubQuery = JPAExpressions
                .select(hostPlaceEntity.no.max())
                .from(hostPlaceEntity)
                .where(hostPlaceEntity.officeEntity.no.eq(officeId));

        // 2. 쿼리 실행
        return queryFactory
                .select(Projections.fields(OfficeUpdateDetailReqDto.class,
                        placeEntity.no.as("placeNo"),
                        placeEntity.title.as("placeTitle"),
                        officeEntity.title,
                        officeEntity.content,
                        officeEntity.cnt.as("basePeople")
                ))
                .from(officeEntity)
                .join(placeEntity).on(officeEntity.placeEntity.eq(placeEntity))
                .join(hostPlaceEntity).on(
                        hostPlaceEntity.officeEntity.eq(officeEntity)
                                .and(hostPlaceEntity.no.in(latestHostPlaceIdSubQuery))
                )
                .where(
                        officeEntity.no.eq(officeId),
                        hostPlaceEntity.hostEntity.memberNo.eq(memberNo)
                )
                .fetchOne();
    }

    private List<OfficeUpdateDetailReqDto.AmenityDto> fetchOfficeAmenities(Long officeId) {
        return queryFactory
                .select(Projections.fields(OfficeUpdateDetailReqDto.AmenityDto.class,
                        officeAmenityEntity.amenityEntity.no.as("amenityNo")
                ))
                .from(officeAmenityEntity)
                .where(officeAmenityEntity.officeEntity.no.eq(officeId))
                .fetch();
    }

    private List<OfficeUpdateDetailReqDto.OfficePeriodDto> fetchOfficePeriods(Long officeId) {
        return queryFactory
                .select(Projections.fields(OfficeUpdateDetailReqDto.OfficePeriodDto.class,
                        officePeriodEntity.startTime,
                        officePeriodEntity.price,
                        officePeriodEntity.dayOfWeek
                ))
                .from(officePeriodEntity)
                .where(
                        officePeriodEntity.officeEntity.no.eq(officeId),
                        officePeriodEntity.exceptionStartDate.isNull(),
                        officePeriodEntity.exceptionEndDate.isNull()
                )
                .fetch();
    }

    private List<OfficeUpdateDetailReqDto.OfficeExceptionPeriodDto> fetchOfficeExceptionPeriods(Long officeId) {
        return queryFactory
                .select(Projections.fields(OfficeUpdateDetailReqDto.OfficeExceptionPeriodDto.class,
                        officePeriodEntity.startTime,
                        officePeriodEntity.price,
                        officePeriodEntity.dayOfWeek,
                        officePeriodEntity.exceptionStartDate,
                        officePeriodEntity.exceptionEndDate
                ))
                .from(officePeriodEntity)
                .where(
                        officePeriodEntity.officeEntity.no.eq(officeId),
                        officePeriodEntity.exceptionStartDate.isNotNull(),
                        officePeriodEntity.exceptionEndDate.isNotNull()
                )
                .fetch();
    }

}
