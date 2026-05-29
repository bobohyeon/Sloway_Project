package com.sloway.app.inquiry.dto.request.user;

import com.sloway.app.inquiry.entity.InquiryEntity;
import com.sloway.app.inquiry.enums.InquiryCategory;
import com.sloway.app.member.entity.MemberEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class InquiryCreateReqDto {

    private String title;
    private String content;
    private InquiryCategory category;

    public InquiryEntity toEntity(MemberEntity writer) {
        return InquiryEntity.builder()
                .title(title)
                .content(content)
                .category(category)
                .writer(writer)
                .build();
    }
}
