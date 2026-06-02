package com.sloway.app.notice.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum NoticeCategory {

    SERVICE("서비스"),
    EVENT("이벤트"),
    INSPECTION("점검"),
    OTHER("기타");

    private final String label;

    NoticeCategory(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }


    @JsonCreator
    public static NoticeCategory from(String value) {
        for (NoticeCategory c : values()) {
            if (c.name().equals(value) || c.label.equals(value)) return c;
        }
        throw new IllegalArgumentException("알 수 없는 카테고리: " + value);
    }
}
