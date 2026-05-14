package com.sloway.app.payment.point.dto.request;

import com.sloway.app.payment.point.entity.PointEntity;
import lombok.Getter;

// TODO: 포인트 거래 생성 요청 DTO
//       호출 시나리오: 결제 시 적립, 결제 시 사용, 만료 처리 등
@Getter
public class PointCreateReqDto {

    // TODO: 필드 정의 (memberNo, payNo, amount, dealType 등)

    public PointEntity toEntity() {
        // TODO: 빌더로 Entity 생성
        return null;
    }
}
