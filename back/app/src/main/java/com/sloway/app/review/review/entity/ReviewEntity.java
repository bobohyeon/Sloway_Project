package com.sloway.app.review.review.entity;

import com.sloway.app.common.entity.BaseEntity;
import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import jakarta.persistence.*;
import lombok.*;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Table(name = "REVIEW")
@Entity
public class ReviewEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @JoinColumn(name = "rsvn_no")
    @ManyToOne(fetch = FetchType.LAZY)
    private RsvnEntity rsvnNo;

    @Column(nullable = false, name = "score_total")
    private Integer scoreTotal;

    @Column(nullable = false, name = "score_office")
    private Integer scoreOffice;

    @Column(nullable = false, name = "score_amenity")
    private Integer scoreAmenity;

    @Column(nullable = false, name = "score_focus")
    private Integer scoreFocus;

    @Column(nullable = false, columnDefinition = "TEXT", name = "content")
    private String content;

    public void editReview(String content, Integer scoreTotal, Integer scoreOffice,
                           Integer scoreAmenity, Integer scoreFocus){
        this.content = content;
        this.scoreTotal = scoreTotal;
        this.scoreOffice = scoreOffice;
        this.scoreAmenity = scoreAmenity;
        this.scoreFocus = scoreFocus;
    }

}
