package com.sloway.app.recent.place.dto.response;

import com.sloway.app.recent.place.entity.RecentPlaceEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class RecentPlaceResDto {

    private Long no;
    private Long placeNo;
    private LocalDateTime viewAt;

    public static RecentPlaceResDto from(RecentPlaceEntity entity){
        return RecentPlaceResDto.builder()
                .no(entity.getNo())
                .placeNo(entity.getPlaceNo().getNo())
                .viewAt(entity.getViewAt())
                .build();
    }
}
