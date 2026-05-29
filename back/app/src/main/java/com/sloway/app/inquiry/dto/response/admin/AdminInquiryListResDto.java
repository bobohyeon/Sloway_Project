package com.sloway.app.inquiry.dto.response.admin;

import com.sloway.app.inquiry.entity.InquiryEntity;
import com.sloway.app.inquiry.enums.InquiryCategory;
import com.sloway.app.inquiry.enums.InquiryStatus;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class AdminInquiryListResDto {

    private Long id;
    private String title;
    private String writerName;
    private InquiryCategory category;
    private InquiryStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime answeredAt;

    private AdminInquiryListResDto(InquiryEntity e) {
        this.id = e.getId();
        this.title = e.getTitle();
        this.writerName = e.getWriter().getName();
        this.category = e.getCategory();
        this.status = e.getStatus();
        this.createdAt = e.getCreatedAt();
        this.answeredAt = e.getReply() != null ? e.getReply().getCreatedAt():null;
    }

    public static AdminInquiryListResDto from(InquiryEntity entity) {
        return new AdminInquiryListResDto(entity);
    }
}
