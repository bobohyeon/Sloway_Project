package com.sloway.app.place.repository.office;

import com.querydsl.jpa.impl.JPAQueryFactory;
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
}
