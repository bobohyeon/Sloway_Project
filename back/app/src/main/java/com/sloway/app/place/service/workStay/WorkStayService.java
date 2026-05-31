package com.sloway.app.place.service.workStay;

import com.sloway.app.place.dto.request.sort.ImgSortReqDto;
import com.sloway.app.place.dto.request.sort.ImgUpdateSortReqDto;
import com.sloway.app.place.dto.request.workStay.WorkStayReqDto;
import com.sloway.app.place.dto.request.workStay.WorkStayUpdateReqDto;
import com.sloway.app.place.dto.request.workStay.workOffice.WorkOfficeReqDto;
import com.sloway.app.place.dto.request.workStay.workOffice.WorkOfficeUpdateReqDto;
import com.sloway.app.place.dto.response.station.StationDetailRespDto;
import com.sloway.app.place.dto.response.workStay.WorkStayImageListRespDto;
import com.sloway.app.place.dto.response.workStay.WorkStayUpdateDetailRespDto;
import com.sloway.app.place.entity.amenity.AmenityEntity;
import com.sloway.app.place.entity.amenity.workStay.WorkAmenityEntity;
import com.sloway.app.place.entity.amenity.workStay.workOffice.WorkOfficeAmenityEntity;
import com.sloway.app.place.entity.hostPlace.HostPlaceEntity;
import com.sloway.app.place.entity.place.PlaceEntity;
import com.sloway.app.place.entity.workStay.ImgWorkStayEntity;
import com.sloway.app.place.entity.workStay.WorkExceptionPeriodEntity;
import com.sloway.app.place.entity.workStay.WorkStayEntity;
import com.sloway.app.place.entity.workStay.workOffice.ImgWorkStayOfficeEntity;
import com.sloway.app.place.entity.workStay.workOffice.WorkOfficeEntity;
import com.sloway.app.place.repository.amenity.AmenityRepository;
import com.sloway.app.place.repository.hostPlace.HostPlaceRepository;
import com.sloway.app.place.repository.place.PlaceRepository;
import com.sloway.app.place.repository.workStay.WorkStayRepository;
import com.sloway.app.place.repository.workStay.ImgWorkStayRepository;
import com.sloway.app.place.repository.workStay.workOffice.ImgWorkOfficeRepository;
import com.sloway.app.place.repository.workStay.workOffice.WorkOfficeRepository;
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
    private final HostPlaceService hostPlaceService;
    private final HostPlaceRepository hostPlaceRepository;

    @Transactional
    public void saveWorkStay(
            WorkStayReqDto dto,
            WorkOfficeReqDto officeDto,
            List<MultipartFile> files,
            List<MultipartFile> officeFiles,
            List<ImgSortReqDto> sortList,
            List<ImgSortReqDto> officeSortList,
            Long memberNo) {

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

        //workOffice저장
        WorkOfficeEntity officeEntity = officeDto.toEntity(savedEntity,officeAmenityEntities);
        WorkOfficeEntity savedOfficeEntity = workOfficeRepository.save(officeEntity);

        //검수 저장
        hostPlaceService.insertHostPlace("W",memberNo, savedEntity.getNo());

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
    public void updateWorkStay(Long no, WorkStayUpdateReqDto stayDto, WorkOfficeUpdateReqDto officeDto, Long memberNo) {
        // 1. 기존 WorkStay 엔티티 조회
        WorkStayEntity workStay = workStayRepository.findById(no)
                .orElseThrow(() -> new EntityNotFoundException("[WORKSTAY-301] WorkStay Not Found For Update"));

        // 2. 해당 WorkStay에 속한 WorkOffice 엔티티 조회
        WorkOfficeEntity office = workOfficeRepository.findByWorkStayEntityNo(no)
                .orElseThrow(() -> new EntityNotFoundException("[WORKOFFICE-302] WorkOffice Not Found For Update"));

        // 검수 추가
        HostPlaceEntity hostPlaceEntity =hostPlaceRepository.findHostWorkLatest(no, memberNo);

        if(hostPlaceEntity != null){
            hostPlaceRepository.delete(hostPlaceEntity);
        }

        hostPlaceService.insertHostPlace("W", memberNo, workStay.getNo());


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

// imageUpdateReqDto만들어서 구현예정 현재 파일에 대해서만 처리하게 되어있는데
    @Transactional
    public void updateImageWorkStay(Long no,
                                    List<MultipartFile> files, List<ImgUpdateSortReqDto> sortList,
                                    List<MultipartFile> officeFiles, List<ImgUpdateSortReqDto> officeSortList, Long memberNo) {
        // 1. 엔티티 조회
        WorkStayEntity workStay = workStayRepository.findById(no)
                .orElseThrow(() -> new EntityNotFoundException("[WORKSTAY-315] WorkStay Not Found"));

        WorkOfficeEntity workOffice = workOfficeRepository.findByWorkStayEntityNo(no)
                .orElseThrow(() -> new EntityNotFoundException("[WORKOFFICE-316] WorkOffice Not Found"));

        // 검수 추가
        HostPlaceEntity hostPlaceEntity =hostPlaceRepository.findHostWorkLatest(no, memberNo);

        if(hostPlaceEntity != null){
            hostPlaceRepository.delete(hostPlaceEntity);
        }

        hostPlaceService.insertHostPlace("W", memberNo, workStay.getNo());


        // 2. WorkStay 숙소 이미지 업데이트 (Upsert & Delete)
        // 화면에 살아남은 기존 이미지 ID 추출 (새로 추가된 파일인 null은 제외)
        List<Long> aliveStayImageNos = sortList.stream()
                .map(ImgUpdateSortReqDto::getImageNo)
                .filter(Objects::nonNull)
                .toList();

        // 화면에서 지워진 이미지들은 DB에서 일괄 삭제
        if (aliveStayImageNos.isEmpty()) {
            imgWorkStayRepository.deleteAllByWorkStayEntityNo(no);
        } else {
            imgWorkStayRepository.deleteByWorkStayEntityNoAndNoNotIn(no, aliveStayImageNos);
        }

        // 루프를 돌며 순서 교정 및 신규 파일 매칭 삽입
        int fileIndex = 0;
        for (ImgUpdateSortReqDto dto : sortList) {
            if (dto.getImageNo() != null) {
                // 기존 이미지: 순서(sort)만 변경
                ImgWorkStayEntity existingImg = imgWorkStayRepository.findById(dto.getImageNo())
                        .orElseThrow(() -> new EntityNotFoundException("Image Not Found"));
                existingImg.updateSort(dto.getSort()); // 엔티티 내부 변경 감지(Dirty Check) 작동
            } else {
                // 신규 이미지: 순서대로 파일을 꺼내 URL 매핑 후 저장
                if (files != null && fileIndex < files.size()) {
                    MultipartFile currentFile = files.get(fileIndex++);
                    String s3Url = "https://temp-bucket.s3.amazonaws.com/temp_" + System.currentTimeMillis() + "_" + currentFile.getOriginalFilename();

                    ImgWorkStayEntity newImg = ImgWorkStayEntity.from(workStay, s3Url, dto.getSort());
                    imgWorkStayRepository.save(newImg);
                }
            }
        }

        // 3. WorkOffice 오피스 이미지 업데이트 (Upsert & Delete)
        List<Long> aliveOfficeImageNos = officeSortList.stream()
                .map(ImgUpdateSortReqDto::getImageNo)
                .filter(Objects::nonNull)
                .toList();

        if (aliveOfficeImageNos.isEmpty()) {
            imgWorkOfficeRepository.deleteAllByWorkOfficeEntityNo(workOffice.getNo());
        } else {
            imgWorkOfficeRepository.deleteByWorkOfficeEntityNoAndNoNotIn(workOffice.getNo(), aliveOfficeImageNos);
        }

        int officeFileIndex = 0;
        for (ImgUpdateSortReqDto dto : officeSortList) {
            if (dto.getImageNo() != null) {
                // 기존 오피스 이미지: 순서(sort)만 변경
                ImgWorkStayOfficeEntity existingOfficeImg = imgWorkOfficeRepository.findById(dto.getImageNo())
                        .orElseThrow(() -> new EntityNotFoundException("Office Image Not Found"));
                existingOfficeImg.updateSort(dto.getSort());
            } else {
                // 신규 오피스 이미지: 파일 매칭 저장
                if (officeFiles != null && officeFileIndex < officeFiles.size()) {
                    MultipartFile currentFile = officeFiles.get(officeFileIndex++);
                    String s3Url = "https://temp-bucket.s3.amazonaws.com/temp_" + System.currentTimeMillis() + "_" + currentFile.getOriginalFilename();

                    ImgWorkStayOfficeEntity newOfficeImg = ImgWorkStayOfficeEntity.from(workOffice, s3Url, dto.getSort());
                    imgWorkOfficeRepository.save(newOfficeImg);
                }
            }
        }
    }

    @Transactional
    public void deleteWorkStay(Long no) {
        WorkStayEntity workStay = workStayRepository.findById(no)
                .orElseThrow(()->new EntityNotFoundException("[WORKSTAY-318] WorkStay Not Found For Delete"));
        workStay.delete();
        //오피스를 삭제하지 않는 이유는 workStay의 del_yn이 n이면 오피스를 조회할 수 없기때문
    }

    public WorkStayImageListRespDto selectImageList(Long no, Long memberNo) {
        return workStayRepository.selectImageList(no, memberNo);
    }

    public StationDetailRespDto selectWorkStayDetailDashBoard(Long no, Long memberNo) {
        return workStayRepository.selectWorkStayDetailDashBoard(no, memberNo);
    }

    public WorkStayUpdateDetailRespDto selectDetailForUpdate(Long no, Long memberNo) {
        return workStayRepository.selectDetailForUpdate(no,memberNo);
    }
}
