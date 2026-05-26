package com.sloway.app.notice.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum NoticeStatus {

    ACTIVE("active"),
    INACTIVE("inactive");

    private final String value;

    NoticeStatus(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static NoticeStatus from(String val) {
        for (NoticeStatus s : values()) {
            if (s.value.equals(val) || s.name().equals(val)) return s;
        }
        throw new IllegalArgumentException("알 수 없는 상태: " + val);
    }
}
