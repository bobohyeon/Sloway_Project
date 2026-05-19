package com.sloway.app.recent.keyword.dto.response;

import com.sloway.app.recent.keyword.entity.RecentKeywordEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class RecentKeywordResDto {

    private Long no;
    private String keyword;
    private LocalDateTime searchedAt;

    public static RecentKeywordResDto from(RecentKeywordEntity entity){
        return RecentKeywordResDto.builder()
                .no(entity.getNo())
                .keyword(entity.getKeyword())
                .searchedAt(entity.getSearchedAt())
                .build();
    }
}
