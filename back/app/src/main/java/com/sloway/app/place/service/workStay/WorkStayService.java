package com.sloway.app.place.service.workStay;

import com.sloway.app.place.dto.request.sort.ImgSortReqDto;
import com.sloway.app.place.dto.request.workStay.WorkStayReqDto;
import com.sloway.app.place.dto.request.workStay.WorkStayUpdateReqDto;
import com.sloway.app.place.dto.request.workStay.workOffice.WorkOfficeReqDto;
import com.sloway.app.place.dto.request.workStay.workOffice.WorkOfficeUpdateReqDto;
import com.sloway.app.place.entity.amenity.AmenityEntity;
import com.sloway.app.place.entity.amenity.workStay.WorkAmenityEntity;
import com.sloway.app.place.entity.amenity.workStay.workOffice.WorkOfficeAmenityEntity;
import com.sloway.app.place.entity.place.PlaceEntity;
import com.sloway.app.place.entity.workStay.ImgWorkStayEntity;
import com.sloway.app.place.entity.workStay.WorkExceptionPeriodEntity;
import com.sloway.app.place.entity.workStay.WorkStayEntity;
import com.sloway.app.place.entity.workStay.workOffice.ImgWorkStayOfficeEntity;
import com.sloway.app.place.entity.workStay.workOffice.WorkOfficeEntity;
import com.sloway.app.place.repository.amenity.AmenityRepository;
import com.sloway.app.place.repository.place.PlaceRepository;
import com.sloway.app.place.repository.workStay.WorkStayRepository;
import com.sloway.app.place.repository.workStay.ImgWorkStayRepository;
import com.sloway.app.place.repository.workStay.workOffice.ImgWorkOfficeRepository;
import com.sloway.app.place.repository.workStay.workOffice.WorkOfficeRepository;
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
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class WorkStayService {

    private final WorkStayRepository workStayRepository;
    private final WorkOfficeRepository workOfficeRepository;
    private final PlaceRepository placeRepository;
    private final AmenityRepository amenityRepository;
    private final ImgWorkStayRepository imgWorkStayRepository;
    private final ImgWorkOfficeRepository imgWorkOfficeRepository;

    @Transactional
    public void saveWorkStay(
            WorkStayReqDto dto,
            WorkOfficeReqDto officeDto,
            List<MultipartFile> files,
            List<MultipartFile> officeFiles,
            List<ImgSortReqDto> sortList,
            List<ImgSortReqDto> officeSortList) {

        //부모 테이블 엔티티 조회
        PlaceEntity place = placeRepository.findByNo(dto.getPlaceNo())
                .orElseThrow(() -> new EntityNotFoundException("[PLACE-211] Place Not Found For Save WorkStay"));

        //편의시설 정보 조회
        List<Long> amenityNos = dto.getFacilityList().stream()
                .map(facility -> facility.getAmenityNo())
                .collect(Collectors.toList());
        List<AmenityEntity> amenityEntities = amenityRepository.findAllByNoIn(amenityNos);

        //오피스 편의시설 정보 조회
        List<Long> officeAmenityNos = officeDto.getFacilityList().stream()
                .map(facility -> facility.getAmenityNo())
                .collect(Collectors.toList());
        List<AmenityEntity> officeAmenityEntities = amenityRepository.findAllByNoIn(officeAmenityNos);

        //workStay 저장을 위한 엔티티 변환
        WorkStayEntity entity = dto.toEntity(place,amenityEntities);
        WorkStayEntity savedEntity = workStayRepository.save(entity);
        WorkOfficeEntity officeEntity = officeDto.toEntity(savedEntity,officeAmenityEntities);
        WorkOfficeEntity savedOfficeEntity = workOfficeRepository.save(officeEntity);

        //이미지 aws로 수정
        List<String> dummyUrls = files.stream()
                .map(img -> "https://temp-bucket.s3.amazonaws.com/temp_"
                        + System.currentTimeMillis() + "_"
                        + img.getOriginalFilename())
                .toList();

        int size = Math.min(dummyUrls.size(), sortList.size());
        List<ImgWorkStayEntity> imgEntities = IntStream.range(0, size)
                .mapToObj(i -> {
                    String url = dummyUrls.get(i);
                    int sortValue = sortList.get(i).getSort(); // 정렬 값 추출

                    return ImgWorkStayEntity.from(savedEntity, url, sortValue);
                })
                .collect(Collectors.toList());

        // 이미지 저장
        imgWorkStayRepository.saveAll(imgEntities);

        // office이미지 저장
        //이미지 aws로 수정
        List<String> currentUrls = officeFiles.stream()
                .map(img -> "https://temp-bucket.s3.amazonaws.com/temp_"
                        + System.currentTimeMillis() + "_"
                        + img.getOriginalFilename())
                .toList();

        int sort = Math.min(currentUrls.size(), officeSortList.size());
        List<ImgWorkStayOfficeEntity> imgEntityList = IntStream.range(0, sort)
                .mapToObj(i -> {
                    String url = currentUrls.get(i);
                    int sortValue = officeSortList.get(i).getSort();
                    return ImgWorkStayOfficeEntity.from(savedOfficeEntity, url, sortValue);
                })
                .toList();

        // 이미지 저장
        imgWorkOfficeRepository.saveAll(imgEntityList);
    }

    @Transactional
    public void updateWorkStay(Long no, WorkStayUpdateReqDto stayDto, WorkOfficeUpdateReqDto officeDto) {
        // 1. 기존 WorkStay 엔티티 조회
        WorkStayEntity workStay = workStayRepository.findById(no)
                .orElseThrow(() -> new EntityNotFoundException("[WORKSTAY-301] WorkStay Not Found For Update"));

        // 2. 해당 WorkStay에 속한 WorkOffice 엔티티 조회
        WorkOfficeEntity office = workOfficeRepository.findByWorkStayEntityNo(no)
                .orElseThrow(() -> new EntityNotFoundException("[WORKOFFICE-302] WorkOffice Not Found For Update"));

        // 3. 편의시설 엔티티 조회 (Stay Office 각각)
        List<Long> stayAmenityNos = stayDto.getFacilityList().stream()
                .map(f -> f.getAmenityNo()).toList();
        List<AmenityEntity> stayAmenityEntities = amenityRepository.findAllByNoIn(stayAmenityNos);

        List<Long> officeAmenityNos = officeDto.getFacilityList().stream()
                .map(f -> f.getAmenityNo()).toList();
        List<AmenityEntity> officeAmenityEntities = amenityRepository.findAllByNoIn(officeAmenityNos);


        // 4. WorkStay 업데이트
        workStay.updateInfo(stayDto); // 필드 업데이트 메서드 (Entity 내부에 구현 필요)
        List<WorkAmenityEntity> newStayAmenities = stayAmenityEntities.stream()
                .map(amenity -> WorkAmenityEntity.builder()
                        .workStayEntity(workStay)
                        .amenityEntity(amenity)
                        .build())
                .collect(Collectors.toList());
        // 편의시설
        workStay.updateAmenities(newStayAmenities);
        // 예외기간
        if (stayDto.getExceptionPeriods() != null) {
            List<WorkExceptionPeriodEntity> newPeriods = stayDto.getExceptionPeriods().stream()
                    .map(exDto -> WorkExceptionPeriodEntity.builder()
                            .workStayEntity(workStay)
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
                    .collect(Collectors.toList());

            // 엔티티 내부의 리스트 교체 메서드 호출
            workStay.updateExceptionPeriods(newPeriods);
        } else {
            // 전달된 예외 기간이 없다면 기존 데이터 삭제
            workStay.getWorkExceptionPeriodEntities().clear();
        }

        // 5. WorkOffice 업데이트 (더티 체킹)
        office.updateInfo(officeDto);

        // 6. WorkOffice 편의시설 업데이트 (전체 삭제 후 삽입)
        List<WorkOfficeAmenityEntity> newOfficeAmenities = officeAmenityEntities.stream()
                .map(amenity -> WorkOfficeAmenityEntity.builder()
                        .workOfficeEntity(office)
                        .amenityEntity(amenity)
                        .build())
                .collect(Collectors.toList());

        office.updateAmenities(newOfficeAmenities);
    }

    @Transactional
    public void updateImageWorkStay(Long no, List<MultipartFile> files, List<ImgSortReqDto> sortList, List<MultipartFile> officeFiles, List<ImgSortReqDto> officeSortList) {
        // 1. 엔티티 조회
        WorkStayEntity workStay = workStayRepository.findById(no)
                .orElseThrow(() -> new EntityNotFoundException("[WORKSTAY-315] WorkStay Not Found"));

        WorkOfficeEntity workOffice = workOfficeRepository.findByWorkStayEntityNo(no)
                .orElseThrow(() -> new EntityNotFoundException("[WORKOFFICE-316] WorkOffice Not Found"));

        // 2. WorkStay 이미지 업데이트 (삭제 후 저장)
        // 기존 DB 이미지 데이터 삭제
        imgWorkStayRepository.deleteAllByWorkStayEntityNo(no);

        if (files != null && !files.isEmpty()) {
            List<String> dummyUrls = files.stream()
                    .map(img -> "https://temp-bucket.s3.amazonaws.com/temp_" + System.currentTimeMillis() + "_" + img.getOriginalFilename())
                    .toList();

            int size = Math.min(dummyUrls.size(), sortList.size());
            List<ImgWorkStayEntity> imgEntities = IntStream.range(0, size)
                    .mapToObj(i -> ImgWorkStayEntity.from(workStay, dummyUrls.get(i), sortList.get(i).getSort()))
                    .collect(Collectors.toList());

            imgWorkStayRepository.saveAll(imgEntities);
        }

        // 3. WorkOffice 이미지 업데이트 (삭제 후 저장)
        // 기존 DB 이미지 데이터 삭제
        imgWorkOfficeRepository.deleteAllByWorkOfficeEntityNo(workOffice.getNo());

        if (officeFiles != null && !officeFiles.isEmpty()) {
            List<String> officeUrls = officeFiles.stream()
                    .map(img -> "https://temp-bucket.s3.amazonaws.com/temp_" + System.currentTimeMillis() + "_" + img.getOriginalFilename())
                    .toList();

            int sort = Math.min(officeUrls.size(), officeSortList.size());
            List<ImgWorkStayOfficeEntity> imgEntityList = IntStream.range(0, sort)
                    .mapToObj(i -> ImgWorkStayOfficeEntity.from(workOffice, officeUrls.get(i), officeSortList.get(i).getSort()))
                    .toList();

            imgWorkOfficeRepository.saveAll(imgEntityList);
        }
    }

    @Transactional
    public void deleteWorkStay(Long no) {
        WorkStayEntity workStay = workStayRepository.findById(no)
                .orElseThrow(()->new EntityNotFoundException("[WORKSTAY-318] WorkStay Not Found For Delete"));
        workStay.delete();
        //오피스를 삭제하지 않는 이유는 workStay의 del_yn이 n이면 오피스를 조회할 수 없기때문
    }
}
