package com.sloway.app.place.entity.workStay;

import com.sloway.app.common.entity.BaseEntity;
import com.sloway.app.place.entity.place.PlaceEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "WORK_STAY")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class WorkStayEntity extends BaseEntity {

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

    private void updateTitleAndContent(String title, String content){
        this.title = title;
        this.content = content;
    }
}
