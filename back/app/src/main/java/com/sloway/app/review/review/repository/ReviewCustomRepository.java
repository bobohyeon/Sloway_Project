package com.sloway.app.review.review.repository;

import com.sloway.app.place.entity.place.PlaceEntity;
import com.sloway.app.review.review.dto.PeriodType;
import com.sloway.app.review.review.entity.ReviewEntity;

import java.util.List;

public interface ReviewCustomRepository {

    List<ReviewEntity> findByPlaceNo(PlaceEntity placeNo);

    List<ReviewEntity> findByHostFilter(PlaceEntity placeEntity, Integer minScore, PeriodType period);
}
