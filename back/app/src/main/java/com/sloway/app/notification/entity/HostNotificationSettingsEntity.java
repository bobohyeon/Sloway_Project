package com.sloway.app.notification.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Map;

@Entity
@Table(name = "HOST_NOTIFICATION_SETTINGS")
@Getter
@NoArgsConstructor
public class HostNotificationSettingsEntity {

    @Id
    private Long memberNo;

    private boolean settlementSchedule = true;
    private boolean settlementComplete = true;
    private boolean taxInvoice = true;
    private boolean chatMessage = true;
    private boolean newReview = true;
    private boolean lowRatingAlert = true;

    public static HostNotificationSettingsEntity defaultFor(Long memberNo) {
        HostNotificationSettingsEntity e = new HostNotificationSettingsEntity();
        e.memberNo = memberNo;
        return e;
    }

    public void update(Map<String, Boolean> pushMap) {
        if (pushMap.containsKey("settlementSchedule")) this.settlementSchedule = pushMap.get("settlementSchedule");
        if (pushMap.containsKey("settlementComplete")) this.settlementComplete = pushMap.get("settlementComplete");
        if (pushMap.containsKey("taxInvoice")) this.taxInvoice = pushMap.get("taxInvoice");
        if (pushMap.containsKey("chatMessage")) this.chatMessage = pushMap.get("chatMessage");
        if (pushMap.containsKey("newReview")) this.newReview = pushMap.get("newReview");
        if (pushMap.containsKey("lowRatingAlert")) this.lowRatingAlert = pushMap.get("lowRatingAlert");
    }
}
