package com.sloway.app.faq.dto.response.user;

import com.sloway.app.faq.entity.FaqEntity;
import com.sloway.app.faq.enums.FaqCategory;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class FaqListResDto {

    private Long id;
    private String title;
    private String content;
    private FaqCategory category;
    private LocalDateTime createdAt;

    public FaqListResDto(FaqEntity e) {
        this.id = e.getId();
        this.title = e.getTitle();
        this.content = e.getContent();
        this.category = e.getCategory();
        this.createdAt = e.getCreatedAt();
    }

    public static FaqListResDto from(FaqEntity entity) { return new FaqListResDto(entity); }
}
