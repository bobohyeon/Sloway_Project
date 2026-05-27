package com.sloway.app.notice.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum NoticeStatus {

    ACTIVE("게시중", "ACTIVE"),
    INACTIVE("미게시", "INACTIVE");

    private final String label;
    private final String value;

    NoticeStatus(String label, String value) {
        this.label = label;
        this.value = value;
    }

    public String getLabel() {
        return label;
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
