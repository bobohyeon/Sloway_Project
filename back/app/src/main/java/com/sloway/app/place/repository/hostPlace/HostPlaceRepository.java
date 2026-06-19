package com.sloway.app.place.repository.hostPlace;

import com.sloway.app.place.entity.hostPlace.ApprovalStatus;
import com.sloway.app.place.entity.hostPlace.HostPlaceEntity;
import com.sloway.app.place.entity.office.OfficeEntity;
import com.sloway.app.place.entity.station.StationEntity;
import com.sloway.app.place.entity.workStay.WorkStayEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HostPlaceRepository extends JpaRepository<HostPlaceEntity, Long>, HostPlaceRepositoryCustom {

    List<HostPlaceEntity> findByHostEntityNo(Long hostNo);

    boolean existsByHostEntityNoAndOfficeEntityNo(Long hostNo, Long officeNo);
    boolean  existsByHostEntityNoAndStationEntityNo(Long hostNo, Long stationNo);
    boolean  existsByHostEntityNoAndWorkStayEntityNo(Long hostNo, Long workStayNo);
    boolean  existsByHostEntityNoAndPlaceEntityNo(Long hostNo, Long placeNo);


    // 정산할때 필요
    List<HostPlaceEntity> findByHostEntityNoAndStatus(Long hostNo, ApprovalStatus status);

    Optional<HostPlaceEntity> findByWorkStayEntity(WorkStayEntity workStayEntity);
    Optional<HostPlaceEntity> findByOfficeEntity(OfficeEntity officeEntity);
    Optional<HostPlaceEntity> findByStationEntity(StationEntity stationEntity);

    // 같은 공간에 대해 재신청 등으로 HOST_PLACE 행이 여러 개 존재할 수 있어
    // findBy*Entity 단독 사용 시 NonUniqueResultException 발생 → 승인(A) 행만 조회하도록 status 조건 추가 by 현종
    Optional<HostPlaceEntity> findByWorkStayEntityAndStatus(WorkStayEntity workStayEntity, ApprovalStatus status);
    Optional<HostPlaceEntity> findByOfficeEntityAndStatus(OfficeEntity officeEntity, ApprovalStatus status);
    Optional<HostPlaceEntity> findByStationEntityAndStatus(StationEntity stationEntity, ApprovalStatus status);
}
