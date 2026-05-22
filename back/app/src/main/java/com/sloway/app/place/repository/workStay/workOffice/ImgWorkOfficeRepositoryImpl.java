package com.sloway.app.place.repository.workStay.workOffice;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import static com.sloway.app.place.entity.workStay.workOffice.QImgWorkStayOfficeEntity.imgWorkStayOfficeEntity;

import java.util.List;

@RequiredArgsConstructor
public class ImgWorkOfficeRepositoryImpl implements ImgWorkOfficeRepositoryCustom{

    private final JPAQueryFactory queryFactory;

    @Override
    public void deleteByWorkOfficeEntityNoAndNoNotIn(Long no, List<Long> aliveOfficeImageNos) {
        queryFactory
                .delete(imgWorkStayOfficeEntity)
                .where(
                        imgWorkStayOfficeEntity.workOfficeEntity.no.eq(no),
                        imgWorkStayOfficeEntity.no.notIn(aliveOfficeImageNos)
                )
                .execute();
    }
}
