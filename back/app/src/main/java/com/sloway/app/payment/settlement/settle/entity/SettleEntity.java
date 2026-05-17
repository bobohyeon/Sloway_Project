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

    // TODO: (선택) offsetRefund(Integer refundDeduction)
    //       다음 회차로 이월된 환불액을 정산에 차감 반영
    //       전이 없음, 금액 필드만 변경
    //       힌트:
    //         this.refundAmt += refundDeduction;
    //         this.payoutAmt -= refundDeduction;
    //       호출 시점: completeSettle() 이전에 호출하여 차감 후 확정하는 흐름
}
