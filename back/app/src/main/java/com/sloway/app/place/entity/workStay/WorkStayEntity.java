package com.sloway.app.place.entity.workStay;

import com.sloway.app.common.entity.BaseEntity;
import com.sloway.app.place.dto.request.workStay.WorkStayUpdateReqDto;
import com.sloway.app.place.entity.amenity.workStay.WorkAmenityEntity;
import com.sloway.app.place.entity.place.PlaceEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private int rooms;

    @Column(nullable = false)
    private int cnt;

    @Column(nullable = false)
    private int maxCnt;

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

    @Builder.Default
    @OneToMany(mappedBy = "workStayEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WorkExceptionPeriodEntity> workExceptionPeriodEntities = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "workStayEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WorkAmenityEntity> workAmenityEntities = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "workStayEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ImgWorkStayEntity> images = new ArrayList<>();

    public void setAmenities(List<WorkAmenityEntity> amenities) {
        this.workAmenityEntities = amenities;
        for (WorkAmenityEntity amenity : amenities) {
            amenity.setWorkStayEntity(this);
        }
    }

    public void setExceptionPeriods(List<WorkExceptionPeriodEntity> periods) {
        this.workExceptionPeriodEntities = periods;
        for (WorkExceptionPeriodEntity period : periods) {
            period.setWorkStayEntity(this);
        }
    }

    public void updateExceptionPeriods(List<WorkExceptionPeriodEntity> newPeriods) {
        this.workExceptionPeriodEntities.clear();
        if (newPeriods != null) {
            for (WorkExceptionPeriodEntity period : newPeriods) {
                period.setWorkStayEntity(this);
                this.workExceptionPeriodEntities.add(period);
            }
        }
    }
    public void updateInfo(WorkStayUpdateReqDto dto) {
            this.title = dto.getTitle();
            this.content = dto.getContent();
            this.cnt = dto.getBasePeople();
            this.maxCnt = dto.getMaxPeople();
            this.rooms = dto.getRooms();
            this.chargeAdd = dto.getChargeAdd();
            this.checkinTime = dto.getCheckIn();
            this.checkoutTime = dto.getCheckOut();
            this.monPrice = dto.getMonPrice();
            this.tuePrice = dto.getTuePrice();
            this.wedPrice = dto.getWedPrice();
            this.thuPrice = dto.getThuPrice();
            this.friPrice = dto.getFriPrice();
            this.satPrice = dto.getSatPrice();
            this.sunPrice = dto.getSunPrice();
            this.holPrice = dto.getHolPrice();
    }

    public void updateAmenities(List<WorkAmenityEntity> newStayAmenities) {
        this.workAmenityEntities.clear();
        if (newStayAmenities != null) {
            for (WorkAmenityEntity amenity : newStayAmenities) {
                amenity.setWorkStayEntity(this); // 연관관계 주인 세팅
                this.workAmenityEntities.add(amenity);
            }
        }
    }
}

