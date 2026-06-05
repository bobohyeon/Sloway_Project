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
    private Long entityNo;
    private String title;
    private String type;
    private String address;
    private LocalDateTime viewAt;

    public static RecentViewedResDto from(RecentViewedEntity entity, Long entityNo){
        return RecentViewedResDto.builder()
                .no(entity.getNo())
                .placeNo(entity.getPlaceNo().getNo())
                .entityNo(entityNo)
                .title(entity.getPlaceNo().getTitle())
                .type(entity.getPlaceNo().getType())
                .address(entity.getPlaceNo().getAddress())
                .viewAt(entity.getViewAt())
                .build();
    }
}
