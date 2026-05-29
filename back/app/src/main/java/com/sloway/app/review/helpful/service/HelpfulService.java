package com.sloway.app.review.helpful.service;

import com.sloway.app.common.exception.CustomException;
import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.member.repository.MemberRepository;
import com.sloway.app.reservation.RsvnErrorCode;
import com.sloway.app.review.ReviewErrorCode;
import com.sloway.app.review.helpful.dto.request.HelpfulReqDto;
import com.sloway.app.review.helpful.entity.HelpfulEntity;
import com.sloway.app.review.helpful.repository.HelpfulRepository;
import com.sloway.app.review.review.entity.ReviewEntity;
import com.sloway.app.review.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class HelpfulService {

    private final HelpfulRepository helpfulRepository;
    private final ReviewRepository reviewRepository;
    private final MemberRepository memberRepository;

    // 도움됨 등록
    @Transactional
    public void save(Long memberNo, HelpfulReqDto dto) {

        MemberEntity member = memberRepository.findById(memberNo)
                .orElseThrow(()->new CustomException(RsvnErrorCode.MEMBER_NOT_FOUND));
        ReviewEntity review = reviewRepository.findById(dto.getReviewNo())
                .orElseThrow(()-> new CustomException(ReviewErrorCode.REVIEW_NOT_FOUND));

        boolean isDone = helpfulRepository.existsByMemberNoAndReviewNo(member, review);
        if(isDone){
            throw new CustomException(ReviewErrorCode.ALREADY_HELPFUL);
        }

        helpfulRepository.save(HelpfulEntity.builder()
                        .memberNo(member)
                        .reviewNo(review)
                .build());
    }

    // 도움됨 취소
    @Transactional
    public void delete(Long memberNo, Long no) {

        HelpfulEntity entity = helpfulRepository.findById(no)
                .orElseThrow(()->new CustomException(ReviewErrorCode.HELPFUL_NOT_FOUND));
        if(!entity.getMemberNo().getNo().equals(memberNo)){
            throw new CustomException(ReviewErrorCode.HELPFUL_NOT_FOUND);
        }

        helpfulRepository.delete(entity);

    }

    // 내 도움됨 entity no 조회 (없으면 null)
    public Long findMyNo(Long memberNo, Long reviewNo) {
        MemberEntity member = memberRepository.findById(memberNo)
                .orElseThrow(() -> new CustomException(RsvnErrorCode.MEMBER_NOT_FOUND));
        ReviewEntity review = reviewRepository.findById(reviewNo)
                .orElseThrow(() -> new CustomException(ReviewErrorCode.REVIEW_NOT_FOUND));
        return helpfulRepository.findByMemberNoAndReviewNo(member, review)
                .map(HelpfulEntity::getNo)
                .orElse(null);
    }

    // 도움됨 카운트 조회
    public Long countByReview(Long reviewNo) {

        ReviewEntity review = reviewRepository.findById(reviewNo)
                .orElseThrow(()-> new CustomException(ReviewErrorCode.REVIEW_NOT_FOUND));
        return helpfulRepository.countByReviewNo(review);
    }
}
