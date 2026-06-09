package com.sloway.app.payment.couponevent.entity;

import com.sloway.app.common.entity.BaseEntity;
import com.sloway.app.common.exception.CustomException;
import com.sloway.app.payment.coupon.common.CouponDcType;
import com.sloway.app.payment.couponevent.common.CouponEventErrorCode;
import com.sloway.app.payment.couponevent.common.CouponEventStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "COUPON_EVENT")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class CouponEventEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @Column(length = 100)
    private String couponName;

    @Enumerated(EnumType.STRING)
    private CouponDcType dcType;

    private Integer dcValue;

    private Integer validDays;

    private LocalDateTime startAt;

    private LocalDateTime endAt;

    private Integer totalCount;

    private Integer issuedCount;

    @Enumerated(EnumType.STRING)
    private CouponEventStatus status;

    // 다운로드 가능 상태 검증 — OPEN 만 허용, 종료/소진된 이벤트는 발급 차단.
    // issue() 의 소진 가드는 동시성 막판(issuedCount==totalCount) 이중 안전망으로 유지.
    public void validateDownloadable() {
        if (this.status == CouponEventStatus.CLOSED) {
            throw new CustomException(CouponEventErrorCode.COUPONEVENT_ALREADY_CLOSED);
        }
        if (this.status == CouponEventStatus.SOLDOUT) {
            throw new CustomException(CouponEventErrorCode.COUPONEVENT_SOLDOUT);
        }
    }

    public void issue() {
        if (this.issuedCount >= this.totalCount) {
            throw new CustomException(CouponEventErrorCode.COUPONEVENT_SOLDOUT);
        }
        this.issuedCount++;
        if (this.issuedCount >= this.totalCount) {
            this.status = CouponEventStatus.SOLDOUT;
        }
    }

    public void close() {
        if (this.status != CouponEventStatus.OPEN) {
            throw new CustomException(CouponEventErrorCode.COUPONEVENT_ALREADY_CLOSED);
        }
        this.status = CouponEventStatus.CLOSED;
    }


}
