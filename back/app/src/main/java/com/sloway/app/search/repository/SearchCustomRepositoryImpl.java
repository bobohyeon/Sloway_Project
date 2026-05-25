package com.sloway.app.search.repository;

import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.place.entity.office.QOfficeEntity;
import com.sloway.app.place.entity.office.QOfficePeriodEntity;
import com.sloway.app.place.entity.place.QImgPlaceEntity;
import com.sloway.app.place.entity.place.QPlaceEntity;
import com.sloway.app.place.entity.station.QStationEntity;
import com.sloway.app.place.entity.workStay.QWorkStayEntity;
import com.sloway.app.reservation.rsvn.entity.QRsvnEntity;
import com.sloway.app.review.review.entity.QReviewEntity;
import com.sloway.app.search.dto.RegionType;
import com.sloway.app.search.dto.SortType;
import com.sloway.app.search.dto.request.SearchReqDto;
import com.sloway.app.search.dto.response.SearchResDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.core.types.dsl.Expressions;


import java.util.List;

@RequiredArgsConstructor
@Repository
public class SearchCustomRepositoryImpl implements SearchCustomRepository{

    private final JPAQueryFactory queryFactory;
    private static final QPlaceEntity p = QPlaceEntity.placeEntity;
    private static final QImgPlaceEntity i = QImgPlaceEntity.imgPlaceEntity;
    private static final QRsvnEntity rsvn = QRsvnEntity.rsvnEntity;
    private static final QReviewEntity rv = QReviewEntity.reviewEntity;
    private static final QOfficeEntity o = QOfficeEntity.officeEntity;
    private static final QWorkStayEntity ws = QWorkStayEntity.workStayEntity;
    private static final QStationEntity st = QStationEntity.stationEntity;
    private static final QOfficePeriodEntity op = QOfficePeriodEntity.officePeriodEntity;


    @Override
    public List<SearchResDto> search(SearchReqDto dto) {
        return queryFactory
                .select(Projections.constructor(SearchResDto.class,
                        p.no,
                        p.title,
                        p.type,
                        p.address,
                        JPAExpressions
                                .select(i.currentUrl)
                                .from(i)
                                .where(i.placeEntity.eq(p), i.sort.eq((0)))
                                .limit(1),
                        JPAExpressions
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
                                ),
                        Expressions.numberTemplate(Integer.class,
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
                        )
                        ,
                        // remainCount — 날짜 선택 시 구현 예정
                        Expressions.nullExpression(Integer.class),
                        // available
                        Expressions.nullExpression(Boolean.class)
                ))
                .from(p)
                .where(typeEq(dto.getPlaceType()), regionContains(dto.getRegion()))
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

    //정렬
    private OrderSpecifier<?> sortOrder(SortType sort){
        if(sort == null){ return p.viewCnt.desc();}
        return switch (sort){
            case POPULAR -> p.viewCnt.desc();
            case PRICE_ASC -> p.viewCnt.desc();
            case PRICE_DESC -> p.viewCnt.desc();
            case SCORE -> p.viewCnt.desc();
        };
    }
}
