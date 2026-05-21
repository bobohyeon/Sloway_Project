package com.sloway.app.payment.point.dto.request;

import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.payment.pay.entity.PayEntity;
import com.sloway.app.payment.point.common.PointDealType;
import com.sloway.app.payment.point.common.PointStatus;
import com.sloway.app.payment.point.entity.PointEntity;
import lombok.*;


@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class PointSaveReqDto {

    private Long payNo;
    private Long memberNo;

    public PointEntity toEntity(PayEntity payEntity, MemberEntity memberEntity) {
        return PointEntity.builder()
                .payNo(payEntity)
                .memberNo(memberEntity)
                .dealType(PointDealType.EARN)
                .status(PointStatus.WAIT)
                .build();
    }
}
