package com.sloway.app.review.reply.service;

import com.sloway.app.common.exception.CustomException;
import com.sloway.app.host.entity.HostEntity;
import com.sloway.app.host.repository.HostRepository;
import com.sloway.app.place.repository.hostPlace.HostPlaceRepository;
import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import com.sloway.app.review.ReviewErrorCode;
import com.sloway.app.review.reply.dto.request.ReviewReplyReqDto;
import com.sloway.app.review.reply.entity.ReviewReplyEntity;
import com.sloway.app.review.reply.repository.ReviewReplyRepository;
import com.sloway.app.review.review.entity.ReviewEntity;
import com.sloway.app.review.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class ReviewReplyService {

    private final ReviewReplyRepository reviewReplyRepository;
    private final ReviewRepository reviewRepository;
    private final HostRepository hostRepository;
    private final HostPlaceRepository hostPlaceRepository;

    // 답글 작성
    @Transactional
    public void save(Long memberNo, ReviewReplyReqDto reqDto) {

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

    // 답글 수정
    @Transactional
    public void editReply(Long memberNo, Long replyNo, String content) {
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
