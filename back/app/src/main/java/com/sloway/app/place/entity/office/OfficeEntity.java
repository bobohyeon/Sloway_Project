package com.sloway.app.place.entity.office;

import com.sloway.app.common.entity.BaseEntity;
import com.sloway.app.place.dto.request.office.OfficeUpdateReqDto;
import com.sloway.app.place.entity.amenity.office.OfficeAmenityEntity;
import com.sloway.app.place.entity.place.PlaceEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

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

    @Builder.Default
    @OneToMany(mappedBy = "officeEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OfficePeriodEntity> officePeriodEntities = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "officeEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OfficeAmenityEntity> officeAmenityEntities = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "officeEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ImgOfficeEntity> images = new ArrayList<>();

    public void setAmenities(List<OfficeAmenityEntity> amenities) {
        this.officeAmenityEntities = amenities;
        for (OfficeAmenityEntity amenity : amenities) {
            amenity.setOfficeEntity(this);
        }
    }

    public void setOfficePeriods(List<OfficePeriodEntity> periods){
        this.officePeriodEntities = periods;
        for(OfficePeriodEntity period : periods){
            period.setOfficeEntity(this);
        }
    }

    public void updateInfo(OfficeUpdateReqDto dto) {
        this.title = dto.getTitle();
        this.content = dto.getContent();
        this.cnt = dto.getBasePeople();
    }
}
