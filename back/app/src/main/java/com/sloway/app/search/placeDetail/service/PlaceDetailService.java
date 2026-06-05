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
