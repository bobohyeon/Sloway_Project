package com.sloway.app.review.review.dto.request;

import com.sloway.app.review.review.entity.ReviewEntity;
import lombok.Getter;

import java.util.List;

@Getter
public class ReviewEditReqDto {

    private Integer scoreTotal;
    private Integer scoreOffice;
    private Integer scoreAmenity;
    private Integer scoreFocus;
    private String content;
    private List<String> imgUrls;
}
