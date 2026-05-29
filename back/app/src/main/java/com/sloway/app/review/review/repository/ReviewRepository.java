package com.sloway.app.review.review.repository;

import com.sloway.app.place.entity.place.PlaceEntity;
import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import com.sloway.app.review.review.entity.ReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> , ReviewCustomRepository{

    Optional<ReviewEntity> findByNoAndDelYn(Long no, String delYn);

    boolean existsByRsvnNoAndDelYn(RsvnEntity rsvnNo, String delYn);

    @Query("SELECT r FROM ReviewEntity r WHERE r.rsvnNo.memberNo.no = :memberNo AND r.delYn = 'N'")
    List<ReviewEntity> findMyReviews(@Param("memberNo") Long memberNo);

}
