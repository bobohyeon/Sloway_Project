package com.sloway.app.recent.viewed.dto.response;

import com.sloway.app.recent.viewed.entity.RecentViewedEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class RecentViewedResDto {

    private Long no;
    private Long placeNo;
    private LocalDateTime viewAt;

    public static RecentViewedResDto from(RecentViewedEntity entity){
        return RecentViewedResDto.builder()
                .no(entity.getNo())
                .placeNo(entity.getPlaceNo().getNo())
                .viewAt(entity.getViewAt())
                .build();
    }
}
