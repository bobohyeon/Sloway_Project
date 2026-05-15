package com.sloway.app.review.report.entity;

import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.review.review.entity.ReviewEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Table(name = "REVIEW_REPORT")
@Entity
public class ReviewReportEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @JoinColumn(name = "member_no", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private MemberEntity memberNo;

    @JoinColumn(name = "review_no", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private ReviewEntity reviewNo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "reason_type")
    private ReviewReportReasonType reasonType;

    @Column(name = "reason_detail", columnDefinition = "TEXT")
    private String reasonDetail;

    @Column(nullable = false, name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "process_at")
    private LocalDateTime processAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "process_status")
    private ReportProcessStatus processStatus;


    @PrePersist
    public void prePersist(){
        this.createdAt = LocalDateTime.now();
    }

    public void processUpdate(ReportProcessStatus status){
        this.processStatus = status;
        this.processAt = LocalDateTime.now();
    }

}
