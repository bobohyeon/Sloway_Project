package com.sloway.app.review.reply.service;

import com.sloway.app.common.exception.CustomException;
import com.sloway.app.host.entity.HostEntity;
import com.sloway.app.host.repository.HostRepository;
import com.sloway.app.place.repository.hostPlace.HostPlaceRepository;
import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import com.sloway.app.review.ReviewErrorCode;
import com.sloway.app.place.entity.place.PlaceEntity;
import com.sloway.app.place.repository.place.PlaceRepository;
import com.sloway.app.reservation.RsvnErrorCode;
import com.sloway.app.review.reply.dto.request.ReviewReplyReqDto;
import com.sloway.app.review.reply.dto.response.ReviewReplyResDto;
import com.sloway.app.review.reply.entity.ReviewReplyEntity;
import com.sloway.app.review.reply.repository.ReviewReplyRepository;
import com.sloway.app.review.review.dto.request.ReviewHostFilterReqDto;
import com.sloway.app.review.review.dto.response.ReviewResDto;
import com.sloway.app.review.review.entity.ReviewEntity;
import com.sloway.app.review.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class ReviewReplyService {

    private final ReviewReplyRepository reviewReplyRepository;
    private final ReviewRepository reviewRepository;
    private final HostRepository hostRepository;
    private final HostPlaceRepository hostPlaceRepository;
    private final PlaceRepository placeRepository;

    // 호스트용 리뷰 필터 조회
    public List<ReviewResDto> findReviewsByHost(Long memberNo, ReviewHostFilterReqDto filterDto) {

        HostEntity host = hostRepository.findByMemberNo(memberNo)
                .orElseThrow(()-> new CustomException(ReviewErrorCode.HOST_NOT_FOUND));

        boolean isOwner = hostPlaceRepository.existsByHostEntityNoAndPlaceEntityNo(host.getNo(), filterDto.getPlaceNo());
        if(!isOwner){
            throw new CustomException(ReviewErrorCode.UNAUTHORIZED_REPLY);
        }

        List<ReviewEntity> dtoList;
        if (filterDto.getEntityNo() != null && filterDto.getSpaceType() != null) {
            // 공간하위상세(entityNo) 단위 필터
            dtoList = reviewRepository.findByEntityFilter(
                    filterDto.getEntityNo(), filterDto.getSpaceType(),
                    filterDto.getMinScore(), filterDto.getPeriod());
        } else {
            // 상위 공간(placeNo) 단위 필터 (기존 방식)
            PlaceEntity place = placeRepository.findByNo(filterDto.getPlaceNo())
                    .orElseThrow(()-> new CustomException(RsvnErrorCode.PLACE_NOT_FOUND));
            dtoList = reviewRepository.findByHostFilter(place, filterDto.getMinScore(), filterDto.getPeriod());
        }

        return dtoList.stream()
                .map(entity -> ReviewResDto.from(entity,
                        reviewReplyRepository.findByReviewNoAndDelAtIsNull(entity)
                                .stream().map(ReviewReplyResDto::from).toList()))
                .toList();
    }

    // 답글 작성
    @Transactional
    public void save(Long memberNo, ReviewReplyReqDto reqDto) {
        // 내용 빈 문자열 방어
        if (reqDto.getContent() == null || reqDto.getContent().isBlank()) {
            throw new CustomException(ReviewErrorCode.EMPTY_CONTENT);
        }

        HostEntity hostNo = hostRepository.findByMemberNo(memberNo)
                .orElseThrow(()->new CustomException(ReviewErrorCode.HOST_NOT_FOUND));

        ReviewEntity review = reviewRepository.findById(reqDto.getReviewNo())
                .orElseThrow(()->new CustomException(ReviewErrorCode.REVIEW_NOT_FOUND));

        // 호스트 소유 검증 — validateHostOwnership() 호출
        validateHostOwnership(hostNo, review);

        reviewReplyRepository.save(ReviewReplyEntity.builder()
                        .reviewNo(review)
                        .hostNo(hostNo)
                        .content(reqDto.getContent())
                .build());
    }

    //답글 조회
    public List<ReviewReplyResDto> findAll(Long reviewNo){
        ReviewEntity review = reviewRepository.findById(reviewNo)
                .orElseThrow(() -> new CustomException(ReviewErrorCode.REVIEW_NOT_FOUND));

        List<ReviewReplyEntity> entityList =reviewReplyRepository.findByReviewNoAndDelAtIsNull(review);
        List<ReviewReplyResDto> dtoList = entityList.stream().map(ReviewReplyResDto::from).toList();

        return dtoList;
    }

    // 답글 수정
    @Transactional
    public void editReply(Long memberNo, Long replyNo, String content) {
        // 내용 빈 문자열 방어
        if (content == null || content.isBlank()) {
            throw new CustomException(ReviewErrorCode.EMPTY_CONTENT);
        }

        ReviewReplyEntity reply = reviewReplyRepository.findById(replyNo)
                .orElseThrow(()->new CustomException(ReviewErrorCode.REPLY_NOT_FOUND));

        if(!memberNo.equals(reply.getHostNo().getMemberNo())){
            throw new CustomException(ReviewErrorCode.UNAUTHORIZED_REPLY);
        }

        reply.editReviewReply(content);
    }

    // 답글 삭제
    @Transactional
    public void deleteReply(Long memberNo, Long replyNo) {

        ReviewReplyEntity reply = reviewReplyRepository.findById(replyNo)
                .orElseThrow(()->new CustomException(ReviewErrorCode.REPLY_NOT_FOUND));

        if(!memberNo.equals(reply.getHostNo().getMemberNo())){
            throw new CustomException(ReviewErrorCode.UNAUTHORIZED_REPLY);
        }

        reply.deleteReviewReply();
    }

    // 호스트 소유 공간 검증 (내부 헬퍼)
    private void validateHostOwnership(HostEntity host, ReviewEntity review) {

        RsvnEntity rsvn = review.getRsvnNo();

        if(rsvn.getOfficeNo() != null){
            boolean isOfficeOwner = hostPlaceRepository.existsByHostEntityNoAndOfficeEntityNo(host.getNo(), rsvn.getOfficeNo().getNo());
            if(!isOfficeOwner){
                throw new CustomException(ReviewErrorCode.UNAUTHORIZED_REPLY);
            }
        }
        if(rsvn.getStationNo() != null) {
            boolean isStationOwner = hostPlaceRepository.existsByHostEntityNoAndStationEntityNo(host.getNo(), rsvn.getStationNo().getNo());
            if(!isStationOwner) {
                throw new CustomException(ReviewErrorCode.UNAUTHORIZED_REPLY);
            }
        }
        if(rsvn.getWorkStayNo() != null) {
            boolean isWorkStayOwner = hostPlaceRepository.existsByHostEntityNoAndWorkStayEntityNo(host.getNo(), rsvn.getWorkStayNo().getNo());
            if (!isWorkStayOwner) {
                throw new CustomException(ReviewErrorCode.UNAUTHORIZED_REPLY);
            }
        }
    }
}
