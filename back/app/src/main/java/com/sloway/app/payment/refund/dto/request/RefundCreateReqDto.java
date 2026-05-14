package com.sloway.app.payment.refund.dto.request;

import com.sloway.app.payment.refund.entity.RefundEntity;
import lombok.Getter;

// TODO: 환불 생성 요청 DTO
//       참고: PayCreateReqDto 패턴
//       클라이언트가 보내는 값만 (서버 계산 필드 제외)
@Getter
public class RefundCreateReqDto {

    // TODO: 필드 정의
    //       - payNo (Long) — 어떤 결제를 환불하는지
    //       - refundReason (String) — 환불 사유
    //       - (선택) 부분 환불이면 refundAmt 클라이언트가 보낼 수도

    public RefundEntity toEntity() {
        // TODO: RefundEntity.builder() 로 생성
        //       - status 초기값 (예: REQUESTED)
        //       - refundAmt / refundRate 는 Service에서 환불율 정책 계산 후 채우는 게 자연스러움
        return null;
    }
}
