package com.sloway.app.inquiry.dto.request;

import com.sloway.app.inquiry.entity.InquiryEntity;
import com.sloway.app.inquiry.enums.InquiryCategory;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
public class InquiryWriteReqDto {

    private String title;
    private String content;
    private InquiryCategory category;

    public InquiryEntity toEntity() {
        return InquiryEntity.builder()
                .title(title)
                .content(content)
                .category(category)
                .build();
    }
}
