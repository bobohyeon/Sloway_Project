package com.sloway.app.search.placeDetail.service;

import com.sloway.app.common.exception.CustomException;
import com.sloway.app.place.entity.office.OfficeEntity;
import com.sloway.app.place.entity.station.StationEntity;
import com.sloway.app.place.entity.workStay.WorkStayEntity;
import com.sloway.app.place.entity.workStay.workOffice.WorkOfficeEntity;
import com.sloway.app.place.repository.workStay.workOffice.WorkOfficeRepository;
import com.sloway.app.reservation.RsvnErrorCode;
import com.sloway.app.search.placeDetail.dto.PlaceDetailResDto;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
@Service
public class PlaceDetailService {

    // 트랜잭션이 끝나기 전에 필요한 컬렉션 로딩 — officePeriodEntities는 JOIN FETCH로 확실하게
    @PersistenceContext
    private EntityManager em;

    private final WorkOfficeRepository workOfficeRepository;

    // workstay/office/station(소문자) → WORK_STAY/OFFICE/STATION 정규화
    // DB 뷰(place_summary)와 PlaceEntity 간 타입명 불일치 방어
    private String normalizeType(String type) {
        if (type == null || type.isBlank()) return null;
        return switch (type.toLowerCase().replace("_", "")) {
            case "workstay" -> "WORK_STAY";
            case "office"   -> "OFFICE";
            case "station"  -> "STATION";
            default         -> null; // 알 수 없는 값 → tryAll로 폴백
        };
    }

    // type 있으면 해당 타입만 조회, null이면 세 타입 순서대로 탐색 (메인 페이지 등 type 모를 때)
    public List<PlaceDetailResDto> findByEntityNo(Long placeNo, String type) {

        String normalized = normalizeType(type);
        boolean tryAll = (normalized == null);

        if (tryAll || "WORK_STAY".equals(normalized)) {
            List<WorkStayEntity> wsList = em.createQuery(
                            "SELECT DISTINCT ws FROM WorkStayEntity ws LEFT JOIN FETCH ws.workExceptionPeriodEntities WHERE ws.placeEntity.no = :no", WorkStayEntity.class)
                    .setParameter("no", placeNo).getResultList();
            if (!wsList.isEmpty()) return wsList.stream().map(ws -> PlaceDetailResDto.from(ws, List.of())).toList();
            // placeEntity.no로 못 찾은 경우 entity PK(targetNo)로 재시도
            if (!tryAll) return findByTypeAndEntityNo("WORK_STAY", placeNo);
        }

        if (tryAll || "OFFICE".equals(normalized)) {
            List<OfficeEntity> oList = em.createQuery(
                            "SELECT DISTINCT o FROM OfficeEntity o LEFT JOIN FETCH o.officePeriodEntities WHERE o.placeEntity.no = :no",
                            OfficeEntity.class)
                    .setParameter("no", placeNo).getResultList();
            if (!oList.isEmpty()) return oList.stream().map(PlaceDetailResDto::from).toList();
            if (!tryAll) return findByTypeAndEntityNo("OFFICE", placeNo);
        }

        if (tryAll || "STATION".equals(normalized)) {
            List<StationEntity> stList = em.createQuery(
                            "SELECT DISTINCT s FROM StationEntity s LEFT JOIN FETCH s.stationExceptionPeriodEntities WHERE s.placeEntity.no = :no", StationEntity.class)
                    .setParameter("no", placeNo).getResultList();
            if (!stList.isEmpty()) return stList.stream().map(PlaceDetailResDto::from).toList();
            if (!tryAll) return findByTypeAndEntityNo("STATION", placeNo);
        }

        // tryAll이면서 placeEntity.no로도 못 찾은 경우 — entity PK로 최종 탐색
        return findByDirectEntityNo(placeNo);
    }

    // type 알고 있지만 placeEntity.no로 못 찾은 경우 — entity PK로 재시도 후 같은 place 방 전체 반환
    private List<PlaceDetailResDto> findByTypeAndEntityNo(String type, Long entityNo) {
        if ("WORK_STAY".equals(type)) {
            List<WorkStayEntity> list = em.createQuery(
                    "SELECT DISTINCT ws FROM WorkStayEntity ws LEFT JOIN FETCH ws.workExceptionPeriodEntities WHERE ws.no = :no",
                    WorkStayEntity.class).setParameter("no", entityNo).getResultList();
            if (!list.isEmpty()) {
                Long realPlaceNo = list.get(0).getPlaceEntity().getNo();
                return em.createQuery(
                        "SELECT DISTINCT ws FROM WorkStayEntity ws LEFT JOIN FETCH ws.workExceptionPeriodEntities WHERE ws.placeEntity.no = :no",
                        WorkStayEntity.class).setParameter("no", realPlaceNo).getResultList()
                        .stream().map(ws -> PlaceDetailResDto.from(ws, List.of())).toList();
            }
        }
        if ("OFFICE".equals(type)) {
            List<OfficeEntity> list = em.createQuery(
                    "SELECT DISTINCT o FROM OfficeEntity o LEFT JOIN FETCH o.officePeriodEntities WHERE o.no = :no",
                    OfficeEntity.class).setParameter("no", entityNo).getResultList();
            if (!list.isEmpty()) {
                Long realPlaceNo = list.get(0).getPlaceEntity().getNo();
                return em.createQuery(
                        "SELECT DISTINCT o FROM OfficeEntity o LEFT JOIN FETCH o.officePeriodEntities WHERE o.placeEntity.no = :no",
                        OfficeEntity.class).setParameter("no", realPlaceNo).getResultList()
                        .stream().map(PlaceDetailResDto::from).toList();
            }
        }
        if ("STATION".equals(type)) {
            List<StationEntity> list = em.createQuery(
                    "SELECT DISTINCT s FROM StationEntity s LEFT JOIN FETCH s.stationExceptionPeriodEntities WHERE s.no = :no",
                    StationEntity.class).setParameter("no", entityNo).getResultList();
            if (!list.isEmpty()) {
                Long realPlaceNo = list.get(0).getPlaceEntity().getNo();
                return em.createQuery(
                        "SELECT DISTINCT s FROM StationEntity s LEFT JOIN FETCH s.stationExceptionPeriodEntities WHERE s.placeEntity.no = :no",
                        StationEntity.class).setParameter("no", realPlaceNo).getResultList()
                        .stream().map(PlaceDetailResDto::from).toList();
            }
        }
        throw new CustomException(RsvnErrorCode.PLACE_NOT_FOUND);
    }

