package com.sloway.app.place.entity.office;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "OFFICE_PERIOD")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class OfficePeriodEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "OFFICE_NO", nullable = false)
    private OfficeEntity officeEntity;

    @Column(nullable = false)
    private int price;

    @Column(length = 1, nullable = false)
    private String dayOfWeek;

    @Column
    private LocalDateTime exceptionStartDate;

    @Column
    private LocalDateTime exceptionEndDate;
}
