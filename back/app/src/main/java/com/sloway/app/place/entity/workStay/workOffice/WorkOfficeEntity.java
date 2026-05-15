package com.sloway.app.place.entity.workStay.workOffice;

import com.sloway.app.place.dto.request.workStay.workOffice.WorkOfficeUpdateReqDto;
import com.sloway.app.place.entity.amenity.workStay.workOffice.WorkOfficeAmenityEntity;
import com.sloway.app.place.entity.workStay.WorkStayEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "WORK_STAY_OFFICE")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class WorkOfficeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @Column
    private int cnt;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "WORK_NO", nullable = false)
    private WorkStayEntity workStayEntity;

    @Builder.Default
    @OneToMany(mappedBy = "workOfficeEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WorkOfficeAmenityEntity> workOfficeAmenityEntities = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "workOfficeEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ImgWorkStayOfficeEntity> images = new ArrayList<>();

    public void setAmenities(List<WorkOfficeAmenityEntity> amenities) {
        this.workOfficeAmenityEntities = amenities;
        for (WorkOfficeAmenityEntity amenity : amenities) {
            amenity.setWorkOfficeEntity(this);
        }
    }

    public void updateInfo(WorkOfficeUpdateReqDto dto) {
        this.cnt = dto.getCnt();
    }

    public void updateAmenities(List<WorkOfficeAmenityEntity> newAmenities) {
        this.workOfficeAmenityEntities.clear();
        if (newAmenities != null) {
            for (WorkOfficeAmenityEntity amenity : newAmenities) {
                amenity.setWorkOfficeEntity(this); // 연관관계 주인 세팅
                this.workOfficeAmenityEntities.add(amenity);
            }
        }
    }
}
