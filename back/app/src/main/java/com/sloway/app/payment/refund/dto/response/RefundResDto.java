package com.sloway.app.payment.refund.dto.response;

import com.sloway.app.payment.refund.entity.RefundEntity;
import lombok.Builder;
import lombok.Getter;

// TODO: 환불 응답 DTO
//       참고: PayResDto 패턴 (static from 메서드 사용)
@Getter
@Builder
public class RefundResDto {

    // TODO: 응답 필드 정의
    //       - no, payNo, refundAmt, refundRate, refundReason
    //       - status (RefundStatus)
    //       - refundedAt, createdAt, modifiedAt

    public static RefundResDto from(RefundEntity entity) {
        // TODO: 빌더로 매핑
        return null;
    }
}
