package com.sloway.app.review.review.repository;

import com.sloway.app.place.entity.place.PlaceEntity;
import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import com.sloway.app.review.review.entity.ReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> , ReviewCustomRepository{

    //특정 예약의 리뷰 단건 조회
    Optional<ReviewEntity> findByRsvnNo(RsvnEntity rsvnNo);
}
