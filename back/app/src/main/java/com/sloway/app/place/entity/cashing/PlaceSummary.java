package com.sloway.app.place.entity.cashing;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Immutable;

import java.io.Serializable;
import java.time.LocalDateTime;
@Entity
@Table(name = "place_summary")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Immutable
@IdClass(PlaceSummary.PlaceSummaryId.class)
public class PlaceSummary {
    @Id
    private Long placeNo;
    @Id
    private String type;

    private Long targetNo;
    private String title;
    private String address;
    private String currentUrl;
    private Integer price;
    private Integer finalScore;
    private Integer rsvnCount;
    private Double avgScore;
    private String amenities;
    private String status;
    private LocalDateTime updatedAt;


    @Embeddable
    @Getter
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @EqualsAndHashCode
    public static class PlaceSummaryId implements Serializable {
        private Long placeNo;
        private String type;
    }
}