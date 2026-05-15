package com.sloway.app.place.dto.request.workStay;

import com.sloway.app.place.dto.request.workStay.workOffice.WorkOfficeUpdateReqDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WorkUpdateDtoWrapper {
    // 필드명이 프론트엔드에서 보내는 JSON의 Key값이 됩니다.
    private WorkStayUpdateReqDto stay;
    private WorkOfficeUpdateReqDto office;
}