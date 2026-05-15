package com.sloway.app.place.entity.amenity.workStay.workOffice;

import com.sloway.app.place.entity.amenity.AmenityEntity;
import com.sloway.app.place.entity.workStay.workOffice.WorkOfficeEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "WORK_OFFICE_AMENITY")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class WorkOfficeAmenityEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "WORK_OFFICE_NO", nullable = false)
    private WorkOfficeEntity workOfficeEntity;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "AMENITY_NO", nullable = false)
    private AmenityEntity amenityEntity;

}
