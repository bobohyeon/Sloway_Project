package com.sloway.app.inquiry.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum InquiryStatus {

    ANSWERED("답변완료"),
    PENDING("미답변");

    private final String label;

    InquiryStatus(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    @JsonValue
    public String getValue() {
        return name();
    }

    @JsonCreator
    public static InquiryStatus from(String value) {
        return Arrays.stream(values())
                .filter(status -> status.name().equals(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(
                        "잘못된 문의 상태값: " + value
                ));
    }

}
