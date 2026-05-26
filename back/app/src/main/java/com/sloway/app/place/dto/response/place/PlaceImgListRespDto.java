package com.sloway.app.place.dto.response.place;

import lombok.*;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PlaceImgListRespDto {

    private List<ImageInfo> placeImages;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @ToString
    public static class ImageInfo {
        private Long imageNo;
        private String preview;
        private int sort;
    }
}
