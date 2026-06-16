package com.sloway.app.review.helpful.entity;

import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.review.review.entity.ReviewEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Table(name = "HELPFUL",
        uniqueConstraints = { @UniqueConstraint(columnNames = {"user_no", "review_no"}) },
        indexes = { @Index(name = "idx_helpful_user_no", columnList = "user_no"),
                    @Index(name = "idx_helpful_review_no", columnList = "review_no")
})
@Entity
public class HelpfulEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @JoinColumn(name = "user_no", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private MemberEntity memberNo;

    @JoinColumn(name = "review_no", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private ReviewEntity reviewNo;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist(){
        this.createdAt = LocalDateTime.now();
    }
}
