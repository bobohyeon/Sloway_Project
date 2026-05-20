package com.sloway.app.review.review.repository;

import com.sloway.app.place.entity.place.PlaceEntity;
import com.sloway.app.review.review.entity.ReviewEntity;

import java.util.List;

public interface ReviewCustomRepository {

    List<ReviewEntity> findByPlaceNo(PlaceEntity placeNo);
}
