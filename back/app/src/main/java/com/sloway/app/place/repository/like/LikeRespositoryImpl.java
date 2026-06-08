package com.sloway.app.place.repository.like;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.place.dto.response.like.LikeRespDto;

import static com.sloway.app.place.entity.like.QLikeEntity.likeEntity;
import static com.sloway.app.place.entity.place.QPlaceEntity.placeEntity;
import static com.sloway.app.place.entity.place.QImgPlaceEntity.imgPlaceEntity;
import static com.sloway.app.place.entity.workStay.QWorkStayEntity.workStayEntity;
import static com.sloway.app.place.entity.office.QOfficeEntity.officeEntity;
import static com.sloway.app.place.entity.station.QStationEntity.stationEntity;
import static com.sloway.app.place.entity.office.QOfficePeriodEntity.officePeriodEntity;
import static com.sloway.app.review.review.entity.QReviewEntity.reviewEntity;
import static com.sloway.app.reservation.rsvn.entity.QRsvnEntity.rsvnEntity;
import static com.sloway.app.member.entity.QUserEntity.userEntity;

import com.sloway.app.place.entity.office.QOfficeEntity;
import com.sloway.app.place.entity.office.QOfficePeriodEntity;
import com.sloway.app.place.entity.station.QStationEntity;
import com.sloway.app.place.entity.workStay.QWorkStayEntity;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class LikeRespositoryImpl implements LikeRespositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<LikeRespDto> findByMemberNo(Long memberNo) {
        // 1. 각 타입별 최저가 서브쿼리 (별도 메소드로 분리하거나 변수로 선언)
        // 메인 쿼리의 placeEntity와 조인하여 값을 가져오도록 구성
        var minPriceExpression = new CaseBuilder()
                .when(placeEntity.type.eq("WORK_STAY")).then(
                        JPAExpressions.select(workStayEntity.monPrice.min())
                                .from(workStayEntity)
                                .where(workStayEntity.placeEntity.eq(placeEntity))
                )
                .when(placeEntity.type.eq("OFFICE")).then(
                        JPAExpressions.select(officePeriodEntity.price.min())
                                .from(officePeriodEntity)
                                .where(officePeriodEntity.officeEntity.placeEntity.eq(placeEntity))
                )
                .when(placeEntity.type.eq("STATION")).then(
                        JPAExpressions.select(stationEntity.monPrice.min())
                                .from(stationEntity)
                                .where(stationEntity.placeEntity.eq(placeEntity))
                )
                .otherwise(0);

        // 2. 리뷰 평점 평균 서브쿼리 (위와 동일하게 메인 쿼리 테이블 참조)
        var reviewAvgExpression = JPAExpressions
                .select(reviewEntity.scoreTotal.avg())
                .from(reviewEntity)
                .join(rsvnEntity).on(reviewEntity.rsvnNo.no.eq(rsvnEntity.no))
                .where(rsvnEntity.workStayNo.placeEntity.eq(placeEntity)
                        .or(rsvnEntity.officeNo.placeEntity.eq(placeEntity))
                        .or(rsvnEntity.stationNo.placeEntity.eq(placeEntity)));

        // 3. 메인 쿼리: GROUP BY 없이 조회
        return queryFactory
                .select(Projections.constructor(LikeRespDto.class,
                        likeEntity.no,
                        placeEntity.no,
                        placeEntity.title,
                        imgPlaceEntity.currentUrl,
                        placeEntity.type,
                        placeEntity.address,
                        minPriceExpression,
                        Expressions.numberTemplate(Double.class, "COALESCE(ROUND(CAST({0} AS DOUBLE), 1), 0.0)", reviewAvgExpression),
                        likeEntity.createdAt
                ))
                .from(likeEntity)
                .join(likeEntity.placeEntity, placeEntity)
                .leftJoin(imgPlaceEntity).on(imgPlaceEntity.placeEntity.eq(placeEntity).and(imgPlaceEntity.sort.eq(0)))
                .join(likeEntity.userEntity, userEntity)
                .where(userEntity.memberNo.eq(memberNo))
                .orderBy(likeEntity.no.desc())
                .fetch();
    }
}
