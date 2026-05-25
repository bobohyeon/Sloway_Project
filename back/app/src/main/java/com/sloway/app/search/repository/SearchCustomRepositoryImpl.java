package com.sloway.app.search.repository;

import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.place.entity.place.QImgPlaceEntity;
import com.sloway.app.place.entity.place.QPlaceEntity;
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
                        // avgScore — 나중에 교체
                        Expressions.nullExpression(Double.class),
                        // basePrice — 나중에 교체
                        Expressions.nullExpression(Integer.class),
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
