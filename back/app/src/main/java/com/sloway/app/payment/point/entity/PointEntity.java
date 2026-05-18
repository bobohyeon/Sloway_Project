package com.sloway.app.payment.point.entity;

import com.sloway.app.common.entity.BaseEntity;
import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.payment.pay.entity.PayEntity;
import com.sloway.app.payment.point.common.PointDealType;
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

    @JoinColumn(name = "PAY_NO", nullable = false)
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
            throw new IllegalStateException("적립 대기상태에서만 적립확정 가능");
        }
        this.status = PointStatus.SAVE;
    }

    public void expire() {
        if (this.status != PointStatus.WAIT && this.status != PointStatus.SAVE) {
            throw new IllegalStateException("WAIT 이거나 SAVE 상태만 만료 가능합니다.");
        }
        this.status = PointStatus.EXPIRATION;
    }

    public void cancel() {
        if (this.status != PointStatus.WAIT && this.status != PointStatus.SAVE) {
            throw new IllegalStateException("WAIT 이거나 SAVE 상태만 취소 가능합니다.");
        }
        this.status = PointStatus.CANCEL;
    }

    public void applySaveAmount(int amount, LocalDateTime expiredAt) {
        this.amount = amount;
        this.expiredAt = expiredAt;
    }


    public void applyUseAmount(Integer amount){
        this.amount = amount;
    }


}
