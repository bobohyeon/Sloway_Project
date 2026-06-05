package com.sloway.app.review.review.repository;

import com.querydsl.core.Tuple;
import com.sloway.app.place.entity.place.PlaceEntity;
import com.sloway.app.review.review.dto.PeriodType;
import com.sloway.app.review.review.entity.ReviewEntity;

import java.util.List;

public interface ReviewCustomRepository {

    List<ReviewEntity> findByEntityNo(Long entityNo, String type);

    List<ReviewEntity> findByHostFilter(PlaceEntity placeEntity, Integer minScore, PeriodType period);

    // 호스트 공간(placeNo 목록)의 리뷰 평균 평점·개수 — Tuple(avg(Double), count(Long))
    Tuple findHostReviewStats(List<Long> placeNos);
}
