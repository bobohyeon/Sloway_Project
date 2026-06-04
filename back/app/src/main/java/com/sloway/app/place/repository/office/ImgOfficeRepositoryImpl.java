package com.sloway.app.place.repository.office;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.place.dto.response.place.PlaceImgListRespDto;
import com.sloway.app.place.entity.office.ImgOfficeEntity;
import lombok.RequiredArgsConstructor;

import static com.sloway.app.place.entity.office.QImgOfficeEntity.imgOfficeEntity;

import java.util.List;

@RequiredArgsConstructor
public class ImgOfficeRepositoryImpl implements ImgOfficeRepositoryCustom{

    private final JPAQueryFactory queryFactory;

    @Override
    public void deleteByOfficeEntityNoAndNoNotIn(Long no, List<Long> aliveImageNos) {
        queryFactory
            .delete(imgOfficeEntity)
            .where(
                    imgOfficeEntity.officeEntity.no.eq(no),
                    imgOfficeEntity.no.notIn(aliveImageNos)
            )
            .execute();
    }

    @Override
    public List<ImgOfficeEntity> findByOfficeEntityNoAndNoNotIn(Long no, List<Long> aliveImageNos) {
        return queryFactory
            .selectFrom(imgOfficeEntity)
            .where(
                    imgOfficeEntity.officeEntity.no.eq(no),
                    // 리스트가 비어있으면 삭제할 대상이 없으므로 조회하지 않음
                    aliveImageNos.isEmpty() ? null : imgOfficeEntity.no.notIn(aliveImageNos)
            )
            .fetch();
    }

    @Override
    public List<PlaceImgListRespDto.ImageInfo> getImageList(Long no) {
        return queryFactory
            .select(Projections.constructor(PlaceImgListRespDto.ImageInfo.class,
                    imgOfficeEntity.no,
                    imgOfficeEntity.currentUrl.as("preview"),
                    imgOfficeEntity.sort
            ))
            .from(imgOfficeEntity)
            .where(imgOfficeEntity.officeEntity.no.eq(no))
            .orderBy(imgOfficeEntity.sort.desc())
            .fetch();

    }
}
