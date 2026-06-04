package com.sloway.app.place.service.like;

import com.sloway.app.member.entity.UserEntity;
import com.sloway.app.member.repository.UserRepository;
import com.sloway.app.place.dto.response.like.LikeRespDto;
import com.sloway.app.place.entity.like.LikeEntity;
import com.sloway.app.place.entity.place.PlaceEntity;
import com.sloway.app.place.repository.like.LikeRespository;
import com.sloway.app.place.repository.place.PlaceRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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
    public void saveLike(Long placeNo, Long memberNo) {
        PlaceEntity placeEntity = placeRepository.findByNo(placeNo)
                .orElseThrow(()->new EntityNotFoundException("[PLACE-380] Place Not Found For Like Insert"));
        UserEntity userEntity = userRepository.findByMemberNo(memberNo)
                .orElseThrow(()->new EntityNotFoundException("[USER-311] User Not Found For Like Insert"));

        LikeEntity like = LikeEntity.builder()
                .placeEntity(placeEntity)
                .userEntity(userEntity)
                .build();

        likeRespository.save(like);
    }

    @Transactional
    public void deleteLike(Long likeNo,Long memberNo) {
        UserEntity userEntity = userRepository.findByMemberNo(memberNo)
                .orElseThrow(()->new EntityNotFoundException("[USER-312] User Not Found For Like Delete"));

        LikeEntity like = likeRespository.findById(likeNo)
                .orElseThrow(()->new EntityNotFoundException("[LIKE-301] Like Not Found For Like Delete"));
        if(like.getUserEntity().equals(userEntity)) {
            likeRespository.delete(like);
        }else {
            return;
        }
    }

    public List<LikeRespDto> likeList(Long memberNo) {
        return likeRespository.findByMemberNo(memberNo);
    }
}
