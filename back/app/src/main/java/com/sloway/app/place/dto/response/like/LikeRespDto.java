package com.sloway.app.place.dto.response.like;

import com.sloway.app.place.entity.like.LikeEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LikeRespDto {

    private Long no;
    private Long placeNo;
    private String placeTitle;
    private String thumbnail;
    private String type;
    private String address;
    private int price;
    private Double rating;
    private LocalDateTime createdAt;

}
