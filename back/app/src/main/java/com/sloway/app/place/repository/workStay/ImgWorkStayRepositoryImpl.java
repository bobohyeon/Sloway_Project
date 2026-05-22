package com.sloway.app.place.repository.workStay;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import static com.sloway.app.place.entity.workStay.QImgWorkStayEntity.imgWorkStayEntity;

import java.util.List;

@RequiredArgsConstructor
public class ImgWorkStayRepositoryImpl implements ImgWorkStayRepositoryCustom {

    private final JPAQueryFactory queryFactory;


    @Override
    public void deleteByWorkStayEntityNoAndNoNotIn(Long no, List<Long> aliveStayImageNos) {
        queryFactory
                .delete(imgWorkStayEntity)
                .where(
                        imgWorkStayEntity.workStayEntity.no.eq(no),
                        imgWorkStayEntity.no.notIn(aliveStayImageNos)
                )
                .execute();
    }
}

