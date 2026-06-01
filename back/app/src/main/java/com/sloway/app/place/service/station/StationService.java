package com.sloway.app.place.service.station;

import com.sloway.app.aws.service.S3Service;
import com.sloway.app.place.dto.request.sort.ImgSortReqDto;
import com.sloway.app.place.dto.request.sort.ImgUpdateSortReqDto;
import com.sloway.app.place.dto.request.station.StationReqDto;
import com.sloway.app.place.dto.request.station.StationUpdateReqDto;
import com.sloway.app.place.dto.response.place.PlaceImgListRespDto;
import com.sloway.app.place.dto.response.station.StationDetailRespDto;
import com.sloway.app.place.dto.response.station.StationUpdateDetailRespDto;
import com.sloway.app.place.entity.amenity.AmenityEntity;
import com.sloway.app.place.entity.amenity.station.StationAmenityEntity;
import com.sloway.app.place.entity.hostPlace.HostPlaceEntity;
import com.sloway.app.place.entity.place.ImgPlaceEntity;
import com.sloway.app.place.entity.place.PlaceEntity;
import com.sloway.app.place.entity.station.ImgStationEntity;
import com.sloway.app.place.entity.station.StationEntity;
import com.sloway.app.place.entity.station.StationExceptionPeriodEntity;
import com.sloway.app.place.repository.amenity.AmenityRepository;
import com.sloway.app.place.repository.hostPlace.HostPlaceRepository;
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

import java.io.IOException;
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
    private final HostPlaceRepository hostPlaceRepository;
    private final S3Service s3Service;

    //저장
    @Transactional
    public void saveStation(StationReqDto dto, List<MultipartFile> files, List<ImgSortReqDto> sortList, Long hostNo) {
        // 1. 부모 엔티티 및 편의시설 조회
        PlaceEntity place = placeRepository.findByNo(dto.getPlaceNo())
                .orElseThrow(() -> new EntityNotFoundException("[PLACE-210] Place Not Found"));

        List<AmenityEntity> amenityEntities = amenityRepository.findAllByNoIn(
                dto.getFacilityList().stream().map(f -> f.getAmenityNo()).toList());

        // 2. Station 저장 및 검수 등록
        StationEntity station = stationRepository.save(dto.toEntity(place, amenityEntities));
        hostPlaceService.insertHostPlace("S", hostNo, station.getNo());

        // 3. 이미지 S3 업로드 및 저장
        if (files != null && !files.isEmpty()) {
            List<ImgStationEntity> imgEntities = IntStream.range(0, files.size())
                    .mapToObj(i -> {
                        try {
                            // S3 업로드 (풀 URL 반환)
                            String s3Url = s3Service.upload(files.get(i), "station");
                            int sortValue = sortList.get(i).getSort();
                            return ImgStationEntity.from(station, s3Url, sortValue);
                        } catch (IOException e) {
                            throw new RuntimeException("Station 이미지 업로드 실패", e);
                        }
                    })
                    .collect(Collectors.toList());

            imgStationRepository.saveAll(imgEntities);
        }
    }

    //수정
    @Transactional
    public void updateStation(Long no, StationUpdateReqDto dto, Long memberNo) {
        // 1. 기존 엔티티 조회
        StationEntity stationEntity = stationRepository.findById(no)
                .orElseThrow(() -> new EntityNotFoundException("[STATION-200] Station Not Found"));

        // 검수 추가
        HostPlaceEntity hostPlaceEntity =hostPlaceRepository.findHostStationLatest(no, memberNo);

        if(hostPlaceEntity != null){
            hostPlaceRepository.delete(hostPlaceEntity);
        }

        hostPlaceService.insertHostPlace("S", memberNo, stationEntity.getNo());

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

    @Transactional
    public void updateStationImg(Long no, List<MultipartFile> files, List<ImgUpdateSortReqDto> sortList, Long memberNo) {
        // 1. Station 조회 및 검수 처리
        StationEntity stationEntity = stationRepository.findById(no)
                .orElseThrow(() -> new EntityNotFoundException("[STATION-305] Station Not Found"));

        HostPlaceEntity hostPlaceEntity = hostPlaceRepository.findHostStationLatest(no, memberNo);
        if (hostPlaceEntity != null) {
            hostPlaceRepository.delete(hostPlaceEntity);
        }
        hostPlaceService.insertHostPlace("S", memberNo, stationEntity.getNo());

        // 2. 화면에 살아남은 이미지 ID 추출
        List<Long> aliveImageNos = sortList.stream()
                .map(ImgUpdateSortReqDto::getImageNo)
                .filter(Objects::nonNull)
                .toList();

        // 3. 삭제될 이미지들 S3에서 실제 파일 삭제 (DB 삭제 전 수행)
        List<ImgStationEntity> toDeleteImages = imgStationRepository.findByStationEntityNoAndNoNotIn(no, aliveImageNos);
        toDeleteImages.forEach(img -> s3Service.delete(img.getCurrentUrl()));

        // 4. DB에서 삭제
        if (aliveImageNos.isEmpty()) {
            imgStationRepository.deleteAllByStationEntityNo(no);
        } else {
            imgStationRepository.deleteByStationEntityNoAndNoNotIn(no, aliveImageNos);
        }

        // 5. 순서 교정 및 신규 파일 매칭 삽입
        int fileIndex = 0;
        for (ImgUpdateSortReqDto dto : sortList) {
            if (dto.getImageNo() != null) {
                // 기존 이미지: 순서만 변경
                imgStationRepository.findById(dto.getImageNo())
                        .ifPresent(img -> img.updateSort(dto.getSort()));
            } else if (files != null && fileIndex < files.size()) {
                // 신규 이미지: S3 업로드 후 저장
                try {
                    String s3Url = s3Service.upload(files.get(fileIndex++), "station");
                    ImgStationEntity newImg = ImgStationEntity.from(stationEntity, s3Url, dto.getSort());
                    imgStationRepository.save(newImg);
                } catch (IOException e) {
                    throw new RuntimeException("Station 이미지 업로드 중 오류 발생", e);
                }
            }
        }
    }

    public PlaceImgListRespDto selectImageList(Long no, Long memberNo) {
        return stationRepository.selectImageList(no, memberNo);
    }

    public StationDetailRespDto selectStationDetailDashBoard(Long no, Long memberNo) {
        return stationRepository.selectStationDetailDashBoard(no, memberNo);
    }

    public StationUpdateDetailRespDto selectDetailForUpdate(Long no, Long memberNo) {
        return stationRepository.selectDetailForUpdate(no, memberNo);
    }
}
