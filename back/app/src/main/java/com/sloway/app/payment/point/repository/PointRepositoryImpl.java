package com.sloway.app.payment.point.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.payment.point.common.PointDealType;
import com.sloway.app.payment.point.common.PointStatus;
import com.sloway.app.payment.point.entity.PointEntity;
import com.sloway.app.payment.point.entity.QPointEntity;
import com.sloway.app.payment.pay.entity.QPayEntity;
import com.sloway.app.reservation.rsvn.entity.QRsvnEntity;
import com.sloway.app.reservation.rsvn.entity.RsvnStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class PointRepositoryImpl implements PointRepositoryCustom {


    private static final QPointEntity qPointEntity = QPointEntity.pointEntity;
    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public Integer sumByMemberAndStatus(Long memberNo, PointStatus status) {
        Integer point = jpaQueryFactory.select(qPointEntity.amount.sum().coalesce(0))
                .from(qPointEntity)
                .where(
                        qPointEntity.memberNo.no.eq(memberNo),
                        qPointEntity.status.eq(status)
                )
                .fetchOne();
        return point;
    }

    @Override
    public List<PointEntity> findByPayAndDealType(Long payNo, PointDealType dealType) {
        List<PointEntity> pointList = jpaQueryFactory.selectFrom(qPointEntity)
                .where(
                        qPointEntity.payNo.no.eq(payNo),
                        qPointEntity.dealType.eq(dealType)
                )
                .fetch();
        return pointList;
    }

    @Override
    public List<PointEntity> findExpiredWaitForEarn(LocalDateTime cutoff) {
        QPayEntity qPay = QPayEntity.payEntity;
        QRsvnEntity qRsvn = QRsvnEntity.rsvnEntity;
        // 정책: 적립은 "이용 완료 시" 확정 → 결제 시점(createdAt)이 아니라 예약의 checkOut 기준 판정.
        //       cutoff = now 로 호출되므로 "체크아웃이 지난(이용 완료된) 건"을 확정 대상으로 잡는다.
        return jpaQueryFactory
                .selectFrom(qPointEntity)
                .join(qPointEntity.payNo, qPay)
                .join(qPay.rsvnNo, qRsvn)
                .where(
                        qPointEntity.status.eq(PointStatus.WAIT),
                        qPointEntity.dealType.eq(PointDealType.EARN),
                        qRsvn.status.eq(RsvnStatus.E),     // 이용 완료된 예약만 (취소/거절 제외)
                        qRsvn.checkOut.loe(cutoff)         // 체크아웃이 지난 건
                )
                .fetch();
    }

    @Override
    public List<PointEntity> findExpiredHoldingPoints(LocalDateTime now) {
        return jpaQueryFactory
                .selectFrom(qPointEntity)
                .where(
                        qPointEntity.status.in(PointStatus.WAIT, PointStatus.SAVE),
                        qPointEntity.expiredAt.isNotNull(),
                        qPointEntity.expiredAt.lt(now)
                )
                .fetch();
    }

    @Override
    public List<PointEntity> findPointsByMemberNo(Long memberNo) {
        return jpaQueryFactory
                .selectFrom(qPointEntity)
                .where(
                        qPointEntity.memberNo.no.eq(memberNo)
                )
                .orderBy(qPointEntity.createdAt.desc())
                .fetch();
    }


}
