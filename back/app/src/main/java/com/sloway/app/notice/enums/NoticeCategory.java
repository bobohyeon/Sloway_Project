package com.sloway.app.notice.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum NoticeCategory {

    SERVICE("서비스", "SERVICE"),
    EVENT("이벤트", "EVENT"),
    INSPECTION("점검", "INSPECTION"),
    OTHER("기타", "OTHER");

    private final String label;
    private final String value;

    NoticeCategory(String label, String value) {
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
    public static NoticeCategory from(String value) {
        for (NoticeCategory c : values()) {
            if (c.value.equals(value) || c.name().equals(value)) return c;
        }
        throw new IllegalArgumentException("알 수 없는 카테고리: " + value);
    }
}
