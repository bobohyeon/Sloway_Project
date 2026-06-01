package com.sloway.app.payment.settlement.settle.entity;

import com.sloway.app.common.entity.BaseEntity;
import com.sloway.app.host.entity.HostEntity;
import com.sloway.app.payment.settlement.settle.common.SettleStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "SETTLE")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class SettleEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @Column
    private LocalDate settleStartDate;

    @Column
    private LocalDate settleEndDate;

    @JoinColumn(name = "HOST_NO", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private HostEntity hostNo;

    @Column
    private Integer totalAmt;

    @Column
    private Integer feeAmt;

    @Column
    private Integer refundAmt;

    @Column
    private Integer payoutAmt;

    @Column
    private Integer carryOver;

    @Column
    @Enumerated(EnumType.STRING)
    private SettleStatus status;

    @Column
    private LocalDateTime settledAt;

    @Column
    private LocalDateTime invoicedAt;

    public void completeSettle() {
        if (this.status != SettleStatus.WAITING) {
            throw new IllegalStateException("정산 대기 상태만 확정 가능");
        }
        this.status = SettleStatus.COMPLETE;
        this.settledAt = LocalDateTime.now();
    }

    public void issueTaxInvoice() {
        if (this.status != SettleStatus.COMPLETE) {
            throw new IllegalStateException("정산이 완료되지 않았습니다.");
        }
        this.status = SettleStatus.INVOICE;
        this.invoicedAt = LocalDateTime.now();
    }
    public void applyAmounts(Integer totalAmt, Integer feeAmt, Integer refundAmt, Integer payoutAmt) {
        if (this.status != SettleStatus.WAITING) {
            throw new IllegalStateException("정산 대기 상태만 금액 설정 가능");
        }
        this.totalAmt = totalAmt;
        this.feeAmt = feeAmt;
        this.refundAmt = refundAmt;
        this.payoutAmt = payoutAmt;
    }


}
