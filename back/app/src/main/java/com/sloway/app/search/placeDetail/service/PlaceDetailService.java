package com.sloway.app.search.placeDetail.service;

import com.sloway.app.common.exception.CustomException;
import com.sloway.app.place.entity.office.OfficeEntity;
import com.sloway.app.place.entity.station.StationEntity;
import com.sloway.app.place.entity.workStay.WorkStayEntity;
import com.sloway.app.reservation.RsvnErrorCode;
import com.sloway.app.search.placeDetail.dto.PlaceDetailResDto;
import jakarta.persistence.EntityGraph;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Transactional(readOnly = true)
@Slf4j
@Service
public class PlaceDetailService {

    // EntityGraph로 @OneToMany 컬렉션 즉시 로딩 — repository.findById() lazy 로딩 우회
    @PersistenceContext
    private EntityManager em;

    // entityNo만 알 때 — workStay → office → station 순으로 시도
    public PlaceDetailResDto findByEntityNo(Long entityNo) {
        // 트랜잭션이 끝난뒤에 dto를 get하려고 하면 터짐 -> 트랜잭션이 끝나기 전에 필요한 칼럼 가져오기(이미지,편의시설,예외기간가격)
        EntityGraph<WorkStayEntity> wsGraph = em.createEntityGraph(WorkStayEntity.class);
        wsGraph.addAttributeNodes("images", "workAmenityEntities");
        WorkStayEntity ws = em.find(WorkStayEntity.class, entityNo,
                Map.of("jakarta.persistence.loadgraph", wsGraph));
        if (ws != null) return PlaceDetailResDto.from(ws);

        EntityGraph<OfficeEntity> oGraph = em.createEntityGraph(OfficeEntity.class);
        oGraph.addAttributeNodes("officePeriodEntities", "images", "officeAmenityEntities");
        OfficeEntity o = em.find(OfficeEntity.class, entityNo,
                Map.of("jakarta.persistence.loadgraph", oGraph));
        if (o != null) return PlaceDetailResDto.from(o);

        EntityGraph<StationEntity> stGraph = em.createEntityGraph(StationEntity.class);
        stGraph.addAttributeNodes("images", "stationAmenityEntities");
        StationEntity st = em.find(StationEntity.class, entityNo,
                Map.of("jakarta.persistence.loadgraph", stGraph));
        if (st != null) return PlaceDetailResDto.from(st);

        throw new CustomException(RsvnErrorCode.PLACE_NOT_FOUND);
    }

    public PlaceDetailResDto getOfficeDetail(Long entityNo) {
        EntityGraph<OfficeEntity> graph = em.createEntityGraph(OfficeEntity.class);
        graph.addAttributeNodes("officePeriodEntities", "images", "officeAmenityEntities");
        OfficeEntity entity = em.find(OfficeEntity.class, entityNo,
                Map.of("jakarta.persistence.loadgraph", graph));
        if (entity == null) throw new CustomException(RsvnErrorCode.PLACE_NOT_FOUND);
        return PlaceDetailResDto.from(entity);
    }

    public PlaceDetailResDto getStationDetail(Long entityNo) {
        EntityGraph<StationEntity> graph = em.createEntityGraph(StationEntity.class);
        graph.addAttributeNodes("images", "stationAmenityEntities");
        StationEntity entity = em.find(StationEntity.class, entityNo,
                Map.of("jakarta.persistence.loadgraph", graph));
        if (entity == null) throw new CustomException(RsvnErrorCode.PLACE_NOT_FOUND);
        return PlaceDetailResDto.from(entity);
    }

    public PlaceDetailResDto getWorkStayDetail(Long entityNo) {
        EntityGraph<WorkStayEntity> graph = em.createEntityGraph(WorkStayEntity.class);
        graph.addAttributeNodes("images", "workAmenityEntities");
        WorkStayEntity entity = em.find(WorkStayEntity.class, entityNo,
                Map.of("jakarta.persistence.loadgraph", graph));
        if (entity == null) throw new CustomException(RsvnErrorCode.PLACE_NOT_FOUND);
        return PlaceDetailResDto.from(entity);
    }
}
