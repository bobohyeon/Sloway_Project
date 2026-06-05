package com.sloway.app.place.dto.response.place;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@ToString
public class WorkStayCardDto {

    private Long workStayNo;
    private String title;
    private String address;
    private String mainImageUrl;
    private Integer price;
    private List<String> amenities;

    private Long placeNo; //추가(보현)

}
