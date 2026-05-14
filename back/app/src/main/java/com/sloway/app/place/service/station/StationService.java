package com.sloway.app.place.service.station;

import com.sloway.app.place.dto.request.station.StationReqDto;
import com.sloway.app.place.dto.request.station.StationUpdateReqDto;
import com.sloway.app.place.entity.amenity.AmenityEntity;
import com.sloway.app.place.entity.place.PlaceEntity;
import com.sloway.app.place.entity.station.StationEntity;
import com.sloway.app.place.repository.amenity.AmenityRepository;
import com.sloway.app.place.repository.amenity.station.StationAmenityRepository;
import com.sloway.app.place.repository.place.PlaceRepository;
import com.sloway.app.place.repository.station.StationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class StationService {

    private final PlaceRepository placeRepository;
    private final AmenityRepository amenityRepository;
    private final StationRepository stationRepository;


    @Transactional
    public void saveStation(StationReqDto dto){
        PlaceEntity place = placeRepository.findByNo((long) dto.getPlaceNo())
                .orElseThrow(() -> new EntityNotFoundException("[PLACE-200] Not Exist Place On Save Station"));

        // 2. 버킷 연결 전 더미데이터 URL 생성(임시구현)
        List<String> dummyUrls = dto.getImages().stream()
                .map(img -> "https://temp-bucket.s3.amazonaws.com/temp_" + System.currentTimeMillis() + ".jpg")
                .collect(Collectors.toList());

        // 3. 편의시설 엔티티 조회
        List<Long> amenityNos = dto.getFacilityList().stream()
                .map(facility -> (long) facility.getAmenityNo())
                .collect(Collectors.toList());

        List<AmenityEntity> amenityEntities = amenityRepository.findAllByNoIn(amenityNos);

        // 4.StationEntity 생성
        StationEntity station = dto.toEntity(place, dummyUrls, amenityEntities);

        // 5.DB 저장
        stationRepository.save(station);
    }

    @Transactional
    public void updateStation(StationUpdateReqDto dto){
        // 편의시설 엔티티 삽입을 위한 조회
        List<Long> amenityNos = dto.getFacilityList().stream()
                .map(facility -> (long) facility.getAmenityNo())
                .collect(Collectors.toList());
        List<AmenityEntity> amenityEntities = amenityRepository.findAllByNoIn(amenityNos);

        //원래 있던 편의시설 삭제
        StationEntity stationEntity = stationRepository.findById(dto.getNo())
                .orElseThrow(()->new EntityNotFoundException("[S_AMENITY-200]Station Amenity Not Found For Update"));
        stationEntity.getStationAmenityEntities().clear();

        // StationEntity 생성
        StationEntity station = dto.toEntity(amenityEntities);

        stationRepository.save(station);
    }
}
