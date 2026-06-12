package com.sloway.app.notification.event;

public record InquiryAnsweredEvent(Long memberNo, Long targetNo, String title, String description) implements NotificationEvent {
    @Override public Long getTargetMemberNo() { return memberNo; }
    @Override public Long getTargetNo() { return targetNo; }
    @Override public String getTypeCode() { return "INQUIRY"; }
    @Override public String getTitle() { return "문의"; }
    @Override public String getDescription() { return "[" + title + "]"+description; }
}