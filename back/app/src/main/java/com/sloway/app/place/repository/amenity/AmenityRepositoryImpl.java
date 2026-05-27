package com.sloway.app.place.repository.amenity;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.place.dto.response.amenity.AmenityListRespDto;
import lombok.RequiredArgsConstructor;

import java.util.List;

import static com.sloway.app.place.entity.amenity.QAmenityEntity.amenityEntity;

@RequiredArgsConstructor
public class AmenityRepositoryImpl implements AmenityRepositoryCustom{

    private final JPAQueryFactory queryFactory;

    @Override
    public AmenityListRespDto findAllByDelYn(String n) {
        List<AmenityListRespDto.AmenityDetailDto> details = queryFactory
                .select(Projections.constructor(AmenityListRespDto.AmenityDetailDto.class,
                        amenityEntity.no,
                        amenityEntity.name,
                        amenityEntity.commonYn,
                        amenityEntity.workStayYn,
                        amenityEntity.officeYn,
                        amenityEntity.stationYn
                ))
                .from(amenityEntity)
                .where(amenityEntity.delYn.eq(n))
                .orderBy(amenityEntity.no.desc())
                .fetch();

        return AmenityListRespDto.builder()
                .amenityList(details)
                .build();
    }

    @Override
    public AmenityListRespDto findAllByDelYnAndType(String type) {
        BooleanBuilder builder = new BooleanBuilder();

        // 1. 공통 조건: 삭제되지 않은 데이터
        builder.and(amenityEntity.delYn.eq("N"));

        // 2. 타입에 따른 동적 조건 추가
        if ("workStay".equals(type)) {
            builder.and(amenityEntity.workStayYn.eq("Y").or(amenityEntity.commonYn.eq("Y")));
        } else if ("station".equals(type)) {
            builder.and(amenityEntity.stationYn.eq("Y").or(amenityEntity.commonYn.eq("Y")));
        } else if ("office".equals(type)) {
            builder.and(amenityEntity.officeYn.eq("Y").or(amenityEntity.commonYn.eq("Y")));
        }

        List<AmenityListRespDto.AmenityDetailDto> details = queryFactory
                .select(Projections.constructor(AmenityListRespDto.AmenityDetailDto.class,
                        amenityEntity.no,
                        amenityEntity.name,
                        amenityEntity.commonYn,
                        amenityEntity.workStayYn,
                        amenityEntity.officeYn,
                        amenityEntity.stationYn
                ))
                .from(amenityEntity)
                .where(builder) // 완성된 조건 적용
                .orderBy(amenityEntity.no.desc())
                .fetch();

        return AmenityListRespDto.builder()
                .amenityList(details)
                .build();
    }
}
