package com.sloway.app.payment.settlement.settle.entity;

import com.sloway.app.common.entity.BaseEntity;
import com.sloway.app.common.exception.CustomException;
import com.sloway.app.host.entity.HostEntity;
import com.sloway.app.payment.settlement.settle.common.SettleErrorCode;
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
            throw new CustomException(SettleErrorCode.SETTLE_NOT_WAITING);
        }
        this.status = SettleStatus.COMPLETE;
        this.settledAt = LocalDateTime.now();
    }

    public void issueTaxInvoice() {
        if (this.status != SettleStatus.COMPLETE) {
            throw new CustomException(SettleErrorCode.SETTLE_NOT_COMPLETED);
        }
        this.status = SettleStatus.INVOICE;
        this.invoicedAt = LocalDateTime.now();
    }

    public void applyAmounts(Integer totalAmt, Integer feeAmt, Integer refundAmt, Integer payoutAmt) {
        if (this.status != SettleStatus.WAITING) {
            throw new CustomException(SettleErrorCode.SETTLE_NOT_WAITING);
        }
        this.totalAmt = totalAmt;
        this.feeAmt = feeAmt;
        this.refundAmt = refundAmt;
        this.payoutAmt = payoutAmt;
    }

    public void settleWithCarry(Integer effectiveAmt, int minPayOut) {
        if (effectiveAmt >= minPayOut) {
            this.status = SettleStatus.WAITING;
            this.payoutAmt = effectiveAmt;
            this.carryOver=0;
        } else {
            this.status = SettleStatus.CARRIED;
            this.payoutAmt =0;
            this.carryOver = effectiveAmt;
        }
    }


}
