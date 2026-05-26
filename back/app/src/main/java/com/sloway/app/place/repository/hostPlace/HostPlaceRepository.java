package com.sloway.app.place.repository.hostPlace;

import com.sloway.app.place.entity.hostPlace.HostPlaceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HostPlaceRepository extends JpaRepository<HostPlaceEntity, Long>, HostPlaceRepositoryCustom {

    boolean existsByHostEntityNoAndOfficeEntityNo(Long hostNo, Long officeNo);
    boolean  existsByHostEntityNoAndStationEntityNo(Long hostNo, Long stationNo);
    boolean  existsByHostEntityNoAndWorkStayEntityNo(Long hostNo, Long workStayNo);
    boolean  existsByHostEntityNoAndPlaceEntityNo(Long hostNo, Long placeNo);
}
