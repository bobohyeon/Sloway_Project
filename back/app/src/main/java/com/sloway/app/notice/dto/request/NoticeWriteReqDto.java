package com.sloway.app.notice.dto.request;

import com.sloway.app.notice.enums.NoticeCategory;
import com.sloway.app.notice.entity.NoticeEntity;
import lombok.Getter;

@Getter
public class NoticeWriteReqDto {

    private String title;
    private String content;
    private NoticeCategory category;

    public NoticeEntity toEntity() {
        return NoticeEntity.builder()
                .title(title)
                .content(content)
                .category(category)
                .build();
    }
}