package com.sloway.app.inquiry.entity;

import com.sloway.app.common.entity.BaseEntity;
import com.sloway.app.inquiry.enums.InquiryCategory;
import com.sloway.app.inquiry.enums.InquiryStatus;
import com.sloway.app.member.entity.MemberEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "INQUIRY")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class InquiryEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private InquiryCategory category;

    @JoinColumn(name = "WRITER_ID" , nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private MemberEntity writer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private InquiryStatus status = InquiryStatus.PENDING;

    @OneToOne(mappedBy = "inquiry", fetch = FetchType.LAZY)
    private InquiryReplyEntity reply;

    public void update(String title, String content, InquiryCategory category) {
        this.title = title;
        this.content = content;
        this.category = category;
    }

    public void answer() {
        this.status = InquiryStatus.ANSWERED;
    }

    public void cancelAnswer() {
        this.status = InquiryStatus.PENDING;
    }
}
