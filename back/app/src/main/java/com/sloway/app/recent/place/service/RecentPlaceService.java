package com.sloway.app.recent.place.service;

import com.sloway.app.place.entity.place.PlaceEntity;
import com.sloway.app.place.repository.place.PlaceRepository;
import com.sloway.app.recent.place.dto.response.RecentPlaceResDto;
import com.sloway.app.recent.place.entity.RecentPlaceEntity;
import com.sloway.app.recent.place.repository.RecentPlaceRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
@Service
public class RecentPlaceService {

    private final RecentPlaceRepository recentPlaceRepository;
    private final PlaceRepository placeRepository;


    @Transactional
    public void recentPlaceSave(Long placeNo) {

        PlaceEntity no = placeRepository.findByNo(placeNo)
                .orElseThrow(()-> new RuntimeException("해당 공간을 찾을 수 없습니다."));
//        Long userNo = SecurityUtil.getMemberId();

        RecentPlaceEntity entity = RecentPlaceEntity.builder()
                .placeNo(no)
//                .userNo()
                .build();

        recentPlaceRepository.save(entity);
    }

    public List<RecentPlaceResDto> recentPlaceList() {

        List<RecentPlaceEntity> entityList = recentPlaceRepository.recentPlaceList();
        return entityList
                .stream()
                .map(RecentPlaceResDto::from)
                .toList();
    }

    public void recentPlaceDeleteByNo(Long no) {
        recentPlaceRepository.deleteById(no);
    }

    public void recentPlaceDeleteAll() {
//        Long userNo = SecurityUtil.getMemberId();
        recentPlaceRepository.deleteAllByUserNo();
    }
}
