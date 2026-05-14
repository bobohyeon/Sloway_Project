package com.sloway.app.payment.settlement.settle.service;

import com.sloway.app.payment.settlement.settle.repository.SettleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// TODO: 정산 서비스
//       메서드 컨벤션: createSettle / findSettleAll / findSettleById
//       정산 로직:
//         1. 정산 기간 내 '이용 완료' 결제 건 조회
//         2. 결제별 수수료(Fee 정책) 차감
//         3. 환불 차감 (직전 정산 누락분 또는 당기 환불분)
//         4. 호스트별 지급액 계산
//         5. SettleEntity 저장
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class SettleService {

    private final SettleRepository settleRepository;

    // TODO: createSettle(SettleCreateReqDto reqDto) — @Transactional

    // TODO: findSettleAll() — 전체 정산 내역

    // TODO: findSettleById(Long id) — 단건 조회, orElseThrow + EntityNotFoundException

    // TODO: (선택) 자동 배치 메서드 — @Scheduled(cron = "...") 으로 4일마다 실행
}
