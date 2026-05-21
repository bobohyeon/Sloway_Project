package com.sloway.app.review.review.service;

import com.sloway.app.common.exception.CustomException;
import com.sloway.app.place.entity.place.PlaceEntity;
import com.sloway.app.place.repository.place.PlaceRepository;
import com.sloway.app.reservation.RsvnErrorCode;
import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import com.sloway.app.reservation.rsvn.repository.RsvnRepository;
import com.sloway.app.review.ReviewErrorCode;
import com.sloway.app.review.review.dto.request.ReviewCreateReqDto;
import com.sloway.app.review.review.dto.request.ReviewEditReqDto;
import com.sloway.app.review.review.dto.response.ReviewResDto;
import com.sloway.app.review.review.entity.ReviewEntity;
import com.sloway.app.review.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final RsvnRepository rsvnRepository;
    private final PlaceRepository placeRepository;

    //리뷰 작성
    @Transactional
    public void save(Long memberNo, ReviewCreateReqDto reqDto){
        RsvnEntity rsvn = rsvnRepository.findById(reqDto.getRsvnNo())
                .orElseThrow(()-> new CustomException(RsvnErrorCode.RESERVATION_NOT_FOUND));
        if(LocalDateTime.now().isAfter(rsvn.getCheckOut().plusDays(14))){
            throw new CustomException(ReviewErrorCode.REVIEW_PERIOD_EXPIRED);
        }
        if(reviewRepository.findByRsvnNo(rsvn).isPresent()){
            throw new CustomException(ReviewErrorCode.ALREADY_REVIEWED);
        }
        reviewRepository.save(ReviewEntity.builder()
                        .rsvnNo(rsvn)
                        .content(reqDto.getContent())
                        .scoreTotal(reqDto.getScoreTotal())
                        .scoreOffice(reqDto.getScoreOffice())
                        .scoreFocus(reqDto.getScoreFocus())
                        .scoreAmenity(reqDto.getScoreAmenity())
                .build());
    }

    //해당 공간의 리뷰 목록
    public List<ReviewResDto> findAll(Long placeNo){
        PlaceEntity place = placeRepository.findByNo(placeNo)
                .orElseThrow(()->new CustomException(RsvnErrorCode.PLACE_NOT_FOUND));
        return reviewRepository.findByPlaceNo(place)
                .stream()
                .map(ReviewResDto::from)
                .toList();
    }

    //리뷰 상세조회
    public ReviewResDto findOne(Long no){
        ReviewEntity entity = reviewRepository.findById(no)
                .orElseThrow(()->new CustomException(ReviewErrorCode.REVIEW_NOT_FOUND));
        return ReviewResDto.from(entity);
    }

    //리뷰 수정
    @Transactional
    public void editReview(Long no, ReviewEditReqDto editReqDto){
        ReviewEntity entity = reviewRepository.findById(no)
                .orElseThrow(()->new CustomException(ReviewErrorCode.REVIEW_NOT_FOUND));

        entity.editReview(
                editReqDto.getContent(),
                editReqDto.getScoreTotal(),
                editReqDto.getScoreOffice(),
                editReqDto.getScoreAmenity(),
                editReqDto.getScoreFocus()
        );
    }

    //리뷰 삭제
    @Transactional
    public void deleteReview(Long no){
        ReviewEntity entity = reviewRepository.findById(no)
                .orElseThrow(()->new CustomException(ReviewErrorCode.REVIEW_NOT_FOUND));

        entity.delete();
    }
}
