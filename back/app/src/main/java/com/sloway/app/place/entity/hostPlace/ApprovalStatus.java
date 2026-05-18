package com.sloway.app.place.entity.hostPlace;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ApprovalStatus {

    P("PENDIG"), A("APPROVED"), R("REJECTED");

    private final String code;
}
