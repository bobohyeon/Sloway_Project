package com.sloway.app.place.service.station;

import com.sloway.app.place.dto.request.sort.ImgSortReqDto;
import com.sloway.app.place.dto.request.sort.ImgUpdateSortReqDto;
import com.sloway.app.place.dto.request.station.StationReqDto;
import com.sloway.app.place.dto.request.station.StationUpdateReqDto;
import com.sloway.app.place.dto.response.place.PlaceImgListRespDto;
import com.sloway.app.place.dto.response.station.StationDetailRespDto;
import com.sloway.app.place.dto.response.station.StationUpdateDetailRespDto;
import com.sloway.app.place.entity.amenity.AmenityEntity;
import com.sloway.app.place.entity.amenity.station.StationAmenityEntity;
import com.sloway.app.place.entity.place.ImgPlaceEntity;
import com.sloway.app.place.entity.place.PlaceEntity;
import com.sloway.app.place.entity.station.ImgStationEntity;
import com.sloway.app.place.entity.station.StationEntity;
import com.sloway.app.place.entity.station.StationExceptionPeriodEntity;
import com.sloway.app.place.repository.amenity.AmenityRepository;
import com.sloway.app.place.repository.place.PlaceRepository;
import com.sloway.app.place.repository.station.ImgStationRepository;
import com.sloway.app.place.repository.station.StationRepository;
import com.sloway.app.place.service.hostPlace.HostPlaceService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Objects;
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
    private final HostPlaceService hostPlaceService;

    //저장
    @Transactional
    public void saveStation(StationReqDto dto, List<MultipartFile> files, List<ImgSortReqDto> sortList, Long hostNo) {
        //부모테이블 엔티티조회
        PlaceEntity place = placeRepository.findByNo(dto.getPlaceNo())
                .orElseThrow(() -> new EntityNotFoundException("[PLACE-210] Place Not Found For Save Station"));

        //편의시설 정보 조회
        List<Long> amenityNos = dto.getFacilityList().stream()
                .map(facility -> facility.getAmenityNo())
                .collect(Collectors.toList());
        List<AmenityEntity> amenityEntities = amenityRepository.findAllByNoIn(amenityNos);

        //Station 저장을 위한 엔티티변환(편의시설 함께 저장)
        StationEntity entity = dto.toEntity(place, amenityEntities);

        //Station 저장
        StationEntity station = stationRepository.save(entity);

        //검수 등록
        hostPlaceService.insertHostPlace("S",hostNo,station.getNo());

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
    public void updateStation(Long no, StationUpdateReqDto dto) {
        // 1. 기존 엔티티 조회
        StationEntity stationEntity = stationRepository.findById(no)
                .orElseThrow(() -> new EntityNotFoundException("[STATION-200] Station Not Found"));

// 2. 편의시설 엔티티 조회
        List<Long> amenityNos = dto.getFacilityList().stream()
                .map(facility -> (long) facility.getAmenityNo())
                .collect(Collectors.toList());
        List<AmenityEntity> amenityEntities = amenityRepository.findAllByNoIn(amenityNos);

// 3. 필드 업데이트 (더티 체킹 활용)
        stationEntity.updateInfo(dto);

        stationEntity.getStationAmenityEntities().clear();

        List<StationAmenityEntity> newAmenities = amenityEntities.stream()
                .map(amenity -> StationAmenityEntity.builder()
                        .stationEntity(stationEntity)
                        .amenityEntity(amenity)
                        .build())
                .toList();

        stationEntity.getStationAmenityEntities().addAll(newAmenities);


        stationEntity.getStationExceptionPeriodEntities().clear();
        if (dto.getExceptionPeriods() != null) {
            List<StationExceptionPeriodEntity> newExceptionPeriods = dto.getExceptionPeriods().stream()
                    .map(exDto -> StationExceptionPeriodEntity.builder()
                            .stationEntity(stationEntity)
                            .startDate(exDto.getStartDate())
                            .endDate(exDto.getEndDate())
                            .monPrice(exDto.getMonPrice())
                            .tuePrice(exDto.getTuePrice())
                            .wedPrice(exDto.getWedPrice())
                            .thuPrice(exDto.getThuPrice())
                            .friPrice(exDto.getFriPrice())
                            .satPrice(exDto.getSatPrice())
                            .sunPrice(exDto.getSunPrice())
                            .holPrice(exDto.getHolPrice())
                            .build())
                    .toList();
            stationEntity.getStationExceptionPeriodEntities().addAll(newExceptionPeriods);
        }
    }

    @Transactional
    public void deleteStation(Long no) {
        StationEntity station = stationRepository.findById(no)
                .orElseThrow(() -> new EntityNotFoundException("[STATION-200]Station Not Found For Delete"));

        //soft delete
        station.delete();
    }

    // 이미지 수정 로직 (saveStation 로직 반영)
    @Transactional
    public void updateStationImg(Long no, List<MultipartFile> files, List<ImgUpdateSortReqDto> sortList) {
        // Station 조회
        StationEntity stationEntity = stationRepository.findById(no)
                .orElseThrow(() -> new EntityNotFoundException("[STATION-305] Station Not Found For Update Images"));

        // 2. 화면에 살아남은 기존 이미지 ID 추출 (새로 추가된 파일인 null은 제외)
        List<Long> aliveImageNos = sortList.stream()
                .map(ImgUpdateSortReqDto::getImageNo) // 💡 DTO에 추가된 imageNo 추출
                .filter(Objects::nonNull)
                .toList();

        // 3. 화면에서 유저가 🗑️ 버튼을 눌러 지워진 이미지들만 DB에서 선택 삭제
        // (※ Repository에 해당 Querydsl 또는 JPQL 메서드가 선언되어 있어야 합니다)
        if (aliveImageNos.isEmpty()) {
            imgStationRepository.deleteAllByStationEntityNo(no);
        } else {
            imgStationRepository.deleteByStationEntityNoAndNoNotIn(no, aliveImageNos);
        }

        // 4. 루프를 돌며 순서 교정(Dirty Check) 및 신규 파일 매칭 삽입(Loop Counter 방식)
        int fileIndex = 0;
        for (ImgUpdateSortReqDto dto : sortList) {
            if (dto.getImageNo() != null) {
                // ① 기존 이미지: 삭제되지 않고 화면에 남아있으므로 순서(sort)만 변경
                ImgStationEntity existingImg = imgStationRepository.findById(dto.getImageNo())
                        .orElseThrow(() -> new EntityNotFoundException("Station Image Not Found"));
                existingImg.updateSort(dto.getSort());
            } else {
                // ② 신규 이미지: 드래그 앤 드롭으로 섞인 null 자리에 순서대로 파일을 매칭하여 S3 URL 발급 후 저장
                if (files != null && fileIndex < files.size()) {
                    MultipartFile currentFile = files.get(fileIndex++);
                    String s3Url = "https://temp-bucket.s3.amazonaws.com/temp_"
                            + System.currentTimeMillis() + "_"
                            + currentFile.getOriginalFilename();

                    ImgStationEntity newImg = ImgStationEntity.from(stationEntity, s3Url, dto.getSort());
                    imgStationRepository.save(newImg);
                }
            }
        }
    }

    public PlaceImgListRespDto selectImageList(Long no, Long memberNo) {
        return stationRepository.selectImageList(no,memberNo);
    }

    public StationDetailRespDto selectStationDetailDashBoard(Long no, Long memberNo) {
        return stationRepository.selectStationDetailDashBoard(no, memberNo);
    }

    public StationUpdateDetailRespDto selectDetailForUpdate(Long no, Long memberNo) {
        return stationRepository.selectDetailForUpdate(no,memberNo);
    }
}
