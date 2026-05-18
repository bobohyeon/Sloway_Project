package com.sloway.app.review.review.service;

import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.member.repository.MemberRepository;
import com.sloway.app.review.helpful.entity.HelpfulEntity;
import com.sloway.app.review.helpful.repository.HelpfulRepository;
import com.sloway.app.review.review.entity.ReviewEntity;
import com.sloway.app.review.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final HelpfulRepository helpfulRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public void helpfulToggle(Long reviewNo) {
        // Long memberNo = SecurityUtil.getMemberId();
        Long memberNo = 1L;
        MemberEntity no = memberRepository.findById(memberNo)
                .orElseThrow(()-> new RuntimeException("해당 유저를 찾을 수 없습니다."));

        ReviewEntity rvNo = reviewRepository.findById(reviewNo)
                .orElseThrow(()-> new RuntimeException("해당 리뷰를 찾을 수 없습니다."));

        Optional<HelpfulEntity> toggle = helpfulRepository.findByUserNoAndReviewNo(memberNo, reviewNo);

        if(toggle.isPresent()){
            helpfulRepository.deleteByUserNoAndReviewNo(memberNo, reviewNo);
        }else {
            helpfulRepository.save(HelpfulEntity.builder()
                    .memberNo(no)
                    .reviewNo(rvNo)
                    .build());
        }
    }

    public Integer helpfulCount(Long reviewNo) {
       return helpfulRepository.countByReviewNo(reviewNo);
    }
}
