package com.sloway.app.place.repository.hostPlace;

import com.sloway.app.place.entity.hostPlace.ApprovalStatus;
import com.sloway.app.place.entity.hostPlace.HostPlaceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HostPlaceRepository extends JpaRepository<HostPlaceEntity, Long>, HostPlaceRepositoryCustom {

    List<HostPlaceEntity> findByHostEntityNo(Long hostNo);

    boolean existsByHostEntityNoAndOfficeEntityNo(Long hostNo, Long officeNo);
    boolean  existsByHostEntityNoAndStationEntityNo(Long hostNo, Long stationNo);
    boolean  existsByHostEntityNoAndWorkStayEntityNo(Long hostNo, Long workStayNo);
    boolean  existsByHostEntityNoAndPlaceEntityNo(Long hostNo, Long placeNo);


    // 정산할때 필요
    List<HostPlaceEntity> findByHostEntityNoAndStatus(Long hostNo, ApprovalStatus status);
}
