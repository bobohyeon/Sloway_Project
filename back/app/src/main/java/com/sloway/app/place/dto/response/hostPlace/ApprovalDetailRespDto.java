package com.sloway.app.place.dto.response.hostPlace;

import com.sloway.app.place.dto.request.office.OfficeReqDto;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalDetailRespDto {
    private Long id;
    private Long no;
    private String type;
    private String title;
    private String content;
    private String address;
    private String hostName;
    private Integer price;
    private Integer cnt;
    private Integer maxCnt;
    private LocalDateTime checkinTime;
    private LocalDateTime checkoutTime;

    @Setter
    private List<AmenityDto> amenities;

    @Setter
    private List<ImageDto> images;

    @Setter
    private List<ImageDto> subImages;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImageDto{
        private Long no;
        private String currentUrl;
        private Integer sortNo;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AmenityDto{
        private Long no;
        private String name;
    }

    public ApprovalDetailRespDto(Long id, Long no, String type, String title, String content,
                                 String address, String hostName, Integer price,
                                 Integer cnt, Integer maxCnt, LocalDateTime checkinTime,
                                 LocalDateTime checkoutTime) {
        this.id = id;
        this.no = no;
        this.type = type;
        this.title = title;
        this.content = content;
        this.address = address;
        this.hostName = hostName;
        this.price = price;
        this.cnt = cnt;
        this.maxCnt = maxCnt;
        this.checkinTime = checkinTime;
        this.checkoutTime = checkoutTime;
    }
}
