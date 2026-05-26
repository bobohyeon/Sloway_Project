package com.sloway.app.payment.stats.entity;

import com.sloway.app.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "DAILY_REFUND_STATS")
@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DailyRefundStatsEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @Column(name = "STAT_DATE", unique = true)
    private LocalDate statDate;

    private Integer refundCount;

    @Column(precision = 19, scale = 0)
    private BigDecimal refundAmt;

    public void updateStats(Integer refundCount, BigDecimal refundAmt) {
        this.refundCount = refundCount;
        this.refundAmt = refundAmt;
    }


}
