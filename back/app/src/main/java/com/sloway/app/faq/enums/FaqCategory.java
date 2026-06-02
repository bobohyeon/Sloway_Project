package com.sloway.app.faq.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum FaqCategory {

    RESERVATION("예약"),
    PAYMENT("결제"),
    CANCEL("취소"),
    REFUND("환불"),
    ACCOUNT("계정"),
    SERVICE("서비스 이용"),
    OTHER("기타");

    private final String label;

    FaqCategory(String label) {
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
    public static FaqCategory from(String value) {
        for (FaqCategory c : values()) {
            if (c.name().equals(value) || c.label.equals(value)) return c;
        }
        throw new IllegalArgumentException("알 수 없는 카테고리: " + value);
    }
}
