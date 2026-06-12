package com.sloway.app.notification.event;

public interface NotificationEvent {
    Long getTargetMemberNo();
    Long getTargetNo();
    String getTypeCode(); // QNA, CHT, NTC
    String getTitle();
    String getDescription();
}
