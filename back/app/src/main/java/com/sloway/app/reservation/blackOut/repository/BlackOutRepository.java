package com.sloway.app.reservation.blackOut.repository;

import com.sloway.app.place.entity.place.PlaceEntity;
import com.sloway.app.reservation.blackOut.entity.BlackOutEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BlackOutRepository extends JpaRepository<BlackOutEntity, Long> {

    List<BlackOutEntity> findByPlaceNo(PlaceEntity placeNo);
}
