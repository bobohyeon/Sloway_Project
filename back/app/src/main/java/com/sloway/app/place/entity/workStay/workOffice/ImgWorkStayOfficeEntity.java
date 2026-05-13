package com.sloway.app.place.entity.workStay.workOffice;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "IMG_WORK_STAY_OFFICE")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ImgWorkStayOfficeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "WORK_OFFICE_NO", nullable = false)
    private WorkOfficeEntity workOfficeEntity;

    @Column(length = 300, nullable = false)
    private String currentUrl;

    @Column(nullable = false)
    private int sort;

}
