package com.sloway.app.payment.pay.entity;

import com.sloway.app.common.entity.BaseEntity;
import com.sloway.app.common.exception.CustomException;
import com.sloway.app.payment.coupon.entity.CouponEntity;
import com.sloway.app.payment.pay.common.PayErrorCode;
import com.sloway.app.payment.pay.common.PayMethod;
import com.sloway.app.payment.pay.common.PayStatus;
import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "PAY")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class PayEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    // 낙관적 락 — approve/confirm 동시 호출 시 둘 다 READY를 읽어도 한 쪽만 커밋되고
    // 다른 쪽은 OptimisticLockException으로 롤백돼 포인트 이중적립·쿠폰 이중사용 방지
    // ⚠ pay 테이블에 version 컬럼이 있어야 함: ALTER TABLE pay ADD COLUMN version bigint NOT NULL DEFAULT 0;
    @Version
    private Long version;

    @JoinColumn(name = "RSVN_NO", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private RsvnEntity rsvnNo;

    @JoinColumn(name = "UC_NO")
    @ManyToOne(fetch = FetchType.LAZY)
    private CouponEntity ucNo;

    @Column(length = 60)
    private String tid;

    private Integer baseAmt;
    private Integer addAmt;
    private Integer finalAmt;
    private Integer usedPoint;
    private Integer dcAmt;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private PayMethod method;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private PayStatus status;

    private LocalDateTime approvedAt;
    private LocalDateTime canceledAt;

    public void assignTid(String tid) {
        if (this.status != PayStatus.READY) {
            throw new CustomException(PayErrorCode.PAY_ALREADY_COMPLETED);
        }
        this.tid = tid;
    }

    public void cancelPay() {
        if (this.status == PayStatus.CANCELED) {
            throw new CustomException(PayErrorCode.PAY_ALREADY_CANCELED);
        }
        if (this.status != PayStatus.COMPLETED) {
            throw new CustomException(PayErrorCode.PAY_NOT_COMPLETED);
        }
        this.status = PayStatus.CANCELED;
        this.canceledAt = LocalDateTime.now();
    }

    public void approvePay() {
        if (this.status != PayStatus.READY) {
            throw new CustomException(PayErrorCode.PAY_ALREADY_COMPLETED);
        }
        this.status = PayStatus.COMPLETED;
        this.approvedAt = LocalDateTime.now();
    }

    // PG 승인 호출이 실패한 결제를 FAILED로 기록(이미 완료된 건은 손대지 않음)
    public void failPay() {
        if (this.status == PayStatus.COMPLETED) {
            return;
        }
        this.status = PayStatus.FAILED;
    }

}