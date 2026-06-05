package com.sloway.app.place.service.place;

import com.sloway.app.aws.service.S3Service;
import com.sloway.app.common.exception.CustomException;
import com.sloway.app.host.common.HostErrorCode;
import com.sloway.app.host.entity.HostEntity;
import com.sloway.app.host.repository.HostRepository;
import com.sloway.app.place.dto.request.sort.ImgSortReqDto;
import com.sloway.app.place.dto.request.place.PlaceReqDto;
import com.sloway.app.place.dto.request.place.PlaceUpdateReqDto;
import com.sloway.app.place.dto.request.sort.ImgUpdateSortReqDto;
import com.sloway.app.place.dto.response.place.*;
import com.sloway.app.place.entity.hostPlace.HostPlaceEntity;
import com.sloway.app.place.entity.place.ImgPlaceEntity;
import com.sloway.app.place.entity.place.PlaceEntity;
import com.sloway.app.place.repository.hostPlace.HostPlaceRepository;
import com.sloway.app.place.repository.place.ImgPlaceRepository;
import com.sloway.app.place.repository.place.PlaceRepository;
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
public class PlaceService {

    private final PlaceRepository placeRepository;
    private final ImgPlaceRepository imgPlaceRepository;
    private final HostPlaceService hostPlaceService;
    private final HostPlaceRepository hostPlaceRepository;
    private final S3Service s3Service;
    private final HostRepository hostRepository;


    @Transactional
    public void savePlace(PlaceReqDto dto, List<MultipartFile> files, List<ImgSortReqDto> sortList, Long memberNo) {
        PlaceEntity place = dto.toEntity();

        PlaceEntity placeEntity = placeRepository.save(place);
        hostPlaceService.insertHostPlace("P", memberNo, place.getNo());

        // 파일 리스트가 있다면 S3 업로드 후 엔티티 생성
        if (files != null && !files.isEmpty()) {
            List<ImgPlaceEntity> imgEntities = IntStream.range(0, files.size())
                    .mapToObj(i -> {
                        try {
                            // S3 업로드 후 Key 반환 (또는 URL)
                            String s3Key = s3Service.upload(files.get(i), "place");
                            int sortValue = sortList.get(i).getSort();
                            return ImgPlaceEntity.from(placeEntity, s3Key, sortValue);
                        } catch (IOException e) {
                            throw new RuntimeException("S3 업로드 실패", e);
                        }
                    })
                    .collect(Collectors.toList());

            imgPlaceRepository.saveAll(imgEntities);
        }
    }

    @Transactional
    public void updatePlace(Long no, PlaceUpdateReqDto dto, Long hostNo) {
        PlaceEntity placeEntity = placeRepository.findByNo(no)
                .orElseThrow(() -> new EntityNotFoundException("[PLACE-303] Not Exist Place On Update Place"));

        HostPlaceEntity hostPlaceEntity =hostPlaceRepository.findHostPlaceLatest(no, hostNo);

        if(hostPlaceEntity != null){
            hostPlaceRepository.delete(hostPlaceEntity);
        }

        hostPlaceService.insertHostPlace("P", hostNo, placeEntity.getNo());
        placeEntity.updateTitleAndContent(dto.getTitle(), dto.getContent());
    }

    @Transactional
    public void deletePlace(Long no) {
        PlaceEntity placeEntity = placeRepository.findByNo(no)
                .orElseThrow(() -> new EntityNotFoundException("[PLACE-304] Not Exist Place On Delete Place"));

        placeEntity.delete();
    }


