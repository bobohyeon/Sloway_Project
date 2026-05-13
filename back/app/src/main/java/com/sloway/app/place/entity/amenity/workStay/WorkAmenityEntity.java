package com.sloway.app.place.entity.amenity.workStay;

import com.sloway.app.place.entity.amenity.AmenityEntity;
import com.sloway.app.place.entity.workStay.WorkStayEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "WORK_AMENITY")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class WorkAmenityEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "WORK_NO", nullable = false)
    private WorkStayEntity workStayEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "AMENITY_NO", nullable = false)
    private AmenityEntity amenityEntity;

}
