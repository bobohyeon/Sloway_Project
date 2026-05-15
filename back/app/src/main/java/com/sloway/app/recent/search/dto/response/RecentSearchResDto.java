package com.sloway.app.recent.search.dto.response;

import com.sloway.app.recent.search.entity.RecentSearchEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class RecentSearchResDto {

    private Long no;
    private String keyword;
    private LocalDateTime searchedAt;

    public static RecentSearchResDto from(RecentSearchEntity entity){
        return RecentSearchResDto.builder()
                .no(entity.getNo())
                .keyword(entity.getKeyword())
                .searchedAt(entity.getSearchedAt())
                .build();
    }
}
