package com.sloway.app.search.placeDetail.service;

import com.sloway.app.common.exception.CustomException;
import com.sloway.app.place.entity.office.OfficeEntity;
import com.sloway.app.place.entity.station.StationEntity;
import com.sloway.app.place.entity.workStay.WorkStayEntity;
import com.sloway.app.reservation.RsvnErrorCode;
import com.sloway.app.search.placeDetail.dto.PlaceDetailResDto;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional(readOnly = true)
@Slf4j
@Service
public class PlaceDetailService {

    // 트랜잭션이 끝나기 전에 필요한 컬렉션 로딩 — officePeriodEntities는 JOIN FETCH로 확실하게
    @PersistenceContext
    private EntityManager em;

    // entityNo만 알 때 — workStay → office → station 순으로 시도
    public List<PlaceDetailResDto> findByEntityNo(Long placeNo, String type) {

        if(type.equals("WORK_STAY")){
            List<WorkStayEntity> wsList = em.createQuery(
                            "SELECT DISTINCT ws FROM WorkStayEntity ws LEFT JOIN FETCH ws.workExceptionPeriodEntities WHERE ws.placeEntity.no = :no", WorkStayEntity.class)
                    .setParameter("no", placeNo).getResultList();
            if (!wsList.isEmpty())
                return wsList.stream().map(PlaceDetailResDto::from).toList();
        }

        if(type.equals("OFFICE")){
            // officePeriodEntities JOIN FETCH — 가격 계산에 필요
            List<OfficeEntity> oList = em.createQuery(
                            "SELECT DISTINCT o FROM OfficeEntity o LEFT JOIN FETCH o.officePeriodEntities WHERE o.placeEntity.no = :no",
                            OfficeEntity.class)
                    .setParameter("no", placeNo).getResultList();
            if (!oList.isEmpty()) return oList.stream().map(PlaceDetailResDto::from).toList();
        }
        if(type.equals("STATION")){
            List<StationEntity> stList = em.createQuery(
                            "SELECT DISTINCT s FROM StationEntity s LEFT JOIN FETCH s.stationExceptionPeriodEntities WHERE s.placeEntity.no = :no", StationEntity.class)
                    .setParameter("no", placeNo).getResultList();
            if (!stList.isEmpty()) return stList.stream().map(PlaceDetailResDto::from).toList();
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
        return PlaceDetailResDto.from(list.get(0));
    }

}
