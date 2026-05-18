package com.sloway.app.place.repository.like;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.place.dto.response.like.LikeRespDto;
import static com.sloway.app.place.entity.like.QLikeEntity.likeEntity;
import static com.sloway.app.place.entity.place.QPlaceEntity.placeEntity;

import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class LikeRespositoryImpl implements LikeRespositoryCustom{

    private final JPAQueryFactory queryFactory;

    @Override
    public List<LikeRespDto> findLikeByUserId(Long userNo) {
        return queryFactory
                .select(Projections.constructor(LikeRespDto.class,
                        likeEntity.no,
                        placeEntity.no,
                        placeEntity.title, // 조인된 플레이스의 타이틀 추출
                        likeEntity.createdAt
                ))
                .from(likeEntity)
                .join(likeEntity.placeEntity, placeEntity) // 내역과 플레이스 조인
                .where(likeEntity.userEntity.no.eq(userNo))
                .fetch();

    }

}
