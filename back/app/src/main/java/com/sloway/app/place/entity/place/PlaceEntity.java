package com.sloway.app.place.entity.place;

import com.sloway.app.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "PLACE")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class PlaceEntity extends BaseEntity {

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
    private String longitude;

    @Enumerated(EnumType.STRING)
    @Column(length = 1, nullable = false)
    @Builder.Default
    private PlaceStatus status = PlaceStatus.I;

    @Column(nullable = false)
    @Builder.Default
    private int viewCnt = 0;

    // 이미지 연관관계 추가
    @Builder.Default
    @OneToMany(mappedBy = "placeEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ImgPlaceEntity> images = new ArrayList<>();


    public void updateTitleAndContent(String title, String content){
        this.title = title;
        this.content = content;
    }


}
