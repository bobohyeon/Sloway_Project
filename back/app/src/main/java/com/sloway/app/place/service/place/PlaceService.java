package com.sloway.app.place.service.place;

import com.sloway.app.place.dto.request.sort.ImgSortReqDto;
import com.sloway.app.place.dto.request.place.PlaceReqDto;
import com.sloway.app.place.dto.request.place.PlaceUpdateReqDto;
import com.sloway.app.place.dto.request.sort.ImgUpdateSortReqDto;
import com.sloway.app.place.dto.response.place.*;
import com.sloway.app.place.entity.place.ImgPlaceEntity;
import com.sloway.app.place.entity.place.PlaceEntity;
import com.sloway.app.place.repository.place.ImgPlaceRepository;
import com.sloway.app.place.repository.place.PlaceRepository;
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
public class PlaceService {

    private final PlaceRepository placeRepository;
    private final ImgPlaceRepository imgPlaceRepository;
    private final HostPlaceService hostPlaceService;

    @Transactional
    public void savePlace(PlaceReqDto dto, List<MultipartFile> files, List<ImgSortReqDto> sortList, Long hostNo) {
        PlaceEntity place = dto.toEntity();

        PlaceEntity placeEntity = placeRepository.save(place);
        hostPlaceService.insertHostPlace("P",hostNo, place.getNo());
        // 이미지 aws로 수정
        List<String> dummyUrls = files.stream()
                .map(img -> "https://temp-bucket.s3.amazonaws.com/temp_"
                        + System.currentTimeMillis() + "_"
                        + img.getOriginalFilename())
                .toList();

        int size = Math.min(dummyUrls.size(), sortList.size());
        List<ImgPlaceEntity> imgEntities = IntStream.range(0, size)

                .mapToObj(i -> {
                    String url = dummyUrls.get(i);
                    int sortValue = sortList.get(i).getSort(); // 정렬 값 추출

                    return ImgPlaceEntity.from(placeEntity, url, sortValue);
                })
                .collect(Collectors.toList());

        // 이미지 저장
        imgPlaceRepository.saveAll(imgEntities);
    }

    @Transactional
    public void updatePlace(Long no, PlaceUpdateReqDto dto) {
        PlaceEntity placeEntity = placeRepository.findByNo(no)
                .orElseThrow(() -> new EntityNotFoundException("[PLACE-303] Not Exist Place On Update Place"));

        placeEntity.updateTitleAndContent(dto.getTitle(), dto.getContent());
    }

    @Transactional
    public void deletePlace(Long no) {
        PlaceEntity placeEntity = placeRepository.findByNo(no)
                .orElseThrow(() -> new EntityNotFoundException("[PLACE-304] Not Exist Place On Delete Place"));

        placeEntity.delete();
    }


    // 이미지 수정 로직 (saveStation 로직 반영)
    @Transactional
    public void updatePlaceImg(Long no, List<MultipartFile> files, List<ImgUpdateSortReqDto> sortList) {
        // 1. Place 조회
        PlaceEntity placeEntity = placeRepository.findByNo(no)
                .orElseThrow(() -> new EntityNotFoundException("[PLACE-305] Place Not Found For Update Images"));

        // 2. 화면에 살아남은 기존 이미지 ID 추출 (새로 추가된 파일인 null은 제외)
        List<Long> aliveImageNos = sortList.stream()
                .map(ImgUpdateSortReqDto::getImageNo) // 💡 DTO에 추가된 imageNo 추출
                .filter(Objects::nonNull)
                .toList();

        // 3. 화면에서 유저가 🗑️ 버튼을 눌러 지워진 이미지들만 DB에서 선택 삭제
        // (※ Repository에 해당 Querydsl 또는 JPQL 메서드가 선언되어 있어야 합니다)
        if (aliveImageNos.isEmpty()) {
            imgPlaceRepository.deleteAllByPlaceEntityNo(no);
        } else {
            imgPlaceRepository.deleteByPlaceEntityNoAndNoNotIn(no, aliveImageNos);
        }

        // 4. 루프를 돌며 순서 교정(Dirty Check) 및 신규 파일 매칭 삽입(Loop Counter 방식)
        int fileIndex = 0;
        for (ImgUpdateSortReqDto dto : sortList) {
            if (dto.getImageNo() != null) {
                // ① 기존 이미지: 삭제되지 않고 화면에 남아있으므로 순서(sort)만 변경
                ImgPlaceEntity existingImg = imgPlaceRepository.findById(dto.getImageNo())
                        .orElseThrow(() -> new EntityNotFoundException("Place Image Not Found"));
                existingImg.updateSort(dto.getSort());
            } else {
                // ② 신규 이미지: 드래그 앤 드롭으로 섞인 null 자리에 순서대로 파일을 매칭하여 S3 URL 발급 후 저장
                if (files != null && fileIndex < files.size()) {
                    MultipartFile currentFile = files.get(fileIndex++);
                    String s3Url = "https://temp-bucket.s3.amazonaws.com/temp_"
                            + System.currentTimeMillis() + "_"
                            + currentFile.getOriginalFilename();

                    ImgPlaceEntity newImg = ImgPlaceEntity.from(placeEntity, s3Url, dto.getSort());
                    imgPlaceRepository.save(newImg);
                }
            }
        }
    }

    public List<PlaceDetailListRespDto> placeDetailList(Long placeNo,Long hostNo) {
        return placeRepository.findPlaceDetailListByHostNo(placeNo,hostNo);
    }

    public PlaceBriefRespDto placeBrief(Long placeNo) {
        PlaceEntity placeEntity = placeRepository.findByNo(placeNo)
                .orElseThrow(()->new EntityNotFoundException("[PLACE-291]Place Not Found For Find Brief"));
        return new PlaceBriefRespDto(placeEntity.getNo(), placeEntity.getTitle(), placeEntity.getType());
    }

    public List<PlaceListRespDto> placeList(Long hostNo) {
        return placeRepository.findPlaceListByHostNo(hostNo);
    }

    public List<MasterPlaceRespDto> selectMasterPlaceList(String type, Long memberNo) {
        return placeRepository.findMasterPlaceListByTypeAndMemberNo(type, memberNo);
    }

    public PlaceUpdateReqDto selectPlaceForUpdate(Long memberNo, Long no) {
        return placeRepository.selectPlaceForUpdate(memberNo, no);
    }

    public PlaceImgListRespDto selectImageList(Long no, Long memberNo) {
        return placeRepository.selectImageList(no,memberNo);
    }
}
