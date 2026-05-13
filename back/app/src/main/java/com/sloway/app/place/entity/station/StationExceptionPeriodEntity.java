package com.sloway.app.place.entity.station;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "STATION_EXCEPTION_PERIOD")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class StationExceptionPeriodEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "STATION_NO", nullable = false)
    private StationEntity stationEntity;

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
