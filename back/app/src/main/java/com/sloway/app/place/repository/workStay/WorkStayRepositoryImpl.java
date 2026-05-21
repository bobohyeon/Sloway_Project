package com.sloway.app.place.repository.workStay;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.place.dto.response.workStay.WorkStayImageListRespDto;
import lombok.RequiredArgsConstructor;

import java.util.List;
import static com.sloway.app.place.entity.workStay.QImgWorkStayEntity.imgWorkStayEntity;
import static com.sloway.app.place.entity.workStay.workOffice.QWorkOfficeEntity.workOfficeEntity;
import static com.sloway.app.place.entity.workStay.workOffice.QImgWorkStayOfficeEntity.imgWorkStayOfficeEntity;
import static com.sloway.app.place.entity.hostPlace.QHostPlaceEntity.hostPlaceEntity;
import static com.sloway.app.host.entity.QHostEntity.hostEntity;

@RequiredArgsConstructor
public class WorkStayRepositoryImpl implements WorkStayRepositoryCustom{

    private final JPAQueryFactory queryFactory;

    @Override
    public WorkStayImageListRespDto selectImageList(Long no, Long memberNo) {
        List<WorkStayImageListRespDto.ImageInfo> stayList = queryFactory
                .select(Projections.constructor(WorkStayImageListRespDto.ImageInfo.class,
                        imgWorkStayEntity.no,
                        imgWorkStayEntity.currentUrl,
                        imgWorkStayEntity.sort
                ))
                .from(imgWorkStayEntity)
                .join(hostPlaceEntity).on(imgWorkStayEntity.workStayEntity.no.eq(hostPlaceEntity.workStayEntity.no))
                .join(hostEntity).on(hostPlaceEntity.hostEntity.no.eq(hostEntity.no))
                .where(
                        imgWorkStayEntity.workStayEntity.no.eq(no),
                        hostEntity.memberNo.eq(memberNo)
                )
                .orderBy(imgWorkStayEntity.sort.asc())
                .fetch();

        // 워크앤스테이 내 오피스 이미지 리스트 조회
        List<WorkStayImageListRespDto.ImageInfo> officeList = queryFactory
                .select(Projections.constructor(WorkStayImageListRespDto.ImageInfo.class,
                        imgWorkStayOfficeEntity.no,
                        imgWorkStayOfficeEntity.currentUrl,
                        imgWorkStayOfficeEntity.sort
                ))
                .from(imgWorkStayOfficeEntity)
                .join(imgWorkStayOfficeEntity.workOfficeEntity, workOfficeEntity)
                .join(hostPlaceEntity).on(workOfficeEntity.workStayEntity.no.eq(hostPlaceEntity.workStayEntity.no))
                .join(hostEntity).on(hostPlaceEntity.hostEntity.no.eq(hostEntity.no))
                .where(
                        workOfficeEntity.workStayEntity.no.eq(no),
                        hostEntity.memberNo.eq(memberNo)
                )
                .orderBy(imgWorkStayOfficeEntity.sort.asc())
                .fetch();

        return WorkStayImageListRespDto.builder()
                .workStayImages(stayList != null ? stayList : List.of())
                .officeImages(officeList != null ? officeList : List.of())
                .build();
    }
}
