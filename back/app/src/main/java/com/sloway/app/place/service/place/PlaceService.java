package com.sloway.app.place.service.place;

import com.sloway.app.place.dto.request.sort.ImgSortReqDto;
import com.sloway.app.place.dto.request.place.PlaceReqDto;
import com.sloway.app.place.dto.request.place.PlaceUpdateReqDto;
import com.sloway.app.place.dto.response.place.PlaceBriefRespDto;
import com.sloway.app.place.dto.response.place.PlaceDetailListRespDto;
import com.sloway.app.place.dto.response.place.PlaceListRespDto;
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
import java.util.Optional;
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
    public void updatePlaceImg(Long no, List<MultipartFile> files, List<ImgSortReqDto> sortList) {
        // Place 조회
        PlaceEntity placeEntity = placeRepository.findByNo(no)
                .orElseThrow(() -> new EntityNotFoundException("[PLACE-305] Place Not Found For Update Images"));

        // 기존 이미지 관계 제거
        placeEntity.getImages().clear();

        // 이미지 aws로 수정
        List<String> dummyUrls = files.stream()
                .map(img -> "https://temp-bucket.s3.amazonaws.com/temp_"
                        + System.currentTimeMillis() + "_"
                        + img.getOriginalFilename())
                .toList();

        int size = Math.min(dummyUrls.size(), sortList.size());
        List<ImgPlaceEntity> newImages = IntStream.range(0, size)
                .mapToObj(i -> {
                    String url = dummyUrls.get(i);
                    int sortValue = sortList.get(i).getSort();
                    return ImgPlaceEntity.from(placeEntity, url, sortValue);
                })
                .toList();

        imgPlaceRepository.saveAll(newImages);
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
}
