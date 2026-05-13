package com.sloway.app.place.entity.place;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "PLACE")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class PlaceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @Column(length = 10 , nullable = false)
    private String type;

    @Column(length = 100, nullable = false)
    private String title;

    @Column(nullable = false , columnDefinition = "TEXT")
    private String content;

    @Column(length = 200, nullable = false)
    private String address;

    @Column(length = 300)
    private String detailAdderss;

    //위도
    @Column(length = 17, nullable = false)
    private String latitude;

    //경도
    @Column(length = 17, nullable = false)
    private String longtitude;

    @Enumerated(EnumType.STRING)
    @Column(length = 1, nullable = false)
    @Builder.Default
    private PlaceStatus status = PlaceStatus.I;

    @Column(length = 1, nullable = false)
    @Builder.Default
    private int viewCnt = 0;

    private void updateTitleAndContent(String title, String content){
        this.title = title;
        this.content = content;
    }


}
