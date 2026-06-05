package com.sloway.app.review.review.repository;

import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.place.entity.office.QOfficeEntity;
import com.sloway.app.place.entity.place.PlaceEntity;
import com.sloway.app.place.entity.station.QStationEntity;
import com.sloway.app.place.entity.workStay.QWorkStayEntity;
import com.sloway.app.reservation.rsvn.entity.QRsvnEntity;
import com.sloway.app.review.review.entity.QReviewEntity;
import com.sloway.app.review.review.entity.ReviewEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import com.sloway.app.review.review.dto.PeriodType;

import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@Repository
public class ReviewCustomRepositoryImpl implements ReviewCustomRepository {

    private final JPAQueryFactory queryFactory;

    private static final QReviewEntity review = QReviewEntity.reviewEntity;
    private static final QRsvnEntity rsvn = QRsvnEntity.rsvnEntity;
    private static final QOfficeEntity office = QOfficeEntity.officeEntity;
    private static final QStationEntity station = QStationEntity.stationEntity;
    private static final QWorkStayEntity workStay = QWorkStayEntity.workStayEntity;

    @Override
    public List<ReviewEntity> findByHostFilter(PlaceEntity placeEntity, Integer minScore, PeriodType period) {
        return queryFactory
                .selectFrom(review)
                .join(review.rsvnNo, rsvn)
                .leftJoin(rsvn.officeNo, office)
                .leftJoin(rsvn.stationNo, station)
                .leftJoin(rsvn.workStayNo, workStay)
                .where(
                        office.placeEntity.no.eq(placeEntity.getNo())
                                .or(station.placeEntity.no.eq(placeEntity.getNo()))
                                .or(workStay.placeEntity.no.eq(placeEntity.getNo()))
                        ,review.delYn.eq("N")
                        ,min(minScore)
                        ,periodBoolean(period)
                )
                .fetch();
    }

    @Override
    public List<ReviewEntity> findByEntityNo(Long entityNo, String type) {
        // type에 따라 해당 공간 테이블 FK만 비교 (OR 퉁치기 방지)
        BooleanExpression cond = switch (type) {
            case "OFFICE"    -> rsvn.officeNo.no.eq(entityNo);
            case "WORK_STAY" -> rsvn.workStayNo.no.eq(entityNo);
            default          -> rsvn.stationNo.no.eq(entityNo);
        };
        return queryFactory
                .selectFrom(review)
                .join(review.rsvnNo, rsvn)
                .leftJoin(rsvn.officeNo, office)
                .leftJoin(rsvn.stationNo, station)
                .leftJoin(rsvn.workStayNo, workStay)
                .where(cond, review.delYn.eq("N"))
                .fetch();
    }

    //최소 평점 필터
    private BooleanExpression min(Integer minScore){ return minScore == null ? null : review.scoreTotal.goe(minScore);}

    //기간 필터
    private BooleanExpression periodBoolean(PeriodType period){
        if(period == null) {return null;}
        LocalDateTime from = switch (period){
            case THIS_MONTH -> LocalDateTime.now().withDayOfMonth(1);
            case THREE_MONTHS -> LocalDateTime.now().minusMonths(3);
            default -> null;
        };
        return from == null ? null : review.createdAt.goe(from);
    }
}
