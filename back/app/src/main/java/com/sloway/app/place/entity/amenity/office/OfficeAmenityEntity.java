package com.sloway.app.place.entity.amenity.office;

import com.sloway.app.place.entity.amenity.AmenityEntity;
import com.sloway.app.place.entity.office.OfficeEntity;
import com.sloway.app.place.entity.workStay.WorkStayEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "OFFICE_AMENITY")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class OfficeAmenityEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "OFFICE_NO", nullable = false)
    private OfficeEntity officeEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "AMENITY_NO", nullable = false)
    private AmenityEntity amenityEntity;

}
