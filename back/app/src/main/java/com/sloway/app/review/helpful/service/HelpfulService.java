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
        // TODO: MemberEntity, ReviewEntity 조회
        MemberEntity member = memberRepository.findById(memberNo)
                .orElseThrow(()->new CustomException(RsvnErrorCode.MEMBER_NOT_FOUND));
        ReviewEntity review = reviewRepository.findById(dto.getReviewNo())
                .orElseThrow(()-> new CustomException(ReviewErrorCode.REVIEW_NOT_FOUND));
        // TODO: 중복 등록 확인 후 예외 처리
        //       힌트: 파라미터 타입 MemberEntity, ReviewEntity
        boolean isDone = helpfulRepository.existsByMemberNoAndReviewNo(member, review);
        if(isDone){
            throw new CustomException(ReviewErrorCode.ALREADY_HELPFUL);
        }
        // TODO: 빌더로 Entity 조립 후 save
        helpfulRepository.save(HelpfulEntity.builder()
                        .memberNo(member)
                        .reviewNo(review)
                .build());
    }

    // 도움됨 취소
    @Transactional
    public void delete(Long memberNo, Long no) {
        // TODO: HelpfulEntity 조회 후 소유자 확인
        //       힌트: entity.getMemberNo().getNo()와 memberNo 비교 (Long 비교 주의)
        HelpfulEntity entity = helpfulRepository.findById(no)
                .orElseThrow(()->new CustomException(ReviewErrorCode.HELPFUL_NOT_FOUND));
        if(!entity.getMemberNo().getNo().equals(memberNo)){
            throw new CustomException(ReviewErrorCode.HELPFUL_NOT_FOUND);
        }
        // TODO: repository.delete(entity)
        helpfulRepository.delete(entity);

    }

    // 도움됨 카운트 조회
    public Long countByReview(Long reviewNo) {
        // TODO: ReviewEntity 조회 후 countBy~ 메서드 호출
        ReviewEntity review = reviewRepository.findById(reviewNo)
                .orElseThrow(()-> new CustomException(ReviewErrorCode.REVIEW_NOT_FOUND));
        return helpfulRepository.countByReviewNo(review);
    }
}
