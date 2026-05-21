package com.sloway.app.payment.refund.entity;

import com.sloway.app.common.entity.BaseEntity;
import com.sloway.app.common.exception.CustomException;
import com.sloway.app.payment.coupon.entity.CouponEntity;
import com.sloway.app.payment.pay.entity.PayEntity;
import com.sloway.app.payment.refund.common.RefundErrorCode;
import com.sloway.app.payment.refund.common.RefundRate;
import com.sloway.app.payment.refund.common.RefundReason;
import com.sloway.app.payment.refund.common.RefundStatus;
import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "REFUND")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class RefundEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @JoinColumn(name = "PAY_NO", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private PayEntity payNo;

    @JoinColumn(name = "RSVN_NO", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private RsvnEntity rsvnNo;

    @JoinColumn(name = "UC_NO")
    @ManyToOne(fetch = FetchType.LAZY)
    private CouponEntity ucNo;

    @Column(precision = 19, scale = 0)
    private BigDecimal refundAmt;

    @Column
    @Enumerated(EnumType.STRING)
    private RefundRate refundRate;

    @Column
    @Enumerated(EnumType.STRING)
    private RefundReason refundReason;

    @Column
    private LocalDateTime requestedAt;

    @Column
    @Enumerated(EnumType.STRING)
    private RefundStatus status;

    public void approveRefund() {
        if (this.status != RefundStatus.REQUESTED) {
            throw new CustomException(RefundErrorCode.REFUND_NOT_REQUESTED);
        }
        this.status = RefundStatus.APPROVED;
    }

    public void completeRefund() {
        if (this.status != RefundStatus.APPROVED) {
            throw new CustomException(RefundErrorCode.REFUND_NOT_APPROVED);
        }
        this.status = RefundStatus.COMPLETED;
    }

    public void applyRefund(RefundRate rate, BigDecimal refundAmt) {
        if (this.status != RefundStatus.REQUESTED) {
            throw new CustomException(RefundErrorCode.REFUND_NOT_REQUESTED);
        }
        this.refundRate = rate;
        this.refundAmt = refundAmt;
    }


}
