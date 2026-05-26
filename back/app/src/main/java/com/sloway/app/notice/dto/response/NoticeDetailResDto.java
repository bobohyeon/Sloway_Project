package com.sloway.app.notice.dto.response;

import com.sloway.app.notice.entity.NoticeCategory;
import com.sloway.app.notice.entity.NoticeEntity;
import com.sloway.app.notice.entity.NoticeStatus;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class NoticeDetailResDto {

    private final Long id;
    private final String title;
    private final String content;
    private final NoticeCategory category;
    private final NoticeStatus status;
    private final Long viewCount;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    private NoticeDetailResDto(NoticeEntity e) {
        this.id = e.getId();
        this.title = e.getTitle();
        this.content = e.getContent();
        this.category = e.getCategory();
        this.status = e.getStatus();
        this.viewCount = e.getViewCount();
        this.createdAt = e.getCreatedAt();
        this.updatedAt = e.getModifiedAt();
    }

    public static NoticeDetailResDto from(NoticeEntity entity) {
        return new NoticeDetailResDto(entity);
    }
}