package com.sloway.app.notification.entity;

import com.fasterxml.jackson.annotation.JsonValue;

public enum NotificationType {
    CHAT, RESERVATION, PAYMENT, POINT, COUPON, REVIEW, INQUIRY, EVENT,
    SETTLEMENT, POLICY, CHECKIN, NOTICE;

    @JsonValue
    public String getValue() {
        return name().toLowerCase();
    }
}
