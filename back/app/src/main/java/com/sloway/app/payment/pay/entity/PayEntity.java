package com.sloway.app.payment.pay.entity;

import com.sloway.app.common.entity.BaseEntity;
import com.sloway.app.common.exception.CustomException;
import com.sloway.app.payment.coupon.entity.CouponEntity;
import com.sloway.app.payment.pay.common.PayErrorCode;
import com.sloway.app.payment.pay.common.PayMethod;
import com.sloway.app.payment.pay.common.PayStatus;
import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

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

    @JoinColumn(name = "RSVN_NO", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private RsvnEntity rsvnNo;

    @JoinColumn(name = "UC_NO")
    @ManyToOne(fetch = FetchType.LAZY)
    private CouponEntity ucNo;

    @Column(length = 60)
    private String tid;

    @Column(length = 60)
    private String payToken;

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

    public void completeAsLevel1(String tid) {
        if(this.status != PayStatus.READY){
            throw new CustomException(PayErrorCode.PAY_ALREADY_COMPLETED);
        }
        this.tid = tid;
        this.status = PayStatus.COMPLETED;
        this.approvedAt = LocalDateTime.now();
    }
}