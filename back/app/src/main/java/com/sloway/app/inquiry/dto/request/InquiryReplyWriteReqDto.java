package com.sloway.app.inquiry.dto.request;

import com.sloway.app.admin.entity.AdminEntity;
import com.sloway.app.inquiry.entity.InquiryEntity;
import com.sloway.app.inquiry.entity.InquiryReplyEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class InquiryReplyWriteReqDto {

    private String content;

    public InquiryReplyEntity toEntity(InquiryEntity inquiry, AdminEntity writer) {
        return InquiryReplyEntity.builder()
                .content(content)
                .inquiry(inquiry)
                .writer(writer)
                .build();
    }
}
