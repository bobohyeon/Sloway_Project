package com.sloway.app.review.review.service;

import com.sloway.app.aws.service.S3Service;
import com.sloway.app.common.exception.CustomException;
import com.sloway.app.reservation.RsvnErrorCode;
import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import com.sloway.app.reservation.rsvn.entity.RsvnStatus;
import com.sloway.app.reservation.rsvn.repository.RsvnRepository;
import com.sloway.app.review.ReviewErrorCode;
import com.sloway.app.review.reply.dto.response.ReviewReplyResDto;
import com.sloway.app.review.reply.repository.ReviewReplyRepository;
import com.sloway.app.review.review.dto.request.ReviewCreateReqDto;
import com.sloway.app.review.review.dto.request.ReviewEditReqDto;
import com.querydsl.core.Tuple;
import com.sloway.app.host.entity.HostEntity;
import com.sloway.app.host.repository.HostRepository;
import com.sloway.app.place.entity.hostPlace.HostPlaceEntity;
import com.sloway.app.place.repository.hostPlace.HostPlaceRepository;
import com.sloway.app.review.review.dto.response.HostReviewStatsResDto;
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
    private final ReviewReplyRepository reviewReplyRepository;
    private final S3Service s3Service;
    private final ReviewImgRepository reviewImgRepository;
    private final HostPlaceRepository hostPlaceRepository;
    private final HostRepository hostRepository;

    //리뷰 작성
    @Transactional
    public void save(
            Long memberNo
            , ReviewCreateReqDto reqDto
            , List<MultipartFile> images
    ) {
        // 내용 빈 문자열 방어
        if (reqDto.getContent() == null || reqDto.getContent().isBlank()) {
            throw new CustomException(ReviewErrorCode.EMPTY_CONTENT);
        }
        // 별점 범위(1~5) 방어
        validateScore(reqDto.getScoreTotal());
        validateScore(reqDto.getScoreOffice());
        validateScore(reqDto.getScoreFocus());
        validateScore(reqDto.getScoreAmenity());

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

        if (images != null) {
            for (MultipartFile image : images) {
                try {
                    String s3Key = s3Service.upload(image, "review");
                    reviewImgRepository.save(ReviewImgEntity.builder()
                            .reviewNo(savedReview)
                            .currentUrl(s3Key)
                            .build());
                } catch (IOException e) {
                    throw new CustomException(ReviewErrorCode.IMAGE_UPLOAD_FAILED);
                }
            }
        }
    }

    //해당 공간의 리뷰 목록
    public List<ReviewResDto> findAll(Long entityNo, String type){
        return reviewRepository.findByEntityNo(entityNo, type)
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
        // 내용 빈 문자열 방어
        if (editReqDto.getContent() == null || editReqDto.getContent().isBlank()) {
            throw new CustomException(ReviewErrorCode.EMPTY_CONTENT);
        }
        // 별점 범위(1~5) 방어
        validateScore(editReqDto.getScoreTotal());
        validateScore(editReqDto.getScoreOffice());
        validateScore(editReqDto.getScoreAmenity());
        validateScore(editReqDto.getScoreFocus());
        entity.editReview(
                editReqDto.getContent(),
                editReqDto.getScoreTotal(),
                editReqDto.getScoreOffice(),
                editReqDto.getScoreAmenity(),
                editReqDto.getScoreFocus()
        );
    }

    // 내 리뷰 목록
    public List<ReviewResDto> findMyReviews(Long memberNo) {
        return reviewRepository.findMyReviews(memberNo)
                .stream()
                .map(entity -> ReviewResDto.from(entity, toReplyDtos(entity)))
                .toList();
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

    // 호스트 본인 — 내 공간들의 리뷰 통계 (평균 평점·개수)
    public HostReviewStatsResDto findMyHostReviewStats(Long memberNo) {
        HostEntity host = hostRepository.findByMemberNo(memberNo)
                .orElseThrow(() -> new CustomException(ReviewErrorCode.HOST_NOT_FOUND));
        return findHostReviewStatsForAdmin(host.getNo());
    }

    //어드민 — 특정 호스트의 리뷰 통계 (평균 평점·개수)
    public HostReviewStatsResDto findHostReviewStatsForAdmin(Long hostNo) {
        // 호스트 공간들의 placeNo 수집
        List<Long> placeNos = hostPlaceRepository.findByHostEntityNo(hostNo).stream()
                .map(this::extractPlaceNo)
                .filter(java.util.Objects::nonNull)
                .distinct()
                .toList();
        if (placeNos.isEmpty()) return HostReviewStatsResDto.of(0.0, 0L);

        Tuple t = reviewRepository.findHostReviewStats(placeNos);
        Double avg = (t == null) ? null : t.get(0, Double.class);
        Long cnt = (t == null) ? null : t.get(1, Long.class);
        return HostReviewStatsResDto.of(avg == null ? 0.0 : avg, cnt == null ? 0L : cnt);
    }

    // 별점 1~5 범위 검사 (내부 헬퍼)
    private void validateScore(Integer score) {
        if (score == null || score < 1 || score > 5) {
            throw new CustomException(ReviewErrorCode.INVALID_SCORE);
        }
    }

    // HostPlace 에서 공간 placeNo 추출 (office/station/work/place 중 존재하는 것)
    private Long extractPlaceNo(HostPlaceEntity hp) {
        if (hp.getOfficeEntity() != null) return hp.getOfficeEntity().getPlaceEntity().getNo();
        if (hp.getStationEntity() != null) return hp.getStationEntity().getPlaceEntity().getNo();
        if (hp.getWorkStayEntity() != null) return hp.getWorkStayEntity().getPlaceEntity().getNo();
        if (hp.getPlaceEntity() != null) return hp.getPlaceEntity().getNo();
        return null;
    }
}
