package com.sloway.app.place.entity.office;

import com.sloway.app.common.entity.BaseEntity;
import com.sloway.app.place.entity.place.PlaceEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "OFFICE")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class OfficeEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PLACE_NO", nullable = false)
    private PlaceEntity placeEntity;

    @Column(length = 100, nullable = false)
    private String title;

    @Column(nullable = false , columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private int cnt;

    private void updateTitleAndContent(String title, String content){
        this.title = title;
        this.content = content;
    }
}
