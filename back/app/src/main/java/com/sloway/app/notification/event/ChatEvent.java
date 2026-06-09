package com.sloway.app.notification.event;

public record ChatEvent(Long memberNo, String title, String description) implements NotificationEvent {
    @Override public Long getTargetMemberNo() { return memberNo; }
    @Override public String getTypeCode() { return "CHAT"; }
    @Override public String getTitle() { return "채팅"; }
    @Override public String getDescription() { return "[" + title + "]가 수신 되었습니다."; }
}

