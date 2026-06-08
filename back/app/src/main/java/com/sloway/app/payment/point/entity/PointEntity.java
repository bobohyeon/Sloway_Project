package com.sloway.app.payment.point.entity;

import com.sloway.app.common.entity.BaseEntity;
import com.sloway.app.common.exception.CustomException;
import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.payment.pay.entity.PayEntity;
import com.sloway.app.payment.point.common.PointDealType;
import com.sloway.app.payment.point.common.PointErrorCode;
import com.sloway.app.payment.point.common.PointStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "POINT")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class PointEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @JoinColumn(name = "MEMBER_NO", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private MemberEntity memberNo;

    @JoinColumn(name = "PAY_NO")
    @ManyToOne(fetch = FetchType.LAZY)
    private PayEntity payNo;

    @Column
    private Integer amount;

    @Column
    @Enumerated(EnumType.STRING)
    private PointDealType dealType;

    @Column
    private LocalDateTime expiredAt;

    @Column
    @Enumerated(EnumType.STRING)
    private PointStatus status;

    public void confirmEarn() {
        if (this.status != PointStatus.WAIT) {
            throw new CustomException(PointErrorCode.POINT_NOT_WAIT);
        }
        this.status = PointStatus.SAVE;
    }

    public void expire() {
        if (this.status != PointStatus.WAIT && this.status != PointStatus.SAVE) {
            throw new CustomException(PointErrorCode.POINT_NOT_HOLDABLE);
        }
        this.status = PointStatus.EXPIRATION;
    }

    public void cancel() {
        if (this.status != PointStatus.WAIT && this.status != PointStatus.SAVE) {
            throw new CustomException(PointErrorCode.POINT_NOT_HOLDABLE);
        }
        this.status = PointStatus.CANCEL;
    }

    public void applySaveAmount(int amount, LocalDateTime expiredAt) {
        if (this.status != PointStatus.WAIT) {
            throw new CustomException(PointErrorCode.POINT_NOT_WAIT);
        }
        this.amount = amount;
        this.expiredAt = expiredAt;
    }

    public void applyUseAmount(Integer amount) {
        if (this.status != PointStatus.USED) {
            throw new CustomException(PointErrorCode.POINT_NOT_USED);
        }
        this.amount = amount;

    }


}
