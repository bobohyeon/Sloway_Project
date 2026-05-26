package com.sloway.app.place.repository.office;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.place.dto.response.place.PlaceImgListRespDto;
import lombok.RequiredArgsConstructor;

import java.util.List;

import static com.sloway.app.place.entity.office.QImgOfficeEntity.imgOfficeEntity;
import static com.sloway.app.place.entity.hostPlace.QHostPlaceEntity.hostPlaceEntity;
import static com.sloway.app.host.entity.QHostEntity.hostEntity;

@RequiredArgsConstructor
public class OfficeRepositoryImpl implements OfficeRepositoryCustom{

    private final JPAQueryFactory queryFactory;

    @Override
    public PlaceImgListRespDto selectImageList(Long no, Long memberNo) {
        List<PlaceImgListRespDto.ImageInfo> officeList = queryFactory
                .select(Projections.constructor(PlaceImgListRespDto.ImageInfo.class,
                        imgOfficeEntity.no,
                        imgOfficeEntity.currentUrl,
                        imgOfficeEntity.sort
                ))
                .from(imgOfficeEntity)
                .join(hostPlaceEntity).on(imgOfficeEntity.officeEntity.eq(hostPlaceEntity.officeEntity))
                .join(hostEntity).on(hostPlaceEntity.hostEntity.eq(hostEntity))
                .where(
                        imgOfficeEntity.officeEntity.no.eq(no),
                        hostEntity.memberNo.eq(memberNo)
                )
                .orderBy(imgOfficeEntity.sort.asc())
                .fetch();

        return PlaceImgListRespDto.builder()
                .placeImages(officeList != null ? officeList : List.of())
                .build();
    }
}
