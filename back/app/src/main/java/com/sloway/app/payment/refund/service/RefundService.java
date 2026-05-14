package com.sloway.app.payment.refund.service;

import com.sloway.app.payment.refund.repository.RefundRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// TODO: 환불 서비스
//       참고: PayService 패턴
//       메서드 컨벤션: createRefund / findRefundAll / findRefundById
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class RefundService {

    private final RefundRepository refundRepository;

    // TODO: createRefund(RefundCreateReqDto reqDto)
    //       - @Transactional 어노테이션 (쓰기)
    //       - 흐름: payNo로 결제 조회 → 예약일 기준 환불율 계산 → Entity 저장 → ResDto 반환

    // TODO: findRefundAll() — 전체 환불 목록 조회

    // TODO: findRefundById(Long id)
    //       - orElseThrow(() -> new EntityNotFoundException("Refund not found with id " + id))

    // TODO: (private) 환불율 계산 메서드
    //       힌트: 예약일까지 남은 일수 계산 → 정책 표 매핑
    //       정책: 7일 전 100% / 4~6일 70% / 2~3일 50% / 1일 30% / 당일·이용후 0%
}
