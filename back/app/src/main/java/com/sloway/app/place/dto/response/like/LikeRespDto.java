package com.sloway.app.place.dto.response.like;

import com.sloway.app.place.entity.like.LikeEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class LikeRespDto {

    private Long no;
    private String placeTitle;
    private LocalDateTime createdAt;

    public LikeRespDto(Long likeNo, String placeTitle, LocalDateTime createdAt) {
        this.no = likeNo;
        this.placeTitle = placeTitle;
        this.createdAt = createdAt;
    }
}
