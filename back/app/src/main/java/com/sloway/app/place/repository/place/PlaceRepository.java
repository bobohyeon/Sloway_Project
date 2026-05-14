package com.sloway.app.place.repository.place;

import com.sloway.app.place.entity.place.PlaceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PlaceRepository extends JpaRepository<PlaceEntity, Long>, PlaceRepositoryCustom {

    Optional<PlaceEntity> findByNo(Long no);
}
