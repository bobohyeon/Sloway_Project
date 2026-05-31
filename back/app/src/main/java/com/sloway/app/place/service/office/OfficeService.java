package com.sloway.app.place.service.office;

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

    //저장
    @Transactional
    public void saveOffice(OfficeReqDto dto, List<MultipartFile> files, List<ImgSortReqDto> sortList, Long memberNo) {
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
        hostPlaceService.insertHostPlace("C", memberNo, office.getNo());

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
        // Station 조회
        OfficeEntity officeEntity = officeRepository.findById(no)
                .orElseThrow(() -> new EntityNotFoundException("[OFFICE-305] Office Not Found For Update Images"));

        // 검수 추가
        HostPlaceEntity hostPlaceEntity =hostPlaceRepository.findHostOfficeLatest(no, memberNo);

        if(hostPlaceEntity != null){
            hostPlaceRepository.delete(hostPlaceEntity);
        }

        hostPlaceService.insertHostPlace("C", memberNo, officeEntity.getNo());

        // 2. 화면에 살아남은 기존 이미지 ID 추출 (새로 추가된 파일인 null은 제외)
        List<Long> aliveImageNos = sortList.stream()
                .map(ImgUpdateSortReqDto::getImageNo) // 💡 DTO에 추가된 imageNo 추출
                .filter(Objects::nonNull)
                .toList();

        // 3. 화면에서 유저가 🗑️ 버튼을 눌러 지워진 이미지들만 DB에서 선택 삭제
        // (※ Repository에 해당 Querydsl 또는 JPQL 메서드가 선언되어 있어야 합니다)
        if (aliveImageNos.isEmpty()) {
            imgOfficeRepository.deleteAllByOfficeEntityNo(no);
        } else {
            imgOfficeRepository.deleteByOfficeEntityNoAndNoNotIn(no, aliveImageNos);
        }

        // 4. 루프를 돌며 순서 교정(Dirty Check) 및 신규 파일 매칭 삽입(Loop Counter 방식)
        int fileIndex = 0;
        for (ImgUpdateSortReqDto dto : sortList) {
            if (dto.getImageNo() != null) {
                // ① 기존 이미지: 삭제되지 않고 화면에 남아있으므로 순서(sort)만 변경
                ImgOfficeEntity existingImg = imgOfficeRepository.findById(dto.getImageNo())
                        .orElseThrow(() -> new EntityNotFoundException("Station Image Not Found"));
                existingImg.updateSort(dto.getSort());
            } else {
                // ② 신규 이미지: 드래그 앤 드롭으로 섞인 null 자리에 순서대로 파일을 매칭하여 S3 URL 발급 후 저장
                if (files != null && fileIndex < files.size()) {
                    MultipartFile currentFile = files.get(fileIndex++);
                    String s3Url = "https://temp-bucket.s3.amazonaws.com/temp_"
                            + System.currentTimeMillis() + "_"
                            + currentFile.getOriginalFilename();

                    ImgOfficeEntity newImg = ImgOfficeEntity.from(officeEntity, s3Url, dto.getSort());
                    imgOfficeRepository.save(newImg);
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
