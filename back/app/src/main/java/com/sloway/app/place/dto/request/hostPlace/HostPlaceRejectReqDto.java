package com.sloway.app.place.dto.request.hostPlace;

import com.sloway.app.place.entity.hostPlace.HostPlaceEntity;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class HostPlaceRejectReqDto {
    private String rejectedReason;

    public HostPlaceEntity toEntity(){
        return HostPlaceEntity.builder()
                .rejectedReason(rejectedReason)
                .build();
    }
}
