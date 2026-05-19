package com.sloway.app.search.repository;

import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.place.entity.place.PlaceEntity;
import com.sloway.app.place.entity.place.QImgPlaceEntity;
import com.sloway.app.place.entity.place.QPlaceEntity;
import com.sloway.app.search.dto.RegionType;
import com.sloway.app.search.dto.SortType;
import com.sloway.app.search.dto.request.SearchReqDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@RequiredArgsConstructor
@Repository
public class SearchCustomRepositoryImpl implements SearchCustomRepository{

    private final JPAQueryFactory queryFactory;
    private static final QPlaceEntity p = QPlaceEntity.placeEntity;
    private static final QImgPlaceEntity i = QImgPlaceEntity.imgPlaceEntity;


    @Override
    public List<PlaceEntity> search(SearchReqDto dto) {
        return queryFactory
                .selectFrom(p)
                .distinct()
                .leftJoin(p.images , i).fetchJoin()
                .where(
                        typeEq(dto.getPlaceType()),
                        regionContains(dto.getRegion())
                )
                .orderBy(sortOrder(dto.getSort()))
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
            case PRICE_DESC -> p.viewCnt.asc();
            case SCORE -> p.viewCnt.desc();
        };
    }
}
