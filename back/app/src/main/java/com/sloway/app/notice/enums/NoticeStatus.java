package com.sloway.app.notice.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum NoticeStatus {

    ACTIVE("게시중"),
    INACTIVE("미게시");

    private final String label;

    NoticeStatus(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }


    @JsonCreator
    public static NoticeStatus from(String val) {
        for (NoticeStatus s : values()) {
            if (s.name().equals(val) || s.label.equals(val)) return s;
        }
        throw new IllegalArgumentException("알 수 없는 상태: " + val);
    }
}
