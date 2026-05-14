package com.sloway.app.place.service.place;

import com.sloway.app.place.dto.request.place.PlaceImageUpdateDto;
import com.sloway.app.place.dto.request.place.PlaceReqDto;
import com.sloway.app.place.dto.request.place.PlaceUpdateReqDto;
import com.sloway.app.place.entity.place.PlaceEntity;
import com.sloway.app.place.entity.station.StationEntity;
import com.sloway.app.place.repository.place.PlaceRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class PlaceService {

    private final PlaceRepository placeRepository;

    @Transactional
    public void savePlace(PlaceReqDto dto) {
        // 버킷 연결 전 더미데이터 URL 생성(임시구현)
        List<String> dummyUrls = dto.getImages().stream()
                .map(img -> "https://temp-bucket.s3.amazonaws.com/temp_" + System.currentTimeMillis() + ".jpg")
                .collect(Collectors.toList());

        PlaceEntity place = dto.toEntity(dummyUrls);

        placeRepository.save(place);
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

    @Transactional
    public void updatePlaceImg(Long no, PlaceImageUpdateDto dto) {
        List<String> dummyUrls = dto.getImages().stream()
                .map(img -> "https://temp-bucket.s3.amazonaws.com/temp_" + System.currentTimeMillis() + ".jpg")
                .collect(Collectors.toList());

        //원래있던 이미지 경로 삭제
        PlaceEntity placeEntity = placeRepository.findById(dto.getNo())
                .orElseThrow(()->new EntityNotFoundException("[S_AMENITY-200]Station Amenity Not Found For Update"));
        placeEntity.getImages().clear();

        //placeEntity 생성
        PlaceEntity place = dto.toEntity(no, dummyUrls);

        //새로운 이미지 경로 추가
        placeRepository.save(place);
    }
}
