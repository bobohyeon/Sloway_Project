package com.sloway.app.notice.dto.request;

import com.sloway.app.notice.enums.NoticeCategory;
import com.sloway.app.notice.entity.NoticeEntity;
import com.sloway.app.notice.enums.NoticeStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NoticeWriteReqDto {

    private String title;
    private String content;
    private NoticeCategory category;
    private NoticeStatus status = NoticeStatus.ACTIVE;

    public NoticeEntity toEntity() {
        return NoticeEntity.builder()
                .title(title)
                .content(content)
                .category(category)
                .status(status)
                .build();
    }
}