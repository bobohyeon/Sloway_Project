package com.sloway.app.place.repository.workStay.workOffice;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.place.entity.workStay.workOffice.ImgWorkStayOfficeEntity;
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

    @Override
    public List<ImgWorkStayOfficeEntity> findByWorkOfficeEntityNoAndNoNotIn(Long no, List<Long> aliveOfficeImageNos) {
        return queryFactory
                .selectFrom(imgWorkStayOfficeEntity)
                .where(
                        imgWorkStayOfficeEntity.workOfficeEntity.no.eq(no),
                        // 리스트가 비어있으면 삭제할 대상이 없으므로 조회하지 않음
                        aliveOfficeImageNos.isEmpty() ? null : imgWorkStayOfficeEntity.no.notIn(aliveOfficeImageNos)
                )
                .fetch();
    }
}
