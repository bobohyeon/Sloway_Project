package com.sloway.app.settlement.fee.entity;

import com.sloway.app.settlement.fee.common.PlaceType;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "FEE")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class FeeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "NO")
    private Long no;

    @Enumerated(EnumType.STRING)
    @Column(name = "PLACE_TYPE", length = 20)
    private PlaceType placeType;

    @Column(name = "RATE")
    private Integer rate;

    @Column(name = "START_AT")
    private LocalDateTime startAt;

    @Column(name = "END_AT")
    private LocalDateTime endAt;

    @Builder.Default
    @Column(name = "DEL_YN", length = 1)
    private String delYn = "N";
}
