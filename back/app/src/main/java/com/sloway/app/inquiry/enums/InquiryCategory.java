package com.sloway.app.inquiry.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum InquiryCategory {

    RESERVATION("예약", "RESERVATION"),
    PAYMENT("결제", "PAYMENT"),
    PLACE("공간", "PLACE"),
    OTHER("기타", "OTHER");

    private final String label;
    private final String value;

    InquiryCategory(String label, String value) {
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
    public static InquiryCategory from(String value) {
        for (InquiryCategory c : values()) {
            if (c.value.equals(value) || c.name().equals(value)) return c;
        }
        throw new IllegalArgumentException("알 수 없는 카테고리: " + value);
    }
}
