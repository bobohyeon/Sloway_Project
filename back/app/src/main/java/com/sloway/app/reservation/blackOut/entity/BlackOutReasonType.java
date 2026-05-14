package com.sloway.app.reservation.blackOut.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum BlackOutReasonType {

    M("정비/보수"), C("청소"), P("개인이용"), E("기타");

    private final String code;
}
