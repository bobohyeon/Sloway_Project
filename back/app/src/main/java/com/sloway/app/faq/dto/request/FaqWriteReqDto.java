package com.sloway.app.faq.dto.request;

import com.sloway.app.admin.entity.AdminEntity;
import com.sloway.app.faq.entity.FaqEntity;
import com.sloway.app.faq.enums.FaqCategory;
import lombok.Getter;

@Getter
public class FaqWriteReqDto {

    private String title;
    private String content;
    private FaqCategory category;

    public FaqEntity toEntity(AdminEntity writer) {
        return FaqEntity.builder()
                .title(title)
                .content(content)
                .category(category)
                .writer(writer)
                .build();
    }

}
