package com.sloway.app.reservation.rsvn.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum RsvnStatus {

    S("예약확정"), R("예약거절"), C("예약취소"),E("이용완료");

    private final String code;
}