    // entity PK(ws.no / o.no / s.no)로 직접 찾은 뒤 같은 place의 방 전체 반환
    private List<PlaceDetailResDto> findByDirectEntityNo(Long entityNo) {
        List<WorkStayEntity> wsList = em.createQuery(
                "SELECT DISTINCT ws FROM WorkStayEntity ws LEFT JOIN FETCH ws.workExceptionPeriodEntities WHERE ws.no = :no",
                WorkStayEntity.class).setParameter("no", entityNo).getResultList();
        if (!wsList.isEmpty()) {
            Long realPlaceNo = wsList.get(0).getPlaceEntity().getNo();
            return em.createQuery(
                    "SELECT DISTINCT ws FROM WorkStayEntity ws LEFT JOIN FETCH ws.workExceptionPeriodEntities WHERE ws.placeEntity.no = :no",
                    WorkStayEntity.class).setParameter("no", realPlaceNo).getResultList()
                    .stream().map(ws -> PlaceDetailResDto.from(ws, List.of())).toList();
        }
        List<OfficeEntity> oList = em.createQuery(
                "SELECT DISTINCT o FROM OfficeEntity o LEFT JOIN FETCH o.officePeriodEntities WHERE o.no = :no",
                OfficeEntity.class).setParameter("no", entityNo).getResultList();
        if (!oList.isEmpty()) {
            Long realPlaceNo = oList.get(0).getPlaceEntity().getNo();
            return em.createQuery(
                    "SELECT DISTINCT o FROM OfficeEntity o LEFT JOIN FETCH o.officePeriodEntities WHERE o.placeEntity.no = :no",
                    OfficeEntity.class).setParameter("no", realPlaceNo).getResultList()
                    .stream().map(PlaceDetailResDto::from).toList();
        }
        List<StationEntity> stList = em.createQuery(
                "SELECT DISTINCT s FROM StationEntity s LEFT JOIN FETCH s.stationExceptionPeriodEntities WHERE s.no = :no",
                StationEntity.class).setParameter("no", entityNo).getResultList();
        if (!stList.isEmpty()) {
            Long realPlaceNo = stList.get(0).getPlaceEntity().getNo();
            return em.createQuery(
                    "SELECT DISTINCT s FROM StationEntity s LEFT JOIN FETCH s.stationExceptionPeriodEntities WHERE s.placeEntity.no = :no",
                    StationEntity.class).setParameter("no", realPlaceNo).getResultList()
                    .stream().map(PlaceDetailResDto::from).toList();
        }

        throw new CustomException(RsvnErrorCode.PLACE_NOT_FOUND);
    }

    public PlaceDetailResDto getOfficeDetail(Long entityNo) {
        // JOIN FETCH로 officePeriodEntities 즉시 로딩 (가격 계산)
        // images·amenities는 같은 트랜잭션 내 lazy 로딩으로 처리
        List<OfficeEntity> list = em.createQuery(
                "SELECT DISTINCT o FROM OfficeEntity o LEFT JOIN FETCH o.officePeriodEntities WHERE o.no = :no",
                OfficeEntity.class)
                .setParameter("no", entityNo).getResultList();
        if (list.isEmpty()) throw new CustomException(RsvnErrorCode.PLACE_NOT_FOUND);
        return PlaceDetailResDto.from(list.get(0));
    }

    public PlaceDetailResDto getStationDetail(Long entityNo) {
        List<StationEntity> list = em.createQuery(
                "SELECT DISTINCT s FROM StationEntity s LEFT JOIN FETCH s.stationExceptionPeriodEntities WHERE s.no = :no",
                StationEntity.class)
                .setParameter("no", entityNo).getResultList();
        if (list.isEmpty()) throw new CustomException(RsvnErrorCode.PLACE_NOT_FOUND);
        return PlaceDetailResDto.from(list.get(0));
    }

    public PlaceDetailResDto getWorkStayDetail(Long entityNo) {
        List<WorkStayEntity> list = em.createQuery(
                "SELECT DISTINCT ws FROM WorkStayEntity ws LEFT JOIN FETCH ws.workExceptionPeriodEntities WHERE ws.no = :no",
                WorkStayEntity.class)
                .setParameter("no", entityNo).getResultList();
        if (list.isEmpty()) throw new CustomException(RsvnErrorCode.PLACE_NOT_FOUND);

        List<WorkOfficeEntity> officeList = workOfficeRepository.findAllByWorkStayEntityNo(entityNo);
        List<String> officeImgUrls = officeList.stream()
                .flatMap(workOfficeEntity -> workOfficeEntity.getImages().stream())
                .map(imgWorkStayOfficeEntity -> imgWorkStayOfficeEntity.getCurrentUrl())
                .toList();


        return PlaceDetailResDto.from(list.get(0), officeImgUrls);
    }

}
