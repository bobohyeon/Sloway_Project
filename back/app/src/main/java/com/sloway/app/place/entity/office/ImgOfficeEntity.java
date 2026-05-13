package com.sloway.app.place.entity.office;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "IMG_OFFICE")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ImgOfficeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "OFFICE_NO", nullable = false)
    private OfficeEntity officeEntity;

    @Column(length = 300, nullable = false)
    private String currentUrl;

    @Column(nullable = false)
    private int sort;

}
