package com.sloway.app.inquiry.dto.response.user;

import com.sloway.app.inquiry.entity.InquiryEntity;
import com.sloway.app.inquiry.enums.InquiryCategory;
import com.sloway.app.inquiry.enums.InquiryStatus;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class MyInquiryDetailResDto {

        private Long id;
        private String title;
        private String content;
        private InquiryCategory category;
        private InquiryStatus status;
        private LocalDateTime createdAt;
        private LocalDateTime answeredAt;
        private String replyContent;

        private MyInquiryDetailResDto(InquiryEntity e) {
            this.id = e.getId();
            this.title = e.getTitle();
            this.content = e.getContent();
            this.category = e.getCategory();
            this.status = e.getStatus();
            this.createdAt = e.getCreatedAt();
            this.answeredAt = e.getReply() != null ? e.getReply().getCreatedAt() : null;
            this.replyContent = e.getReply() != null ? e.getReply().getContent() : null;
        }

        public static MyInquiryDetailResDto from(InquiryEntity entity) {
            return new MyInquiryDetailResDto(entity);
        }
    }

