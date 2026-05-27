package com.sloway.app.inquiry.entity;

import com.sloway.app.admin.entity.AdminEntity;
import com.sloway.app.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "INQUIRY_REPLY")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class InquiryReplyEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @JoinColumn(name = "WRITER_ID" , nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private AdminEntity writer;

    @JoinColumn(name = "INQUIRY_ID" , nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private InquiryEntity inquiry;

    public void update(String content) {
        this.content = content;
    }
}
