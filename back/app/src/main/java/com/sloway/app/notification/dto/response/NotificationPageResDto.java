package com.sloway.app.notification.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.data.domain.Page;

import java.util.List;

@Getter
@AllArgsConstructor
public class NotificationPageResDto {

    private List<NotificationResDto> content;
    private int totalPages;
    private long totalElements;
    private long unreadCount;

    public static NotificationPageResDto of(Page<NotificationResDto> page, long unreadCount) {
        return new NotificationPageResDto(
                page.getContent(),
                page.getTotalPages(),
                page.getTotalElements(),
                unreadCount
        );
    }
}
