package com.sloway.app.review.review.dto.response;

import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import com.sloway.app.review.reply.dto.response.ReviewReplyResDto;
import com.sloway.app.review.review.entity.ReviewEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class ReviewResDto {

    private Long no;
    private Long rsvnNo;
    private String memberName;   // 리뷰 작성자 이름
    private String spaceName;    // 공간 이름
    private String spaceType;    // 공간 타입
    private Integer scoreTotal;
    private Integer scoreOffice;
    private Integer scoreAmenity;
    private Integer scoreFocus;
    private String content;
    private LocalDateTime createdAt;
    private List<ReviewReplyResDto> replies;  // 호스트 답글 목록
    private LocalDateTime checkIn;
    private LocalDateTime checkOut;


    public static ReviewResDto from(ReviewEntity entity, List<ReviewReplyResDto> replies) {
        RsvnEntity rsvn = entity.getRsvnNo();

        // office / workStay / station 중 하나에서 공간 이름·타입 추출
        String spaceName = null;
        String spaceType = null;
        if (rsvn.getOfficeNo() != null) {
            spaceName = rsvn.getOfficeNo().getPlaceEntity().getTitle();
            spaceType = rsvn.getOfficeNo().getPlaceEntity().getType();
        } else if (rsvn.getWorkStayNo() != null) {
            spaceName = rsvn.getWorkStayNo().getPlaceEntity().getTitle();
            spaceType = rsvn.getWorkStayNo().getPlaceEntity().getType();
        } else if (rsvn.getStationNo() != null) {
            spaceName = rsvn.getStationNo().getPlaceEntity().getTitle();
            spaceType = rsvn.getStationNo().getPlaceEntity().getType();
        }

        return ReviewResDto.builder()
                .no(entity.getNo())
                .rsvnNo(rsvn.getNo())
                .memberName(rsvn.getMemberNo().getName())
                .spaceName(spaceName)
                .spaceType(spaceType)
                .scoreTotal(entity.getScoreTotal())
                .scoreOffice(entity.getScoreOffice())
                .scoreAmenity(entity.getScoreAmenity())
                .scoreFocus(entity.getScoreFocus())
                .content(entity.getContent())
                .createdAt(entity.getCreatedAt())
                .checkIn(rsvn.getCheckIn())
                .checkOut(rsvn.getCheckOut())
                .replies(replies)
                .build();
    }
}
