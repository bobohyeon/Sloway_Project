package com.sloway.app.review.reply.entity;

import com.sloway.app.host.entity.HostEntity;
import com.sloway.app.review.review.entity.ReviewEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Table(name = "REVIEW_REPLY")
@Entity
public class ReviewReplyEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @JoinColumn(name = "review_no", nullable = false, unique = true)
    @ManyToOne(fetch = FetchType.LAZY)
    private ReviewEntity reviewNo;

    @JoinColumn(name = "host_no")
    @ManyToOne(fetch = FetchType.LAZY)
    private HostEntity hostNo;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "del_at")
    private LocalDateTime delAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    public void deleteReviewReply() {
        this.delAt = LocalDateTime.now();
    }

    public void editReviewReply(String content){
        this.content = content;
    }
}
