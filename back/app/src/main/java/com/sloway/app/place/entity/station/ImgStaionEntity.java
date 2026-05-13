package com.sloway.app.place.entity.station;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "IMG_STATION")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ImgStaionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "STATION_NO", nullable = false)
    private StationEntity stationEntity;

    @Column(length = 300, nullable = false)
    private String currentUrl;

    @Column(nullable = false)
    private int sort;

}
