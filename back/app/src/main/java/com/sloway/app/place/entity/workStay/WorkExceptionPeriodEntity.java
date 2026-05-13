package com.sloway.app.place.entity.workStay;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "WORK_EXCEPTION_PERIOD")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class WorkExceptionPeriodEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "WORK_NO", nullable = false)
    private WorkStayEntity workStayEntity;

    @Column(nullable = false)
    private LocalDateTime startDate;

    @Column(nullable = false)
    private LocalDateTime endDate;

    @Column(nullable = false)
    private int monPrice;

    @Column(nullable = false)
    private int tuePrice;

    @Column(nullable = false)
    private int wedPrice;

    @Column(nullable = false)
    private int thuPrice;

    @Column(nullable = false)
    private int friPrice;

    @Column(nullable = false)
    private int satPrice;

    @Column(nullable = false)
    private int sunPrice;

    @Column(nullable = false)
    private int holPrice;
}