    @Transactional
    public void updatePlaceImg(Long no, List<MultipartFile> files, List<ImgUpdateSortReqDto> sortList, Long memberNo) {
        // 1. Place 조회
        PlaceEntity placeEntity = placeRepository.findByNo(no)
                .orElseThrow(() -> new EntityNotFoundException("[PLACE-305] Place Not Found For Update Images"));

        HostPlaceEntity hostPlaceEntity = hostPlaceRepository.findHostPlaceLatest(no, memberNo);

        if (hostPlaceEntity != null) {
            hostPlaceRepository.delete(hostPlaceEntity);
        }

        hostPlaceService.insertHostPlace("P", memberNo, placeEntity.getNo());

        // 2. 화면에 살아남은 기존 이미지 ID 추출
        List<Long> aliveImageNos = sortList.stream()
                .map(ImgUpdateSortReqDto::getImageNo)
                .filter(Objects::nonNull)
                .toList();

        // 3. 삭제될 이미지들 S3에서 실제 파일 삭제 (DB 삭제 전 수행)
        List<ImgPlaceEntity> toDeleteImages = imgPlaceRepository.findByPlaceEntityNoAndNoNotIn(no, aliveImageNos);
        for (ImgPlaceEntity img : toDeleteImages) {
            // S3 삭제 (URL이 저장되어 있으므로 그대로 전달)
            s3Service.delete(img.getCurrentUrl());
        }

        // 4. DB에서 선택 삭제
        if (aliveImageNos.isEmpty()) {
            imgPlaceRepository.deleteAllByPlaceEntityNo(no);
        } else {
            imgPlaceRepository.deleteByPlaceEntityNoAndNoNotIn(no, aliveImageNos);
        }

        // 5. 순서 교정(Dirty Check) 및 신규 파일 매칭 삽입
        int fileIndex = 0;
        for (ImgUpdateSortReqDto dto : sortList) {
            if (dto.getImageNo() != null) {
                // ① 기존 이미지: 삭제되지 않고 화면에 남아있으므로 순서(sort)만 변경
                ImgPlaceEntity existingImg = imgPlaceRepository.findById(dto.getImageNo())
                        .orElseThrow(() -> new EntityNotFoundException("Place Image Not Found"));
                existingImg.updateSort(dto.getSort());
            } else {
                // ② 신규 이미지: S3 업로드 후 저장
                if (files != null && fileIndex < files.size()) {
                    try {
                        MultipartFile currentFile = files.get(fileIndex++);
                        // S3 업로드 (풀 URL 반환하도록 s3Service 수정 반영)
                        String s3Url = s3Service.upload(currentFile, "place");

                        ImgPlaceEntity newImg = ImgPlaceEntity.from(placeEntity, s3Url, dto.getSort());
                        imgPlaceRepository.save(newImg);
                    } catch (IOException e) {
                        throw new RuntimeException("S3 이미지 업로드 중 오류 발생", e);
                    }
                }
            }
        }
    }

    public List<PlaceDetailListRespDto> placeDetailList(Long placeNo, Long hostNo) {
        return placeRepository.findPlaceDetailListByHostNo(placeNo, hostNo);
    }

    public PlaceBriefRespDto placeBrief(Long placeNo) {
        PlaceEntity placeEntity = placeRepository.findByNo(placeNo)
                .orElseThrow(() -> new EntityNotFoundException("[PLACE-291]Place Not Found For Find Brief"));
        return new PlaceBriefRespDto(placeEntity.getNo(), placeEntity.getTitle(), placeEntity.getType());
    }

    public List<PlaceListRespDto> placeList(Long memberNo) {
        return placeRepository.findPlaceListByMemberNo(memberNo);
    }

    public List<MasterPlaceRespDto> selectMasterPlaceList(String type, Long memberNo) {
        return placeRepository.findMasterPlaceListByTypeAndMemberNo(type, memberNo);
    }

    public PlaceUpdateReqDto selectPlaceForUpdate(Long memberNo, Long no) {
        return placeRepository.selectPlaceForUpdate(memberNo, no);
    }

    public PlaceImgListRespDto selectImageList(Long no, Long memberNo) {
        return placeRepository.selectImageList(no, memberNo);
    }

    public List<PlaceCardDto> getTop4PlacesByType() {
        return placeRepository.getTop4PlacesByType();
    }

    public List<PlaceCardDto> getRecommendPlace() {
        return placeRepository.getRecommendPlace();
    }

    public WorkStayCardDto getRandomWorkStay() {
        return placeRepository.getRandomWorkStay();
    }

    public PlaceImgListRespDto getImageList(Long no) {
        List<PlaceImgListRespDto.ImageInfo> imageList = imgPlaceRepository.getImageList(no);

        return PlaceImgListRespDto.builder()
                .placeImages(imageList)
                .build();
    }
    //오준호 수정
    public List<PlaceListRespDto> placeListForAdmin(Long hostNo) {
        HostEntity host = hostRepository.findById(hostNo)
                .orElseThrow(() -> new CustomException(HostErrorCode.HOST_NOT_FOUND));
        return placeList(host.getMemberNo());
    }

}
