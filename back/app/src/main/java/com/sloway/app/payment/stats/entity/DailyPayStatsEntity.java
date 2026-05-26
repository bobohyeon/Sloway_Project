package com.sloway.app.payment.stats.entity;


import com.sloway.app.common.entity.BaseEntity;
import com.sloway.app.payment.pay.common.PayMethod;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "DAILY_PAY_STATS",
        uniqueConstraints = @UniqueConstraint(columnNames =
        {"STAT_DATE", "PAY_METHOD"}))
@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DailyPayStatsEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @Column(name = "STAT_DATE")
    private LocalDate statDate;

    @Column(name = "PAY_METHOD")
    @Enumerated(EnumType.STRING)
    private PayMethod payMethod;

    private Integer payCount;

    private Integer totalAmt;

    public void updateStats(Integer payCount, Integer totalAmt) {
        this.payCount = payCount;
        this.totalAmt = totalAmt;
    }

}
