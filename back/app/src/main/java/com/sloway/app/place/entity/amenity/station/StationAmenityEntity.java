package com.sloway.app.place.entity.amenity.station;

import com.sloway.app.place.entity.amenity.AmenityEntity;
import com.sloway.app.place.entity.station.StationEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "STATION_AMENITY")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class StationAmenityEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "STATION_NO", nullable = false)
    private StationEntity stationEntity;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "AMENITY_NO", nullable = false)
    private AmenityEntity amenityEntity;
}
