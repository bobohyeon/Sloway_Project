package com.sloway.app.place.service.workStay;

import com.sloway.app.aws.service.S3Service;
import com.sloway.app.place.dto.request.sort.ImgSortReqDto;
import com.sloway.app.place.dto.request.sort.ImgUpdateSortReqDto;
import com.sloway.app.place.dto.request.workStay.WorkStayReqDto;
import com.sloway.app.place.dto.request.workStay.WorkStayUpdateReqDto;
import com.sloway.app.place.dto.request.workStay.workOffice.WorkOfficeReqDto;
import com.sloway.app.place.dto.request.workStay.workOffice.WorkOfficeUpdateReqDto;
import com.sloway.app.place.dto.response.place.PlaceImgListRespDto;
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

import java.io.IOException;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

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
    private final S3Service s3Service;

    @Transactional
    public void saveWorkStay(
            WorkStayReqDto dto,
            WorkOfficeReqDto officeDto,
            List<MultipartFile> files,
            List<MultipartFile> officeFiles,
            List<ImgSortReqDto> sortList,
            List<ImgSortReqDto> officeSortList,
            Long memberNo) {

        // 1. 엔티티 조회
        PlaceEntity place = placeRepository.findByNo(dto.getPlaceNo())
                .orElseThrow(() -> new EntityNotFoundException("[PLACE-211] Place Not Found"));

        List<AmenityEntity> amenityEntities = amenityRepository.findAllByNoIn(
                dto.getFacilityList().stream().map(f -> f.getAmenityNo()).toList());

        List<AmenityEntity> officeAmenityEntities = amenityRepository.findAllByNoIn(
                officeDto.getFacilityList().stream().map(f -> f.getAmenityNo()).toList());

        // 2. WorkStay 및 WorkOffice 저장
        WorkStayEntity savedEntity = workStayRepository.save(dto.toEntity(place, amenityEntities));
        WorkOfficeEntity savedOfficeEntity = workOfficeRepository.save(officeDto.toEntity(savedEntity, officeAmenityEntities));

        // 3. 검수 저장
        hostPlaceService.insertHostPlace("W", memberNo, savedEntity.getNo());

        // 4. WorkStay 이미지 S3 저장
        if (files != null && !files.isEmpty()) {
            List<ImgWorkStayEntity> imgEntities = IntStream.range(0, files.size())
                    .mapToObj(i -> {
                        try {
                            String s3Url = s3Service.upload(files.get(i), "workStay");
                            int sortValue = sortList.get(i).getSort();
                            return ImgWorkStayEntity.from(savedEntity, s3Url, sortValue);
                        } catch (IOException e) {
                            throw new RuntimeException("WorkStay 이미지 업로드 실패", e);
                        }
                    })
                    .collect(Collectors.toList());
            imgWorkStayRepository.saveAll(imgEntities);
        }

        // 5. WorkOffice 이미지 S3 저장
        if (officeFiles != null && !officeFiles.isEmpty()) {
            List<ImgWorkStayOfficeEntity> imgEntityList = IntStream.range(0, officeFiles.size())
                    .mapToObj(i -> {
                        try {
                            String s3Url = s3Service.upload(officeFiles.get(i), "workOffice");
                            int sortValue = officeSortList.get(i).getSort();
                            return ImgWorkStayOfficeEntity.from(savedOfficeEntity, s3Url, sortValue);
                        } catch (IOException e) {
                            throw new RuntimeException("WorkOffice 이미지 업로드 실패", e);
                        }
                    })
                    .toList();
            imgWorkOfficeRepository.saveAll(imgEntityList);
        }
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

    @Transactional
    public void updateImageWorkStay(Long no,
                                    List<MultipartFile> files, List<ImgUpdateSortReqDto> sortList,
                                    List<MultipartFile> officeFiles, List<ImgUpdateSortReqDto> officeSortList, Long memberNo) {
        // 1. 엔티티 조회
        WorkStayEntity workStay = workStayRepository.findById(no)
                .orElseThrow(() -> new EntityNotFoundException("[WORKSTAY-315] WorkStay Not Found"));

        WorkOfficeEntity workOffice = workOfficeRepository.findByWorkStayEntityNo(no)
                .orElseThrow(() -> new EntityNotFoundException("[WORKOFFICE-316] WorkOffice Not Found"));

        // 검수 처리
        HostPlaceEntity hostPlaceEntity = hostPlaceRepository.findHostWorkLatest(no, memberNo);
        if (hostPlaceEntity != null) {
            hostPlaceRepository.delete(hostPlaceEntity);
        }
        hostPlaceService.insertHostPlace("W", memberNo, workStay.getNo());

        // 2. WorkStay 숙소 이미지 업데이트
        List<Long> aliveStayImageNos = sortList.stream().map(ImgUpdateSortReqDto::getImageNo).filter(Objects::nonNull).toList();

        // 삭제할 이미지 S3 파일 제거
        List<ImgWorkStayEntity> toDeleteStay = imgWorkStayRepository.findByWorkStayEntityNoAndNoNotIn(no, aliveStayImageNos);
        toDeleteStay.forEach(img -> s3Service.delete(img.getCurrentUrl()));

        // DB 삭제
        if (aliveStayImageNos.isEmpty()) imgWorkStayRepository.deleteAllByWorkStayEntityNo(no);
        else imgWorkStayRepository.deleteByWorkStayEntityNoAndNoNotIn(no, aliveStayImageNos);

        // 신규 등록 및 순서 변경
        int fileIndex = 0;
        for (ImgUpdateSortReqDto dto : sortList) {
            if (dto.getImageNo() != null) {
                imgWorkStayRepository.findById(dto.getImageNo()).ifPresent(img -> img.updateSort(dto.getSort()));
            } else if (files != null && fileIndex < files.size()) {
                try {
                    String s3Url = s3Service.upload(files.get(fileIndex++), "workStay");
                    ImgWorkStayEntity entity = ImgWorkStayEntity.from(workStay, s3Url, dto.getSort());

// 여기서 로그를 출력해서 확인하세요
                    System.out.println("DEBUG: 엔티티 저장 직전 URL 값 -> " + entity.getCurrentUrl());
                    imgWorkStayRepository.save(ImgWorkStayEntity.from(workStay, s3Url, dto.getSort()));
                } catch (IOException e) { throw new RuntimeException("WorkStay 이미지 업로드 실패", e); }
            }
        }

        // 3. WorkOffice 오피스 이미지 업데이트
        List<Long> aliveOfficeImageNos = officeSortList.stream().map(ImgUpdateSortReqDto::getImageNo).filter(Objects::nonNull).toList();

        // 삭제할 이미지 S3 파일 제거
        List<ImgWorkStayOfficeEntity> toDeleteOffice = imgWorkOfficeRepository.findByWorkOfficeEntityNoAndNoNotIn(workOffice.getNo(), aliveOfficeImageNos);
        toDeleteOffice.forEach(img -> s3Service.delete(img.getCurrentUrl()));

        // DB 삭제
        if (aliveOfficeImageNos.isEmpty()) imgWorkOfficeRepository.deleteAllByWorkOfficeEntityNo(workOffice.getNo());
        else imgWorkOfficeRepository.deleteByWorkOfficeEntityNoAndNoNotIn(workOffice.getNo(), aliveOfficeImageNos);

        // 신규 등록 및 순서 변경
        int officeFileIndex = 0;
        for (ImgUpdateSortReqDto dto : officeSortList) {
            if (dto.getImageNo() != null) {
                imgWorkOfficeRepository.findById(dto.getImageNo()).ifPresent(img -> img.updateSort(dto.getSort()));
            } else if (officeFiles != null && officeFileIndex < officeFiles.size()) {
                try {
                    String s3Url = s3Service.upload(officeFiles.get(officeFileIndex++), "workOffice");
                    imgWorkOfficeRepository.save(ImgWorkStayOfficeEntity.from(workOffice, s3Url, dto.getSort()));
                } catch (IOException e) { throw new RuntimeException("WorkOffice 이미지 업로드 실패", e); }
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

    public PlaceImgListRespDto getImageList(Long no) {
        // 1. WorkStay 이미지 조회
        List<PlaceImgListRespDto.ImageInfo> stayImages = imgWorkStayRepository.getImageList(no);

        // 2. WorkOffice 이미지 조회
        List<PlaceImgListRespDto.ImageInfo> officeImages = imgWorkOfficeRepository.getImageList(no);

        // 3. 병합 및 정렬
        List<PlaceImgListRespDto.ImageInfo> allImages = Stream.concat(stayImages.stream(), officeImages.stream())
                .sorted(Comparator.comparingInt(PlaceImgListRespDto.ImageInfo::getSort))
                .toList();

        return PlaceImgListRespDto.builder()
                .placeImages(allImages)
                .build();
    }
}
