package com.sloway.app.place.service.like;

import com.sloway.app.member.entity.UserEntity;
import com.sloway.app.member.repository.UserRepository;
import com.sloway.app.place.entity.like.LikeEntity;
import com.sloway.app.place.entity.place.PlaceEntity;
import com.sloway.app.place.repository.like.LikeRespository;
import com.sloway.app.place.repository.place.PlaceRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class LikeService {

    private final LikeRespository likeRespository;
    private final PlaceRepository placeRepository;
    private final UserRepository userRepository;

    @Transactional
    public void saveLike(Long placeNo, Long userNo) {
        PlaceEntity placeEntity = placeRepository.findByNo(placeNo)
                .orElseThrow(()->new EntityNotFoundException("[PLACE-380] Place Not Found For Like Insert"));
        UserEntity userEntity = userRepository.findById(userNo)
                .orElseThrow(()->new EntityNotFoundException("[USER-311] User Not Found For Like Insert"));

        LikeEntity like = LikeEntity.builder()
                .placeEntity(placeEntity)
                .userEntity(userEntity)
                .build();

        likeRespository.save(like);
    }

    @Transactional
    public void deleteLike(Long likeNo, Long placeNo,Long userNo) {
        PlaceEntity placeEntity = placeRepository.findByNo(placeNo)
                .orElseThrow(()->new EntityNotFoundException("[PLACE-381] Place Not Found For Like Delete"));
        UserEntity userEntity = userRepository.findById(userNo)
                .orElseThrow(()->new EntityNotFoundException("[USER-312] User Not Found For Like Delete"));

    }
}
