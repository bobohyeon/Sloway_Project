package com.sloway.app.payment.point.dto.response;

import com.sloway.app.payment.point.common.PointDealType;
import com.sloway.app.payment.point.common.PointStatus;
import com.sloway.app.payment.point.entity.PointEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PointResDto {

    private Long no;
    private Long memberNo;
    private Long payNo;
    private Integer amount;
    private PointDealType dealType;
    private LocalDateTime expiredAt;
    private PointStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;


    public static PointResDto from(PointEntity entity) {
        return PointResDto.builder()
                .no(entity.getNo())
                .memberNo(entity.getMemberNo().getNo())
                .payNo(entity.getPayNo().getNo())
                .amount(entity.getAmount())
                .dealType(entity.getDealType())
                .expiredAt(entity.getExpiredAt())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .modifiedAt(entity.getModifiedAt())
                .build();
    }
}
