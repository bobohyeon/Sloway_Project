package com.sloway.app.notification.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Map;

@Entity
@Table(name = "USER_NOTIFICATION_SETTINGS")
@Getter
@NoArgsConstructor
public class UserNotificationSettingsEntity {

    @Id
    private Long memberNo;

    private boolean reviewRequest = true;
    private boolean reviewReply = true;
    private boolean chatMessage = true;
    private boolean inquiryReply = true;
    private boolean pointSaved = true;
    private boolean newCoupon = true;
    private boolean couponExpiry = true;
    private boolean eventNews = false;

    public static UserNotificationSettingsEntity defaultFor(Long memberNo) {
        UserNotificationSettingsEntity e = new UserNotificationSettingsEntity();
        e.memberNo = memberNo;
        return e;
    }

    public void update(Map<String, Boolean> pushMap) {
        if (pushMap.containsKey("reviewRequest")) this.reviewRequest = pushMap.get("reviewRequest");
        if (pushMap.containsKey("reviewReply")) this.reviewReply = pushMap.get("reviewReply");
        if (pushMap.containsKey("chatMessage")) this.chatMessage = pushMap.get("chatMessage");
        if (pushMap.containsKey("inquiryReply")) this.inquiryReply = pushMap.get("inquiryReply");
        if (pushMap.containsKey("pointSaved")) this.pointSaved = pushMap.get("pointSaved");
        if (pushMap.containsKey("newCoupon")) this.newCoupon = pushMap.get("newCoupon");
        if (pushMap.containsKey("couponExpiry")) this.couponExpiry = pushMap.get("couponExpiry");
        if (pushMap.containsKey("eventNews")) this.eventNews = pushMap.get("eventNews");
    }
}
