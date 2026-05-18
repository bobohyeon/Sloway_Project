package com.sloway.app.place.service.office;

import com.sloway.app.place.dto.request.office.OfficeUpdateReqDto;
import com.sloway.app.place.dto.request.office.OfficeReqDto;
import com.sloway.app.place.dto.request.sort.ImgSortReqDto;
import com.sloway.app.place.entity.amenity.AmenityEntity;
import com.sloway.app.place.entity.amenity.office.OfficeAmenityEntity;
import com.sloway.app.place.entity.office.ImgOfficeEntity;
import com.sloway.app.place.entity.office.OfficeEntity;
import com.sloway.app.place.entity.office.OfficePeriodEntity;
import com.sloway.app.place.entity.place.PlaceEntity;
import com.sloway.app.place.repository.amenity.AmenityRepository;
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

import java.util.ArrayList;
import java.util.List;
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

    //저장
    @Transactional
    public void saveOffice(OfficeReqDto dto, List<MultipartFile> files, List<ImgSortReqDto> sortList, Long hostNo) {
        //부모 테이블 엔티티 조회
        PlaceEntity place = placeRepository.findByNo(dto.getPlaceNo())
                .orElseThrow(() -> new EntityNotFoundException("[OFFICE-210] Place Not Found For Save Office"));

        //편의시설 정보 조회
        List<Long> amenityNos = dto.getFacilityList().stream()
                .map(facility -> facility.getAmenityNo())
                .collect(Collectors.toList());
        List<AmenityEntity> amenityEntities = amenityRepository.findAllByNoIn(amenityNos);

        //Office 저장을 위한 헨티티 변환
        OfficeEntity entity = dto.toEntity(place, amenityEntities);

        //Office 저장
        OfficeEntity office = officeRepository.save(entity);

        //검수 등록
        hostPlaceService.insertHostPlace("C", hostNo, office.getNo());

        //이미지 aws로 수정
        List<String> dummyUrls = files.stream()
                .map(img -> "https://temp-bucket.s3.amazonaws.com/temp_"
                        + System.currentTimeMillis() + "_"
                        + img.getOriginalFilename())
                .toList();

        int size = Math.min(dummyUrls.size(), sortList.size());
        List<ImgOfficeEntity> imgEntities = IntStream.range(0, size)

                .mapToObj(i -> {
                    String url = dummyUrls.get(i);
                    int sortValue = sortList.get(i).getSort(); // 정렬 값 추출

                    return ImgOfficeEntity.from(office, url, sortValue);
                })
                .collect(Collectors.toList());

        // 이미지 저장
        imgOfficeRepository.saveAll(imgEntities);
    }

    @Transactional
    public void updateOffice(Long no, OfficeUpdateReqDto dto) {
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
    public void updateOfficeImg(Long no, List<MultipartFile> files, List<ImgSortReqDto> sortList) {
        // Station 조회
        OfficeEntity officeEntity = officeRepository.findById(no)
                .orElseThrow(() -> new EntityNotFoundException("[OFFICE-305] Office Not Found For Update Images"));

        // 기존 이미지 관계 제거
        officeEntity.getImages().clear();

        // 이미지 aws로 수정
        List<String> dummyUrls = files.stream()
                .map(img -> "https://temp-bucket.s3.amazonaws.com/temp_"
                        + System.currentTimeMillis() + "_"
                        + img.getOriginalFilename())
                .toList();

        int size = Math.min(dummyUrls.size(), sortList.size());
        List<ImgOfficeEntity> newImages = IntStream.range(0, size)
                .mapToObj(i -> {
                    String url = dummyUrls.get(i);
                    int sortValue = sortList.get(i).getSort();
                    return ImgOfficeEntity.from(officeEntity, url, sortValue);
                })
                .toList();

        // 새로운 이미지 저장
        imgOfficeRepository.saveAll(newImages);
    }

    @Transactional
    public void deleteOffice(Long no) {
        OfficeEntity office = officeRepository.findById(no)
                .orElseThrow(() -> new EntityNotFoundException("[STATION-200]Station Not Found For Delete"));

        //soft delete
        office.delete();
    }
}
