package com.sloway.app.place.service.station;

import com.sloway.app.place.dto.request.sort.ImgSortReqDto;
import com.sloway.app.place.dto.request.station.StationReqDto;
import com.sloway.app.place.dto.request.station.StationUpdateReqDto;
import com.sloway.app.place.entity.amenity.AmenityEntity;
import com.sloway.app.place.entity.place.PlaceEntity;
import com.sloway.app.place.entity.station.ImgStationEntity;
import com.sloway.app.place.entity.station.StationEntity;
import com.sloway.app.place.repository.amenity.AmenityRepository;
import com.sloway.app.place.repository.place.PlaceRepository;
import com.sloway.app.place.repository.station.ImgStationRepository;
import com.sloway.app.place.repository.station.StationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class StationService {

    private final PlaceRepository placeRepository;
    private final AmenityRepository amenityRepository;
    private final StationRepository stationRepository;
    private final ImgStationRepository imgStationRepository;

    //저장
    @Transactional
    public void saveStation(StationReqDto dto, List<MultipartFile> files, List<ImgSortReqDto> sortList) {
        //부모테이블 엔티티조회
        PlaceEntity place = placeRepository.findByNo(dto.getPlaceNo())
                .orElseThrow(()->new EntityNotFoundException("[PLACE-210] Place Not Found For Save Station"));

        //편의시설 정보 조회
        List<Long> amenityNos = dto.getFacilityList().stream()
                .map(facility -> (long) facility.getAmenityNo())
                .collect(Collectors.toList());
        List<AmenityEntity> amenityEntities = amenityRepository.findAllByNoIn(amenityNos);

        //Station 저장을 위한 엔티티변환(편의시설 함께 저장)
        StationEntity entity = dto.toEntity(place, amenityEntities);
        StationEntity station = stationRepository.save(entity);

        // 이미지 aws로 수정
        List<String> dummyUrls = files.stream()
                .map(img -> "https://temp-bucket.s3.amazonaws.com/temp_"
                        + System.currentTimeMillis() + "_"
                        + img.getOriginalFilename())
                .toList();

        int size = Math.min(dummyUrls.size(), sortList.size());
        List<ImgStationEntity> imgEntities = IntStream.range(0, size)

                .mapToObj(i -> {
                    String url = dummyUrls.get(i);
                    int sortValue = sortList.get(i).getSort(); // 정렬 값 추출

                    return ImgStationEntity.from(station, url, sortValue);
                })
                .collect(Collectors.toList());

        // 이미지 저장
        imgStationRepository.saveAll(imgEntities);
    }

    //수정
    @Transactional
    public void updateStation(Long no, StationUpdateReqDto dto){
        // 편의시설 엔티티 삽입을 위한 조회
        List<Long> amenityNos = dto.getFacilityList().stream()
                .map(facility -> (long) facility.getAmenityNo())
                .collect(Collectors.toList());
        List<AmenityEntity> amenityEntities = amenityRepository.findAllByNoIn(amenityNos);

        //원래 있던 편의시설 삭제
        StationEntity stationEntity = stationRepository.findById(no)
                .orElseThrow(()->new EntityNotFoundException("[S_AMENITY-200]Station Amenity Not Found For Update"));
        stationEntity.getStationAmenityEntities().clear();

        //station정보 업데이트
        stationEntity.updateTitleAndContent(dto.getTitle(), dto.getContent());
    }

    @Transactional
    public void deleteStation(Long no) {
        StationEntity station = stationRepository.findById(no)
                .orElseThrow(()->new EntityNotFoundException("[STATION-200]Station Not Found For Delete"));

        //soft delete
        station.delete();
    }

    // 이미지 수정 로직 (saveStation 로직 반영)
    @Transactional
    public void updateStationImg(Long no, List<MultipartFile> files, List<ImgSortReqDto> sortList) {
        // Station 조회
        StationEntity stationEntity = stationRepository.findById(no)
                .orElseThrow(() -> new EntityNotFoundException("[STATION-305] Station Not Found For Update Images"));

        // 기존 이미지 관계 제거
        stationEntity.getImages().clear();

        // 이미지 aws로 수정
        List<String> dummyUrls = files.stream()
                .map(img -> "https://temp-bucket.s3.amazonaws.com/temp_"
                        + System.currentTimeMillis() + "_"
                        + img.getOriginalFilename())
                .toList();

        int size = Math.min(dummyUrls.size(), sortList.size());
        List<ImgStationEntity> newImages = IntStream.range(0, size)
                .mapToObj(i -> {
                    String url = dummyUrls.get(i);
                    int sortValue = sortList.get(i).getSort();
                    return ImgStationEntity.from(stationEntity, url, sortValue);
                })
                .toList();

        // 새로운 이미지 저장
        imgStationRepository.saveAll(newImages);
    }
}
