package com.sloway.app.place.entity.workStay;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "IMG_WORK_STAY")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ImgWorkStayEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "WORK_NO", nullable = false)
    private WorkStayEntity workStayEntity;

    @Column(length = 300, nullable = false)
    private String currentUrl;

    @Column(nullable = false)
    private Integer sort;

    public static ImgWorkStayEntity from(WorkStayEntity savedEntity, String url, Integer sortValue) {
        return ImgWorkStayEntity.builder()
                .workStayEntity(savedEntity)
                .currentUrl(url)
                .sort(sortValue)
                .build();
    }

    public void updateSort(Integer sort) {
        this.sort = sort;
    }
}
