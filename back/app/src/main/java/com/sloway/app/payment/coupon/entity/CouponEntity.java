package com.sloway.app.payment.coupon.entity;

import com.sloway.app.common.entity.BaseEntity;
import com.sloway.app.payment.coupon.common.CouponDcType;
import com.sloway.app.payment.coupon.common.CouponStatus;
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

    @Column
    private Long memberNo;

    @Column
    private LocalDateTime expiredAt;

    @Column
    private LocalDateTime usedAt;

    @Column
    private Long payNo;

    public void useCoupon(Long payNo) {
        if (this.status != CouponStatus.AVAILABLE) {
            throw new IllegalStateException("사용 가능한 쿠폰이 아닙니다.");
        }
        this.usedAt = LocalDateTime.now();
        this.payNo = payNo;
        this.status = CouponStatus.USED;
    }
    
    public void expireCoupon() {
        if (this.status == CouponStatus.EXPIRED) {
            throw new IllegalStateException("사용 불가능한 쿠폰입니다");
        }
        this.status = CouponStatus.EXPIRED;
    }
}
