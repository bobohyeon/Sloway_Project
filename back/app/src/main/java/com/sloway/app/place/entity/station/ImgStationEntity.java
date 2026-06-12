package com.sloway.app.place.entity.station;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "IMG_STATION")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ImgStationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "STATION_NO", nullable = false)
    private StationEntity stationEntity;

    @Column(length = 300, nullable = false)
    private String currentUrl;

    @Column(nullable = false)
    private Integer sort;

    public static ImgStationEntity from(StationEntity stationEntity, String currentUrl, Integer sort){
        return ImgStationEntity.builder()
                .stationEntity(stationEntity)
                .currentUrl(currentUrl)
                .sort(sort)
                .build();
    }

    public void updateSort(Integer sort) {
        this.sort = sort;
    }
}
