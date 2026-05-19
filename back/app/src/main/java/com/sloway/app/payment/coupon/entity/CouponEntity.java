package com.sloway.app.payment.coupon.entity;

import com.sloway.app.common.entity.BaseEntity;
import com.sloway.app.common.exception.CustomException;
import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.payment.coupon.common.CouponDcType;
import com.sloway.app.payment.coupon.common.CouponErrorCode;
import com.sloway.app.payment.coupon.common.CouponStatus;
import com.sloway.app.payment.pay.entity.PayEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "COUPON")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class CouponEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @Column
    @Enumerated(EnumType.STRING)
    private CouponStatus status;

    @Column(length = 100)
    private String couponName;

    @Column
    @Enumerated(EnumType.STRING)
    private CouponDcType dcType;

    @Column
    private Integer dcValue;

    @JoinColumn(name = "MEMBER_NO", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private MemberEntity memberNo;

    @Column
    private LocalDateTime expiredAt;

    @Column
    private LocalDateTime usedAt;

    @JoinColumn(name = "PAY_NO")
    @ManyToOne(fetch = FetchType.LAZY)
    private PayEntity payNo;

    public void useCoupon(PayEntity payEntity) {
        if (this.status != CouponStatus.AVAILABLE) {
            throw new CustomException(CouponErrorCode.COUPON_NOT_AVAILABLE);
        }
        this.usedAt = LocalDateTime.now();
        this.payNo = payEntity;
        this.status = CouponStatus.USED;
    }

    public void expireCoupon() {
        if (this.status != CouponStatus.AVAILABLE) {
            throw new CustomException(CouponErrorCode.COUPON_NOT_EXPIRABLE);
        }
        this.status = CouponStatus.EXPIRED;
    }
}
