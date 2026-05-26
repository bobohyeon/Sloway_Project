package com.sloway.app.reservation.blackOut.service;

import com.sloway.app.common.exception.CustomException;
import com.sloway.app.host.entity.HostEntity;
import com.sloway.app.host.repository.HostRepository;
import com.sloway.app.place.entity.place.PlaceEntity;
import com.sloway.app.place.repository.hostPlace.HostPlaceRepository;
import com.sloway.app.place.repository.place.PlaceRepository;
import com.sloway.app.reservation.RsvnErrorCode;
import com.sloway.app.reservation.blackOut.dto.request.BlackOutReqDto;
import com.sloway.app.reservation.blackOut.dto.response.BlackOutResDto;
import com.sloway.app.reservation.blackOut.entity.BlackOutEntity;
import com.sloway.app.reservation.blackOut.repository.BlackOutRepository;
import com.sloway.app.review.ReviewErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class BlackOutService {

    private final BlackOutRepository blackOutRepository;
    private final PlaceRepository placeRepository;
    private final HostRepository hostRepository;
    private final HostPlaceRepository hostPlaceRepository;

    @Transactional
    public void save(Long placeNo, BlackOutReqDto dto){

        PlaceEntity place = placeRepository.findByNo(placeNo)
                .orElseThrow(()-> new CustomException(RsvnErrorCode.PLACE_NOT_FOUND));

        BlackOutEntity entity = dto.toEntity(place);

        blackOutRepository.save(entity);
    }

    public List<BlackOutResDto> findAll(Long placeNo){

        PlaceEntity place = placeRepository.findByNo(placeNo)
                .orElseThrow(()-> new CustomException(RsvnErrorCode.PLACE_NOT_FOUND));

        return blackOutRepository.findByPlaceNo(place)
                .stream()
                .map(BlackOutResDto::from)
                .toList();
    }

    @Transactional
    public void editBlackOut(Long memberNo, Long no, BlackOutReqDto dto){
        HostEntity host = hostRepository.findByMemberNo(memberNo)
                .orElseThrow(() -> new CustomException(ReviewErrorCode.HOST_NOT_FOUND));

        boolean exhost = hostPlaceRepository.existsByHostEntityNoAndPlaceEntityNo(host.getNo(), dto.getPlaceNo());
        if(!exhost){
            throw new CustomException(RsvnErrorCode.UNAUTHORIZED_ACCESS);
        }

        BlackOutEntity entity = blackOutRepository.findById(no)
                .orElseThrow(()->new CustomException(RsvnErrorCode.BLACKOUT_NOT_FOUND));

        entity.editBlackOut(
                dto.getTitle()
                ,dto.getMemo()
                ,dto.getReasonType()
                ,dto.getStartDate()
                ,dto.getEndDate()
                ,dto.getStartTime()
                ,dto.getEndTime()
        );
    }

    @Transactional
    public void deleteBlackOut(Long memberNo, Long no){
        HostEntity host = hostRepository.findByMemberNo(memberNo)
                .orElseThrow(() -> new CustomException(ReviewErrorCode.HOST_NOT_FOUND));
        BlackOutEntity blackOutEntity = blackOutRepository.findById(no)
                .orElseThrow(() -> new CustomException(RsvnErrorCode.BLACKOUT_NOT_FOUND));

        boolean isOwner = hostPlaceRepository
                .existsByHostEntityNoAndPlaceEntityNo(host.getNo(), blackOutEntity.getPlaceNo().getNo());
        if(!isOwner){
            throw new CustomException(RsvnErrorCode.UNAUTHORIZED_ACCESS);
        }

        blackOutRepository.delete(blackOutEntity);
    }

}
