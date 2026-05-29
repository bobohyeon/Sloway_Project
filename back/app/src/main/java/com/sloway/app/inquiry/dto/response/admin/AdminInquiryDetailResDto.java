package com.sloway.app.inquiry.dto.response.admin;

import com.sloway.app.inquiry.entity.InquiryEntity;
import com.sloway.app.inquiry.enums.InquiryCategory;
import com.sloway.app.inquiry.enums.InquiryStatus;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class AdminInquiryDetailResDto {
    private Long id;
    private String title;
    private String content;
    private String writerName;
    private InquiryCategory category;
    private InquiryStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime answeredAt;
    private String replyContent;

    private AdminInquiryDetailResDto(InquiryEntity e) {
        this.id = e.getId();
        this.title = e.getTitle();
        this.content = e.getContent();
        this.writerName = e.getWriter().getName();
        this.category = e.getCategory();
        this.status = e.getStatus();
        this.createdAt = e.getCreatedAt();
        this.answeredAt = e.getReply() != null ? e.getReply().getCreatedAt() : null;
        this.replyContent = e.getReply() != null ? e.getReply().getContent() : null;
    }

    public static AdminInquiryDetailResDto from(InquiryEntity entity) {
        return new AdminInquiryDetailResDto(entity);
    }

}
