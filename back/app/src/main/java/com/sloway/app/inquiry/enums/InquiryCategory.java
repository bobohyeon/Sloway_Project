package com.sloway.app.inquiry.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum InquiryCategory {

    RESERVATION("예약"),
    PAYMENT("결제"),
    PLACE("공간"),
    OTHER("기타");

    private final String label;

    InquiryCategory(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    @JsonValue
    public String getValue() {
        return name(); // value 필드 없이 name() 직접 사용
    }

    @JsonCreator
    public static InquiryCategory from(String value) {
        return Arrays.stream(values())
                .filter(c -> c.name().equals(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(
                        "알 수 없는 카테고리: " + value
                ));
    }
}