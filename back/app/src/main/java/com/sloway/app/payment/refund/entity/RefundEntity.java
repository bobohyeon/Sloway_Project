package com.sloway.app.payment.refund.entity;

import com.sloway.app.common.entity.BaseEntity;
import com.sloway.app.payment.refund.common.RefundRate;
import com.sloway.app.payment.refund.common.RefundReason;
import com.sloway.app.payment.refund.common.RefundStatus;
import jakarta.persistence.*;
import lombok.*;

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

    @Column
    private Long payNo;

    @Column
    private Long rsvnNo;

    @Column
    private Long ucNo;

    @Column
    private Integer refundAmt;

    @Column
    @Enumerated(EnumType.STRING)
    private RefundRate refundRate;

    @Column
    @Enumerated(EnumType.STRING)
    private RefundReason refundReason;

    @Column
    private LocalDateTime refundedAt;

    @Column
    @Enumerated(EnumType.STRING)
    private RefundStatus status;

    public void approveRefund() {
        if (this.status != RefundStatus.REQUESTED) {
            throw new IllegalStateException("환불 요청 상태만 승인 가능");
        }
        this.status = RefundStatus.APPROVED;
    }

    public void completeRefund() {
        if (this.status != RefundStatus.APPROVED) {
            throw new IllegalStateException("환불 승인 상태가 아닙니다.");
        }
        this.status = RefundStatus.COMPLETED;
        this.refundedAt = LocalDateTime.now();
    }

    public void failedRefund() {
        if (this.status != RefundStatus.REQUESTED) {
            throw new IllegalStateException("환불 요청 상태를 확인하세요.");
        }
        this.status = RefundStatus.FAILED;
    }
}
