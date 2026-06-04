package com.sloway.app.place.repository.place;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.place.dto.response.place.PlaceImgListRespDto;
import com.sloway.app.place.entity.place.ImgPlaceEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.expression.spel.ast.Projection;

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

    @Override
    public List<ImgPlaceEntity> findByPlaceEntityNoAndNoNotIn(Long no, List<Long> aliveImageNos) {
        return queryFactory
                .selectFrom(imgPlaceEntity)
                .where(
                        imgPlaceEntity.placeEntity.no.eq(no),
                        // imageNos가 비어있지 않을 때만 notIn 조건 추가
                        aliveImageNos.isEmpty() ? null : imgPlaceEntity.no.notIn(aliveImageNos)
                )
                .fetch();
    }

    @Override
    public List<PlaceImgListRespDto.ImageInfo> getImageList(Long no) {

        return queryFactory
                .select(Projections.constructor(PlaceImgListRespDto.ImageInfo.class,
                        imgPlaceEntity.no,
                        imgPlaceEntity.currentUrl.as("preview"),
                        imgPlaceEntity.sort
                ))
                .from(imgPlaceEntity)
                .where(imgPlaceEntity.placeEntity.no.eq(no))
                .orderBy(imgPlaceEntity.sort.desc())
                .fetch();
    }
}
