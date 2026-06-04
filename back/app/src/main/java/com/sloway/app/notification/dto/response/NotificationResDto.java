package com.sloway.app.notification.dto.response;

import com.sloway.app.notification.entity.NotificationEntity;
import com.sloway.app.notification.entity.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.EnumMap;
import java.util.Map;

@Getter
@AllArgsConstructor
public class NotificationResDto {

    private Long id;
    private NotificationType type;
    private String category;
    private String title;
    private String description;
    private String timeLabel;
    private Boolean isRead;

    private static final Map<NotificationType, String> CATEGORY_MAP = new EnumMap<>(NotificationType.class);
    static {
        CATEGORY_MAP.put(NotificationType.CHAT, "채팅");
        CATEGORY_MAP.put(NotificationType.RESERVATION, "예약");
        CATEGORY_MAP.put(NotificationType.PAYMENT, "결제");
        CATEGORY_MAP.put(NotificationType.POINT, "포인트");
        CATEGORY_MAP.put(NotificationType.COUPON, "쿠폰");
        CATEGORY_MAP.put(NotificationType.REVIEW, "리뷰");
        CATEGORY_MAP.put(NotificationType.INQUIRY, "문의");
        CATEGORY_MAP.put(NotificationType.EVENT, "이벤트");
        CATEGORY_MAP.put(NotificationType.SETTLEMENT, "정산");
        CATEGORY_MAP.put(NotificationType.POLICY, "정책");
        CATEGORY_MAP.put(NotificationType.CHECKIN, "체크인");
        CATEGORY_MAP.put(NotificationType.NOTICE, "공지");
    }

    public static NotificationResDto from(NotificationEntity entity) {
        return new NotificationResDto(
                entity.getId(),
                entity.getType(),
                CATEGORY_MAP.getOrDefault(entity.getType(), entity.getType().name()),
                entity.getTitle(),
                entity.getDescription(),
                formatTimeLabel(entity.getCreatedAt()),
                entity.isRead()
        );
    }

    private static String formatTimeLabel(LocalDateTime createdAt) {
        long minutes = ChronoUnit.MINUTES.between(createdAt, LocalDateTime.now());
        if (minutes < 1) return "방금 전";
        if (minutes < 60) return minutes + "분 전";
        long hours = minutes / 60;
        if (hours < 24) return hours + "시간 전";
        long days = hours / 24;
        if (days == 1) return "어제";
        if (days < 7) return days + "일 전";
        return (days / 7) + "주 전";
    }
}
