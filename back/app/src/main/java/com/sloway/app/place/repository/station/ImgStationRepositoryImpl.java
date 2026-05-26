package com.sloway.app.place.repository.station;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import static com.sloway.app.place.entity.station.QImgStationEntity.imgStationEntity;

import java.util.List;

@RequiredArgsConstructor
public class ImgStationRepositoryImpl implements ImgStationRepositoryCustom{

    private final JPAQueryFactory queryFactory;

    @Override
    public void deleteByStationEntityNoAndNoNotIn(Long no, List<Long> aliveImageNos) {
        queryFactory
                .delete(imgStationEntity)
                .where(
                        imgStationEntity.stationEntity.no.eq(no),
                        imgStationEntity.no.notIn(aliveImageNos)
                )
                .execute();
    }
}
