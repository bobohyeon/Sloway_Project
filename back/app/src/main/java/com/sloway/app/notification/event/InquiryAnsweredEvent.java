package com.sloway.app.notification.event;

public record InquiryAnsweredEvent(Long memberNo, String title, String description) implements NotificationEvent {
    @Override public Long getTargetMemberNo() { return memberNo; }
    @Override public String getTypeCode() { return "QNA"; }
    @Override public String getTitle() { return "문의"; }
    @Override public String getDescription() { return "[" + title + "]"+description; }
}