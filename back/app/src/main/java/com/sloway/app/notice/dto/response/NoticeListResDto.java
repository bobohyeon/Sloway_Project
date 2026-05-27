package com.sloway.app.notice.dto.response;

import com.sloway.app.notice.enums.NoticeCategory;
import com.sloway.app.notice.entity.NoticeEntity;
import com.sloway.app.notice.enums.NoticeStatus;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class NoticeListResDto {

    private final Long id;
    private final String title;
    private final NoticeCategory category;
    private final NoticeStatus status;
    private final Long viewCount;
    private final LocalDateTime createdAt;

    private NoticeListResDto(NoticeEntity e) {
        this.id = e.getId();
        this.title = e.getTitle();
        this.category = e.getCategory();
        this.status = e.getStatus();
        this.viewCount = e.getViewCount();
        this.createdAt = e.getCreatedAt();
    }

    public static NoticeListResDto from(NoticeEntity entity) {
        return new NoticeListResDto(entity);
    }
}