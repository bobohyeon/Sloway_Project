package com.sloway.app.place.repository.workStay;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.place.entity.workStay.ImgWorkStayEntity;
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

    @Override
    public List<ImgWorkStayEntity> findByWorkStayEntityNoAndNoNotIn(Long no, List<Long> aliveStayImageNos) {
        return queryFactory
                .selectFrom(imgWorkStayEntity)
                .where(
                        imgWorkStayEntity.workStayEntity.no.eq(no),
                        // 리스트가 비어있으면 삭제할 대상이 없으므로 조회하지 않음
                        aliveStayImageNos.isEmpty() ? null : imgWorkStayEntity.no.notIn(aliveStayImageNos)
                )
                .fetch();
    }
}

