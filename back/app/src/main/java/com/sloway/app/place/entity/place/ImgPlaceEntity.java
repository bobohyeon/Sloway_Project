package com.sloway.app.place.entity.place;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "IMG_PLACE")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ImgPlaceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PLACE_NO", nullable = false)
    private PlaceEntity placeEntity;

    @Column(length = 300, nullable = false)
    private String currentUrl;

    @Column(nullable = false)
    private int sort;

    public static ImgPlaceEntity from(PlaceEntity placeEntity, String currentUrl, int sort){
        return ImgPlaceEntity.builder()
                .placeEntity(placeEntity)
                .currentUrl(currentUrl)
                .sort(sort)
                .build();
    }
}
