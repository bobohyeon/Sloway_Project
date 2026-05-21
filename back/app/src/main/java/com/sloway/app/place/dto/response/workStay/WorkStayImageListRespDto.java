package com.sloway.app.place.dto.response.workStay;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WorkStayImageListRespDto {
    private List<ImageInfo> workStayImages;

    private List<ImageInfo> officeImages;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImageInfo {
        private Long imageNo;
        private String preview;
        private int sort;
    }
}

