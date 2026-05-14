package com.sloway.app.place.entity.station;

import com.sloway.app.place.entity.amenity.station.StationAmenityEntity;
import com.sloway.app.place.entity.place.ImgPlaceEntity;
import com.sloway.app.place.entity.place.PlaceEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "STATION")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class StationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PLACE_NO", nullable = false)
    private PlaceEntity placeEntity;

    @Column(length = 100, nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private int cnt;

    @Column(nullable = false)
    private int maxCnt;

    @Column(nullable = false)
    private int rooms;

    @Column(nullable = false)
    private int chargeAdd;

    @Column(nullable = false)
    private LocalDateTime checkinTime;

    @Column(nullable = false)
    private LocalDateTime checkoutTime;

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


    // 이미지 연관관계 추가
    // cascade = CascadeType.ALL: Place 저장 시 이미지도 같이 저장
    @Builder.Default
    @OneToMany(mappedBy = "stationEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ImgStationEntity> images = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "stationEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StationExceptionPeriodEntity> stationExceptionPeriodEntities = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "stationEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StationAmenityEntity> stationAmenityEntities = new ArrayList<>();

    public void setImages(List<ImgStationEntity> images) {
        this.images = images;
        for (ImgStationEntity img : images) {
            img.setStationEntity(this);
        }
    }

    public void setAmenities(List<StationAmenityEntity> amenities) {
        this.stationAmenityEntities = amenities;
        for (StationAmenityEntity amenity : amenities) {
            amenity.setStationEntity(this);
        }
    }

    public void setExceptionPeriods(List<StationExceptionPeriodEntity> periods) {
        this.stationExceptionPeriodEntities = periods;
        for (StationExceptionPeriodEntity period : periods) {
            period.setStationEntity(this);
        }
    }
    private void updateTitleAndContent(String title, String content) {
        this.title = title;
        this.content = content;
    }

}
