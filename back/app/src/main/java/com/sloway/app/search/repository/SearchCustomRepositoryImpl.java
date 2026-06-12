package com.sloway.app.search.repository;

import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.NumberTemplate;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.place.entity.amenity.AmenityEntity;
import com.sloway.app.place.entity.amenity.office.QOfficeAmenityEntity;
import com.sloway.app.place.entity.amenity.station.QStationAmenityEntity;
import com.sloway.app.place.entity.amenity.workStay.QWorkAmenityEntity;
import com.sloway.app.place.entity.amenity.workStay.workOffice.QWorkOfficeAmenityEntity;
import com.sloway.app.place.entity.office.QOfficeEntity;
import com.sloway.app.place.entity.office.QOfficePeriodEntity;
import com.sloway.app.place.entity.place.QImgPlaceEntity;
import com.sloway.app.place.entity.place.QPlaceEntity;
import com.sloway.app.place.entity.station.QStationEntity;
import com.sloway.app.place.entity.workStay.QWorkStayEntity;
import com.sloway.app.place.entity.workStay.workOffice.QWorkOfficeEntity;
import com.sloway.app.reservation.rsvn.entity.QRsvnEntity;
import com.sloway.app.reservation.rsvn.entity.RsvnStatus;
import com.sloway.app.review.review.entity.QReviewEntity;
import com.sloway.app.search.dto.RegionType;
import com.sloway.app.search.dto.SortType;
import com.sloway.app.search.dto.request.SearchReqDto;
import com.sloway.app.search.dto.response.SearchResDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.core.types.dsl.Expressions;


import java.time.LocalDate;
import java.util.List;

@RequiredArgsConstructor
@Repository
public class SearchCustomRepositoryImpl implements SearchCustomRepository{

    private final JPAQueryFactory queryFactory;
    private static final QPlaceEntity p = QPlaceEntity.placeEntity;
    private static final QImgPlaceEntity i = QImgPlaceEntity.imgPlaceEntity;
    private static final QImgPlaceEntity i2 = new QImgPlaceEntity("imgPlace2");
    private static final QRsvnEntity rsvn = QRsvnEntity.rsvnEntity;
    private static final QRsvnEntity rsvnSub = new QRsvnEntity("rsvnSub");
    private static final QReviewEntity rv = QReviewEntity.reviewEntity;
    private static final QOfficeEntity o = QOfficeEntity.officeEntity;
    private static final QWorkStayEntity ws = QWorkStayEntity.workStayEntity;
    private static final QStationEntity st = QStationEntity.stationEntity;

    private static final QOfficePeriodEntity op = QOfficePeriodEntity.officePeriodEntity;
    private static final QOfficeAmenityEntity oa = QOfficeAmenityEntity.officeAmenityEntity;
    private static final QWorkAmenityEntity wa = QWorkAmenityEntity.workAmenityEntity;
    private static final QWorkOfficeAmenityEntity woa = QWorkOfficeAmenityEntity.workOfficeAmenityEntity;
    private static final QWorkOfficeEntity wo = QWorkOfficeEntity.workOfficeEntity;
    private static final QStationAmenityEntity sa = QStationAmenityEntity.stationAmenityEntity;


    @Override
    public List<SearchResDto> search(SearchReqDto dto) {
        return queryFactory
                .select(Projections.constructor(SearchResDto.class,
                        Expressions.numberTemplate(Long.class, "COALESCE({0},{1},{2})",
                            JPAExpressions.select(o.no).from(o).where(o.placeEntity.eq(p)),
                            JPAExpressions.select(ws.no).from(ws).where(ws.placeEntity.eq(p)),
                            JPAExpressions.select(st.no).from(st).where(st.placeEntity.eq(p))
                        ),
                        p.no,
                        p.title,
                        p.type,
                        p.address,
                        p.latitude,
                        p.longitude,
                        //썸네일
                        thumbnailExpr(),
                        //평균평점
                        avgExpr(),
                        //리뷰갯수
                        reviewCountExpr(),
                        //요금최솟값
                        basePriceExpr(),
                        // remainCount — 날짜 선택 시 구현 예정
                        dto.getCheckIn() != null ?
                                remainCountExpr(dto.getCheckIn(), dto.getCheckOut()) :
                                Expressions.nullExpression(Integer.class),
                        // available
                        dto.getCheckIn() != null ?
                                remainCountExpr(dto.getCheckIn(), dto.getCheckOut()).gt(0) :
                                Expressions.nullExpression(Boolean.class)
                        )
                )
                .from(p)
                .where(typeEq(dto.getPlaceType()), regionContains(dto.getRegion()), amenitiesFilter(dto.getAmenities()))

                .orderBy(sortOrder((dto.getSort())))
                .fetch()
                ;
    }
    // 공간타입 필터
    private BooleanExpression typeEq(String type){
        return type == null ? null : p.type.eq(type);
    }

