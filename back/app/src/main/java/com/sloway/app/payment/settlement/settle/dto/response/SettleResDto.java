package com.sloway.app.payment.settlement.settle.dto.response;

import com.sloway.app.payment.settlement.settle.entity.SettleEntity;
import lombok.Builder;
import lombok.Getter;

// TODO: 정산 응답 DTO
@Getter
@Builder
public class SettleResDto {

    // TODO: 응답 필드 정의 (no, hostNo, 정산 기간, 금액들, 상태, 처리일시)

    public static SettleResDto from(SettleEntity entity) {
        // TODO: 빌더로 매핑
        return null;
    }
}
