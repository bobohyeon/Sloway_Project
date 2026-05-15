package com.sloway.app.review.review.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Table(name = "REVIEW_IMG")
@Entity
public class ReviewImgEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @JoinColumn(name = "review_no")
    @ManyToOne(fetch = FetchType.LAZY)
    private ReviewEntity reviewNo;

    @Column(length = 300)
    private String currentUrl;

}
