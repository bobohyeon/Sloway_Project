package com.sloway.app.notification.event;

public record NoticeEvent(Long memberNo, String title, String description) implements NotificationEvent {
    @Override public Long getTargetMemberNo() { return memberNo; }
    @Override public String getTypeCode() { return "NTC"; }
    @Override public String getTitle() { return "공지"; }
    @Override public String getDescription() { return "[" + title + "]가 등록되었습니다."; }
}
