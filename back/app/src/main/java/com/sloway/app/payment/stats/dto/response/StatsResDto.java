package com.sloway.app.payment.stats.dto.response;

import lombok.Builder;
import lombok.Getter;

// TODO: 통계 응답 DTO
//       결정 필요: 어떤 통계를 노출할지
//       후보: 일별/월별 결제액, 결제 건수, 환불율, 호스트별 매출, 공간 타입별 매출 등
//       각 통계마다 별도 DTO를 만들지, 하나로 묶을지 본인 결정
@Getter
@Builder
public class StatsResDto {

    // TODO: 응답 필드 정의
    //       예: period (집계 기간), totalCount, totalAmount, ...
}
