package com.sloway.app.payment.point.dto.response;

import com.sloway.app.payment.point.entity.PointEntity;
import lombok.Builder;
import lombok.Getter;

// TODO: 포인트 응답 DTO
@Getter
@Builder
public class PointResDto {

    // TODO: 응답 필드 정의

    public static PointResDto from(PointEntity entity) {
        // TODO: 빌더로 매핑
        return null;
    }
}
