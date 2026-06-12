package com.sloway.app.chat.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ChatRoomByPlaceReqDto {
    private Long entityNo;
    private String placeType; // WORK_STAY | OFFICE | STATION
}
