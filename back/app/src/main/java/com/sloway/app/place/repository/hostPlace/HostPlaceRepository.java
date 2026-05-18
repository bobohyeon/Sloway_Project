package com.sloway.app.place.repository.hostPlace;

import com.sloway.app.place.entity.hostPlace.HostPlaceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HostPlaceRepository extends JpaRepository<HostPlaceEntity, Long>, HostPlaceRepositoryCustom {
}
