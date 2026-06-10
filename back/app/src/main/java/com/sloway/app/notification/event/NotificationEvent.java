package com.sloway.app.notification.event;

public interface NotificationEvent {
    Long getTargetMemberNo();
    String getTypeCode(); // QNA, CHT, NTC
    String getTitle();
    String getDescription();
}
