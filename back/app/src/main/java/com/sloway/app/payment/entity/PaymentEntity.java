package com.sloway.app.payment.entity;

import com.sloway.app.payment.common.entity.PayBaseEntity;
import com.sloway.app.payment.common.PaymentMethod;
import com.sloway.app.payment.common.PaymentStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "PAYMENT")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class PaymentEntity extends PayBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    private Long rsvnNo;
    private Long ucNo;

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
    private PaymentMethod method;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private PaymentStatus status;

    private LocalDateTime approvedAt;

    public void completeAsLevel1(String tid) {
        this.tid = tid;
        this.status = PaymentStatus.COMPLETED;
        this.approvedAt = LocalDateTime.now();
    }
}