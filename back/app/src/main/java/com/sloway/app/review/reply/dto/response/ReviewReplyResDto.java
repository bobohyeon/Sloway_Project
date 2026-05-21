package com.sloway.app.review.reply.dto.response;

import com.sloway.app.review.reply.entity.ReviewReplyEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ReviewReplyResDto {

    private Long no;
    private Long reviewNo;
    private Long hostNo;
    private String content;
    private LocalDateTime createdAt;
}
