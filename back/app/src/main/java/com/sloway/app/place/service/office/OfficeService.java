package com.sloway.app.place.service.office;

import com.sloway.app.aws.service.S3Service;
import com.sloway.app.place.dto.request.office.OfficeUpdateReqDto;
import com.sloway.app.place.dto.request.office.OfficeReqDto;
import com.sloway.app.place.dto.request.sort.ImgSortReqDto;
import com.sloway.app.place.dto.request.sort.ImgUpdateSortReqDto;
import com.sloway.app.place.dto.response.office.OfficeUpdateDetailReqDto;
import com.sloway.app.place.dto.response.place.PlaceImgListRespDto;
import com.sloway.app.place.dto.response.station.StationDetailRespDto;
import com.sloway.app.place.entity.amenity.AmenityEntity;
import com.sloway.app.place.entity.amenity.office.OfficeAmenityEntity;
import com.sloway.app.place.entity.hostPlace.HostPlaceEntity;
import com.sloway.app.place.entity.office.ImgOfficeEntity;
import com.sloway.app.place.entity.office.OfficeEntity;
import com.sloway.app.place.entity.office.OfficePeriodEntity;
import com.sloway.app.place.entity.place.PlaceEntity;
import com.sloway.app.place.entity.station.ImgStationEntity;
import com.sloway.app.place.repository.amenity.AmenityRepository;
import com.sloway.app.place.repository.hostPlace.HostPlaceRepository;
import com.sloway.app.place.repository.office.ImgOfficeRepository;
import com.sloway.app.place.repository.office.OfficeRepository;
import com.sloway.app.place.repository.place.PlaceRepository;
import com.sloway.app.place.service.hostPlace.HostPlaceService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class OfficeService {

    private final PlaceRepository placeRepository;
    private final OfficeRepository officeRepository;
    private final AmenityRepository amenityRepository;
    private final ImgOfficeRepository imgOfficeRepository;
    private final HostPlaceService hostPlaceService;
    private final HostPlaceRepository hostPlaceRepository;
    private final S3Service s3Service;

    @Transactional
    public void saveOffice(OfficeReqDto dto, List<MultipartFile> files, List<ImgSortReqDto> sortList, Long memberNo) {
        // 1. 부모 엔티티 및 편의시설 조회
        PlaceEntity place = placeRepository.findByNo(dto.getPlaceNo())
                .orElseThrow(() -> new EntityNotFoundException("[OFFICE-210] Place Not Found"));

        List<AmenityEntity> amenityEntities = amenityRepository.findAllByNoIn(
                dto.getFacilityList().stream().map(f -> f.getAmenityNo()).toList());

        // 2. Office 저장 및 검수 등록
        OfficeEntity office = officeRepository.save(dto.toEntity(place, amenityEntities));
        hostPlaceService.insertHostPlace("C", memberNo, office.getNo());

        // 3. 이미지 S3 업로드 및 저장
        if (files != null && !files.isEmpty()) {
            List<ImgOfficeEntity> imgEntities = IntStream.range(0, files.size())
                    .mapToObj(i -> {
                        try {
                            // S3 업로드 (풀 URL 반환)
                            String s3Url = s3Service.upload(files.get(i), "office");
                            int sortValue = sortList.get(i).getSort();
                            return ImgOfficeEntity.from(office, s3Url, sortValue);
                        } catch (IOException e) {
                            throw new RuntimeException("Office 이미지 업로드 실패", e);
                        }
                    })
                    .collect(Collectors.toList());

            imgOfficeRepository.saveAll(imgEntities);
        }
    }

    @Transactional
    public void updateOffice(Long no, OfficeUpdateReqDto dto, Long memberNo) {
        // 1. 기존 오피스 엔티티 조회
        OfficeEntity office = officeRepository.findById(no)
                .orElseThrow(() -> new EntityNotFoundException("[OFFICE-305] Office Not Found For Update"));

        // 2. 편의시설 엔티티 조회
        List<Long> amenityNos = dto.getFacilityList().stream()
                .map(facility -> (long) facility.getAmenityNo())
                .collect(Collectors.toList());
        List<AmenityEntity> amenityEntities = amenityRepository.findAllByNoIn(amenityNos);

        // 3. 기본 정보 업데이트 (더티 체킹)
        office.updateInfo(dto);

        // 검수 추가
        HostPlaceEntity hostPlaceEntity =hostPlaceRepository.findHostOfficeLatest(no, memberNo);

        if(hostPlaceEntity != null){
            hostPlaceRepository.delete(hostPlaceEntity);
        }

        hostPlaceService.insertHostPlace("C", memberNo, office.getNo());

        // 4. 편의시설 업데이트 (Clear & AddAll)
        office.getOfficeAmenityEntities().clear();
        if (amenityEntities != null && !amenityEntities.isEmpty()) {
            List<OfficeAmenityEntity> newAmenities = amenityEntities.stream()
                    .map(amenity -> OfficeAmenityEntity.builder()
                            .officeEntity(office)
                            .amenityEntity(amenity)
                            .build())
                    .toList();
            office.getOfficeAmenityEntities().addAll(newAmenities);
        }

        // 5. 기본/예외 기간 업데이트 (Clear & AddAll)
        office.getOfficePeriodEntities().clear();
        List<OfficePeriodEntity> allPeriods = new ArrayList<>();

        // 기본 요일별 가격 추가
        if (dto.getOfficePeriods() != null) {
            allPeriods.addAll(dto.getOfficePeriods().stream()
                    .map(opDto -> OfficePeriodEntity.builder()
                            .officeEntity(office)
                            .price(opDto.getPrice())
                            .dayOfWeek(opDto.getDayOfWeek())
                            .startTime(opDto.getStartTime())
                            .build())
                    .toList());
        }

        // 예외 기간 가격 추가
        if (dto.getExceptionPeriods() != null) {
            allPeriods.addAll(dto.getExceptionPeriods().stream()
                    .map(exDto -> OfficePeriodEntity.builder()
                            .officeEntity(office)
                            .price(exDto.getPrice())
                            .dayOfWeek(exDto.getDayOfWeek())
                            .startTime(exDto.getStartTime())
                            .exceptionStartDate(exDto.getStartDate())
                            .exceptionEndDate(exDto.getEndDate())
                            .build())
                    .toList());
        }

        office.getOfficePeriodEntities().addAll(allPeriods);
    }

    @Transactional
    public void updateOfficeImg(Long no, List<MultipartFile> files, List<ImgUpdateSortReqDto> sortList, Long memberNo) {
        // 1. Office 조회 및 검수 처리
        OfficeEntity officeEntity = officeRepository.findById(no)
                .orElseThrow(() -> new EntityNotFoundException("[OFFICE-305] Office Not Found"));

        HostPlaceEntity hostPlaceEntity = hostPlaceRepository.findHostOfficeLatest(no, memberNo);
        if (hostPlaceEntity != null) {
            hostPlaceRepository.delete(hostPlaceEntity);
        }
        hostPlaceService.insertHostPlace("C", memberNo, officeEntity.getNo());

        // 2. 화면에 살아남은 이미지 ID 추출
        List<Long> aliveImageNos = sortList.stream()
                .map(ImgUpdateSortReqDto::getImageNo)
                .filter(Objects::nonNull)
                .toList();

        // 3. 삭제될 이미지들 S3에서 실제 파일 삭제 (DB 삭제 전 수행)
        List<ImgOfficeEntity> toDeleteImages = imgOfficeRepository.findByOfficeEntityNoAndNoNotIn(no, aliveImageNos);
        toDeleteImages.forEach(img -> s3Service.delete(img.getCurrentUrl()));

        // 4. DB에서 삭제
        if (aliveImageNos.isEmpty()) {
            imgOfficeRepository.deleteAllByOfficeEntityNo(no);
        } else {
            imgOfficeRepository.deleteByOfficeEntityNoAndNoNotIn(no, aliveImageNos);
        }

        // 5. 순서 교정 및 신규 파일 매칭 삽입
        int fileIndex = 0;
        for (ImgUpdateSortReqDto dto : sortList) {
            if (dto.getImageNo() != null) {
                // 기존 이미지: 순서 변경
                imgOfficeRepository.findById(dto.getImageNo())
                        .ifPresent(img -> img.updateSort(dto.getSort()));
            } else if (files != null && fileIndex < files.size()) {
                // 신규 이미지: S3 업로드 후 저장
                try {
                    String s3Url = s3Service.upload(files.get(fileIndex++), "office");
                    ImgOfficeEntity newImg = ImgOfficeEntity.from(officeEntity, s3Url, dto.getSort());
                    imgOfficeRepository.save(newImg);
                } catch (IOException e) {
                    throw new RuntimeException("Office 이미지 업로드 중 오류 발생", e);
                }
            }
        }
    }

    @Transactional
    public void deleteOffice(Long no) {
        OfficeEntity office = officeRepository.findById(no)
                .orElseThrow(() -> new EntityNotFoundException("[STATION-200]Station Not Found For Delete"));

        //soft delete
        office.delete();
    }

    public PlaceImgListRespDto selectImageList(Long no, Long memberNo) {
        return officeRepository.selectImageList(no,memberNo);
    }

    public StationDetailRespDto selectOfficeDetailDashBoard(Long no, Long memberNo) {
        return officeRepository.selectOfficeDetailDashBoard(no, memberNo);
    }

    public OfficeUpdateDetailReqDto selectOfficeForUpdate(Long no, Long memberNo) {
        return officeRepository.selectOfficeForUpdate(no, memberNo);
    }
}
