package com.sloway.app.review.review.dto.response;

import lombok.Builder;
import lombok.Getter;

/**
 * 어드민 호스트 상세 — 리뷰 통계.
 * 호스트가 운영하는 공간들의 리뷰 평균 평점(scoreTotal)·총 개수.
 */
@Getter
@Builder
public class HostReviewStatsResDto {

    private double averageRating; // 평균 평점 (리뷰 없으면 0.0)
    private long reviewCount;     // 리뷰 총 개수

    public static HostReviewStatsResDto of(double averageRating, long reviewCount) {
        return HostReviewStatsResDto.builder()
                .averageRating(averageRating)
                .reviewCount(reviewCount)
                .build();
    }
}
