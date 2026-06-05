package com.sloway.app.search.placeDetail.service;

import com.sloway.app.common.exception.CustomException;
import com.sloway.app.place.entity.office.OfficeEntity;
import com.sloway.app.place.entity.station.StationEntity;
import com.sloway.app.place.entity.workStay.WorkStayEntity;
import com.sloway.app.place.repository.office.OfficeRepository;
import com.sloway.app.place.repository.station.StationRepository;
import com.sloway.app.place.repository.workStay.WorkStayRepository;
import com.sloway.app.reservation.RsvnErrorCode;
import com.sloway.app.search.placeDetail.dto.PlaceDetailResDto;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
@Service
public class PlaceDetailService {

    private final OfficeRepository officeRepository;
    private final StationRepository stationRepository;
    private final WorkStayRepository workStayRepository;

    // entityNo만 알 때 — workStay → office → station 순으로 시도
    public PlaceDetailResDto findByEntityNo(Long entityNo) {
        Optional<WorkStayEntity> ws = workStayRepository.findById(entityNo);
        if (ws.isPresent()) return PlaceDetailResDto.from(ws.get());

        Optional<OfficeEntity> o = officeRepository.findById(entityNo);
        if (o.isPresent()) return PlaceDetailResDto.from(o.get());

        Optional<StationEntity> st = stationRepository.findById(entityNo);
        if (st.isPresent()) return PlaceDetailResDto.from(st.get());

        throw new CustomException(RsvnErrorCode.PLACE_NOT_FOUND);
    }

    public PlaceDetailResDto getOfficeDetail(Long entityNo) {
        OfficeEntity entity = officeRepository.findById(entityNo)
                .orElseThrow(()->new CustomException(RsvnErrorCode.PLACE_NOT_FOUND));
        return PlaceDetailResDto.from(entity);
    }

    public PlaceDetailResDto getStationDetail(Long entityNo) {
        StationEntity entity = stationRepository.findById(entityNo)
                .orElseThrow(()->new CustomException(RsvnErrorCode.PLACE_NOT_FOUND));
        return PlaceDetailResDto.from(entity);
    }

    public PlaceDetailResDto getWorkStayDetail(Long entityNo) {
        WorkStayEntity entity = workStayRepository.findById(entityNo)
                .orElseThrow(()->new CustomException(RsvnErrorCode.PLACE_NOT_FOUND));
        return PlaceDetailResDto.from(entity);
    }
}