    //지역 필터
    private BooleanExpression regionContains(RegionType region){
        return region == null ? null : p.address.contains(region.getCode());
    }

    // 썸네일 — no 오름차순 첫 번째 이미지 URL (JPQL 서브쿼리에서 LIMIT 미지원으로 중첩 서브쿼리 방식 사용)
    private JPQLQuery<String> thumbnailExpr(){
        return JPAExpressions
                .select(i.currentUrl)
                .from(i)
                .where(i.placeEntity.eq(p),
                       i.no.eq(
                           JPAExpressions.select(i2.no.min())
                               .from(i2)
                               .where(i2.placeEntity.eq(p))
                       ));
    }

    //요금최솟값
    private NumberTemplate<Integer> basePriceExpr(){
        NumberTemplate<Integer> numberTemp = Expressions.numberTemplate(Integer.class,
                "COALESCE({0},{1},{2})",
                JPAExpressions.select(op.price.min())
                        .from(op)
                        .join(op.officeEntity, o)
                        .where(o.placeEntity.eq(p))
                ,
                JPAExpressions.select(
                                Expressions.numberTemplate(Integer.class,
                                        "LEAST({0},{1},{2},{3},{4},{5},{6},{7})",
                                        ws.monPrice,ws.tuePrice,ws.wedPrice,ws.thuPrice,
                                        ws.friPrice,ws.satPrice,ws.sunPrice,ws.holPrice
                                ))
                        .from(ws)
                        .where(ws.placeEntity.eq(p))
                        .limit(1)
                ,
                JPAExpressions.select(
                                Expressions.numberTemplate(Integer.class,
                                        "LEAST({0},{1},{2},{3},{4},{5},{6},{7})",
                                        st.monPrice,st.tuePrice,st.wedPrice,st.thuPrice,
                                        st.friPrice,st.satPrice,st.sunPrice,st.holPrice
                                ))
                        .from(st)
                        .where(st.placeEntity.eq(p))
                        .limit(1)
        );
        return numberTemp;
    }

    //리뷰갯수
    private JPQLQuery<Long> reviewCountExpr(){
        return JPAExpressions
                .select(rv.no.count())
                .from(rv)
                .join(rv.rsvnNo, rsvn)
                .leftJoin(rsvn.officeNo, o)
                .leftJoin(rsvn.workStayNo, ws)
                .leftJoin(rsvn.stationNo, st)
                .where(
                        o.placeEntity.eq(p)
                                .or(ws.placeEntity.eq(p))
                                .or(st.placeEntity.eq(p)),
                        rv.delYn.eq("N")
                );
    }

    //평균평점
    private JPQLQuery<Double> avgExpr(){
        JPQLQuery<Double> avg = JPAExpressions
                .select(rv.scoreTotal.avg())
                .from(rv)
                .join(rv.rsvnNo, rsvn)
                .leftJoin(rsvn.officeNo, o)
                .leftJoin(rsvn.workStayNo, ws)
                .leftJoin(rsvn.stationNo, st)
                .where(
                        o.placeEntity.eq(p)
                                .or(ws.placeEntity.eq(p))
                                .or(st.placeEntity.eq(p))
                        ,rv.delYn.eq("N")
                );
        return avg;
    }

