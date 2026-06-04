package com.sloway.app.faq.dto.response.admin;

import com.sloway.app.faq.entity.FaqEntity;
import com.sloway.app.faq.enums.FaqCategory;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class AdminFaqListResDto {

    private Long id;
    private String title;
    private FaqCategory category;
    private String writerName;
    private LocalDateTime createdAt;

    public AdminFaqListResDto(FaqEntity e) {
        this.id = e.getId();
        this.title = e.getTitle();
        this.category = e.getCategory();
        this.writerName = e.getWriter().getName();
        this.createdAt = e.getCreatedAt();
    }

    public static AdminFaqListResDto from(FaqEntity entity) {
        return new AdminFaqListResDto(entity);
    }
}
