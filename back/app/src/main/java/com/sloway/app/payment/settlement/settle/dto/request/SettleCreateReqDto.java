package com.sloway.app.payment.settlement.settle.dto.request;

import com.sloway.app.payment.settlement.settle.entity.SettleEntity;
import lombok.Getter;

// TODO: 정산 생성 요청 DTO
//       결정 필요: 정산은 보통 시스템 자동(4일 배치)인데, 관리자 수동 트리거 API도 둘지?
//       - 수동 트리거: 정산 기간(startDate, endDate)을 받아서 정산 실행
//       - 자동 배치: @Scheduled로 4일마다 트리거 (DTO 필요 없음)
@Getter
public class SettleCreateReqDto {

    // TODO: 필드 정의 (자동/수동 결정 후 채우기)
    //       예: settleStartDate, settleEndDate, hostNo

    public SettleEntity toEntity() {
        // TODO: 빌더로 Entity 생성
        return null;
    }
}
