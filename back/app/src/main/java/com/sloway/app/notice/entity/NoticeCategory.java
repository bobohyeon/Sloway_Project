package com.sloway.app.notice.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum NoticeCategory {

    SERVICE("서비스"),
    EVENT("이벤트"),
    INSPECTION("점검"),
    OTHER("기타");

    private final String label;

    NoticeCategory(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static NoticeCategory from(String value) {
        for (NoticeCategory c : values()) {
            if (c.label.equals(value) || c.name().equals(value)) return c;
        }
        throw new IllegalArgumentException("알 수 없는 카테고리: " + value);
    }
}
