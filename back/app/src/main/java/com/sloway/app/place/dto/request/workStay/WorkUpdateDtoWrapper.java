package com.sloway.app.place.dto.request.workStay;

import com.sloway.app.place.dto.request.workStay.workOffice.WorkOfficeUpdateReqDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WorkUpdateDtoWrapper {
    private WorkStayUpdateReqDto stay;
    private WorkOfficeUpdateReqDto office;
}