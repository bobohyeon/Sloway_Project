package com.sloway.app.place.repository.place;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import static com.sloway.app.place.entity.place.QImgPlaceEntity.imgPlaceEntity;

import java.util.List;

@RequiredArgsConstructor
public class ImgPlaceRepositoryImpl implements ImgPlaceRepositoryCustom{

    private final JPAQueryFactory queryFactory;


    @Override
    public void deleteByPlaceEntityNoAndNoNotIn(Long no, List<Long> aliveImageNos) {
        queryFactory
                .delete(imgPlaceEntity)
                .where(
                        imgPlaceEntity.placeEntity.no.eq(no),
                        imgPlaceEntity.no.notIn(aliveImageNos)
                )
                .execute();
    }
}
