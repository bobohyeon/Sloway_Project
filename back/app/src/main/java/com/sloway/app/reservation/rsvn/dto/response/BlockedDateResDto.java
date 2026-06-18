package com.sloway.app.reservation.rsvn.dto.response;

import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BlockedDateResDto {

    private String startDate;
    private String endDate;

    public static BlockedDateResDto from(RsvnEntity e) {
        return BlockedDateResDto.builder()
                .startDate(e.getCheckIn().toLocalDate().toString())
                .endDate(e.getCheckOut().toLocalDate().toString())
                .build();
    }
}
