package com.sloway.app.review.review.service;

import com.sloway.app.aws.service.S3Service;
import com.sloway.app.common.exception.CustomException;
import com.sloway.app.place.entity.place.PlaceEntity;
import com.sloway.app.place.repository.place.PlaceRepository;
import com.sloway.app.reservation.RsvnErrorCode;
import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import com.sloway.app.reservation.rsvn.entity.RsvnStatus;
import com.sloway.app.reservation.rsvn.repository.RsvnRepository;
import com.sloway.app.review.ReviewErrorCode;
import com.sloway.app.review.reply.dto.response.ReviewReplyResDto;
import com.sloway.app.review.reply.repository.ReviewReplyRepository;
import com.sloway.app.review.review.dto.request.ReviewCreateReqDto;
import com.sloway.app.review.review.dto.request.ReviewEditReqDto;
import com.sloway.app.review.review.dto.response.ReviewResDto;
import com.sloway.app.review.review.entity.ReviewEntity;
import com.sloway.app.review.review.entity.ReviewImgEntity;
import com.sloway.app.review.review.repository.ReviewImgRepository;
import com.sloway.app.review.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
    private final ReviewReplyRepository reviewReplyRepository;
    private final S3Service s3Service;
    private final ReviewImgRepository reviewImgRepository;

    //리뷰 작성
    @Transactional
    public void save(
            Long memberNo
            , ReviewCreateReqDto reqDto
            , List<MultipartFile> images
    ) throws IOException {
        RsvnEntity rsvn = rsvnRepository.findById(reqDto.getRsvnNo())
                .orElseThrow(()-> new CustomException(RsvnErrorCode.RESERVATION_NOT_FOUND));

        if(!rsvn.getMemberNo().getNo().equals(memberNo)){
            throw new CustomException(RsvnErrorCode.UNAUTHORIZED_ACCESS);
        }
        if(!rsvn.getStatus().equals(RsvnStatus.E)){
            throw new CustomException(RsvnErrorCode.RESERVATION_NOT_COMPLETED);
        }

        if(LocalDateTime.now().isAfter(rsvn.getCheckOut().plusDays(14))){
            throw new CustomException(ReviewErrorCode.REVIEW_PERIOD_EXPIRED);
        }
        if(reviewRepository.existsByRsvnNoAndDelYn(rsvn, "N")){
            throw new CustomException(ReviewErrorCode.ALREADY_REVIEWED);
        }
        ReviewEntity savedReview =
                reviewRepository.save(ReviewEntity.builder()
                        .rsvnNo(rsvn)
                        .content(reqDto.getContent())
                        .scoreTotal(reqDto.getScoreTotal())
                        .scoreOffice(reqDto.getScoreOffice())
                        .scoreFocus(reqDto.getScoreFocus())
                        .scoreAmenity(reqDto.getScoreAmenity())
                .build());

        if(images != null){
            for (MultipartFile image : images){
                String s3Key = s3Service.upload(image, "review");
               ReviewImgEntity img = ReviewImgEntity.builder()
                       .reviewNo(savedReview)
                       .currentUrl(s3Key)
                       .build();
            reviewImgRepository.save(img);
            }
        }
    }

    //해당 공간의 리뷰 목록
    public List<ReviewResDto> findAll(Long placeNo){
        PlaceEntity place = placeRepository.findByNo(placeNo)
                .orElseThrow(()->new CustomException(RsvnErrorCode.PLACE_NOT_FOUND));
        return reviewRepository.findByPlaceNo(place)
                .stream()
                .map(entity -> ReviewResDto.from(entity, toReplyDtos(entity)))
                .toList();
    }

    //리뷰 상세조회
    public ReviewResDto findOne(Long no){
        ReviewEntity entity = reviewRepository.findByNoAndDelYn(no, "N")
                .orElseThrow(()->new CustomException(ReviewErrorCode.REVIEW_NOT_FOUND));
        return ReviewResDto.from(entity, toReplyDtos(entity));
    }

    //리뷰 수정
    @Transactional
    public void editReview(Long memberNo, Long no, ReviewEditReqDto editReqDto){
        ReviewEntity entity = reviewRepository.findByNoAndDelYn(no, "N")
                .orElseThrow(()->new CustomException(ReviewErrorCode.REVIEW_NOT_FOUND));
        if(!entity.getRsvnNo().getMemberNo().getNo().equals(memberNo)){
            throw new CustomException(RsvnErrorCode.UNAUTHORIZED_ACCESS);
        }
        entity.editReview(
                editReqDto.getContent(),
                editReqDto.getScoreTotal(),
                editReqDto.getScoreOffice(),
                editReqDto.getScoreAmenity(),
                editReqDto.getScoreFocus()
        );
    }

    // 관리자용 리뷰 삭제 (소유자 확인 없이 바로 삭제)
    @Transactional
    public void adminDeleteReview(Long no){
        ReviewEntity entity = reviewRepository.findByNoAndDelYn(no, "N")
                .orElseThrow(()-> new CustomException(ReviewErrorCode.REVIEW_NOT_FOUND));
        entity.delete();
    }

    // 리뷰에 달린 답글 목록을 DTO로 변환
    private List<ReviewReplyResDto> toReplyDtos(ReviewEntity entity) {
        return reviewReplyRepository.findByReviewNoAndDelAtIsNull(entity)
                .stream()
                .map(ReviewReplyResDto::from)
                .toList();
    }

    //리뷰 삭제
    @Transactional
    public void deleteReview(Long memberNo, Long no){
        ReviewEntity entity = reviewRepository.findByNoAndDelYn(no, "N")
                .orElseThrow(()->new CustomException(ReviewErrorCode.REVIEW_NOT_FOUND));
        if(!entity.getRsvnNo().getMemberNo().getNo().equals(memberNo)){
            throw new CustomException(RsvnErrorCode.UNAUTHORIZED_ACCESS);
        }

        entity.delete();
    }
}