    //잔여 객실/좌석 수
    private NumberTemplate<Integer> remainCountExpr(LocalDate checkIn, LocalDate checkOut){
        NumberTemplate<Integer> remainCount =
                Expressions.numberTemplate(Integer.class,
                "COALESCE({0},{1},{2})",
                JPAExpressions
                        .select(o.cnt.subtract(
                                JPAExpressions
                                        .select(rsvnSub.no.count().intValue())
                                        .from(rsvnSub)
                                        .where(
                                                rsvnSub.officeNo.eq(o),
                                                rsvnSub.status.eq(RsvnStatus.S),
                                                // 예약종료 < 검색시작일(체크인) , 어차피 하루에 한팀이니까 시간 신경x 날짜만 신경
                                                rsvnSub.checkIn.lt(checkOut.plusDays(1).atStartOfDay()),
                                                // 예약시작 > 검색종료일(체크아웃)
                                                rsvnSub.checkOut.gt(checkIn.atStartOfDay())
                                        )
                        ))
                        .from(o)
                        .where(o.placeEntity.eq(p))
                        ,
                JPAExpressions
                        .select(ws.rooms.subtract(
                                JPAExpressions
                                        .select(rsvnSub.no.count().intValue())
                                        .from(rsvnSub)
                                        .where(
                                                rsvnSub.workStayNo.eq(ws),
                                                rsvnSub.status.eq(RsvnStatus.S),
                                                rsvnSub.checkIn.lt(checkOut.plusDays(1).atStartOfDay()),
                                                rsvnSub.checkOut.gt(checkIn.atStartOfDay())
                                        )
                        ))
                        .from(ws)
                        .where(ws.placeEntity.eq(p))
                        ,
                JPAExpressions
                        .select(st.rooms.subtract(
                                JPAExpressions
                                        .select(rsvnSub.no.count().intValue())
                                        .from(rsvnSub)
                                        .where(
                                                rsvnSub.stationNo.eq(st),
                                                rsvnSub.status.eq(RsvnStatus.S),
                                                rsvnSub.checkIn.lt(checkOut.plusDays(1).atStartOfDay()),
                                                rsvnSub.checkOut.gt(checkIn.atStartOfDay())
                                        )
                        ))
                        .from(st)
                        .where(st.placeEntity.eq(p))
                );
                return remainCount;
    }

    //편의시설
    private BooleanExpression amenitiesFilter(List<Long> amenities){
        if(amenities == null || amenities.isEmpty()){return null;}
        BooleanExpression office = Expressions.asNumber(
                        JPAExpressions
                                .select(oa.no.count())
                                .from(oa)
                                .join(oa.officeEntity, o)
                                .where(
                                        o.placeEntity.eq(p),
                                        oa.amenityEntity.no.in(amenities))
                                )
                        .goe((long) amenities.size()
                        );
        BooleanExpression workStay = Expressions.asNumber(
                        JPAExpressions
                                .select(wa.no.count())
                                .from(wa)
                                .join(wa.workStayEntity, ws)
                                .where(
                                        ws.placeEntity.eq(p),
                                        wa.amenityEntity.no.in(amenities))
                                )
                .goe((long) amenities.size()
                );
        BooleanExpression workOffice = Expressions.asNumber(
                        JPAExpressions
                                .select(woa.no.count())
                                .from(woa)
                                .join(woa.workOfficeEntity, wo)
                                .join(wo.workStayEntity, ws)
                                .where(
                                        ws.placeEntity.eq(p),
                                        woa.amenityEntity.no.in(amenities))
                )
                .goe((long) amenities.size()
                );
        BooleanExpression station = Expressions.asNumber(
                        JPAExpressions
                                .select(sa.no.count())
                                .from(sa)
                                .join(sa.stationEntity, st)
                                .where(
                                        st.placeEntity.eq(p),
                                        sa.amenityEntity.no.in(amenities))
                )
                .goe((long) amenities.size()
                );

           return office.or(workStay).or(workOffice).or(station);
    }


    //정렬
    private OrderSpecifier<?> sortOrder(SortType sort){
        if(sort == null){ return p.viewCnt.desc();}
        return switch (sort){
            case POPULAR -> p.viewCnt.desc();
            case PRICE_ASC -> basePriceExpr().asc();
            case PRICE_DESC -> basePriceExpr().desc();
            case SCORE -> new OrderSpecifier<>(Order.DESC, avgExpr(), OrderSpecifier.NullHandling.NullsLast);
        };
    }
}
