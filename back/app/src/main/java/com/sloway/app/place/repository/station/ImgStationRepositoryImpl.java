package com.sloway.app.place.repository.station;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.place.dto.response.place.PlaceImgListRespDto;
import com.sloway.app.place.entity.station.ImgStationEntity;
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

    @Override
    public List<ImgStationEntity> findByStationEntityNoAndNoNotIn(Long no, List<Long> aliveImageNos) {
        return queryFactory
                .selectFrom(imgStationEntity)
                .where(
                        imgStationEntity.stationEntity.no.eq(no),
                        // 리스트가 비어있으면 삭제할 대상이 없으므로 조회하지 않음
                        aliveImageNos.isEmpty() ? null : imgStationEntity.no.notIn(aliveImageNos)
                )
                .fetch();
    }

    @Override
    public List<PlaceImgListRespDto.ImageInfo> getImageList(Long no) {
        return queryFactory
                .select(Projections.constructor(PlaceImgListRespDto.ImageInfo.class,
                        imgStationEntity.no,
                        imgStationEntity.currentUrl.as("preview"),
                        imgStationEntity.sort
                ))
                .from(imgStationEntity)
                .where(imgStationEntity.stationEntity.no.eq(no))
                .orderBy(imgStationEntity.sort.asc())
                .fetch();
    }
}
