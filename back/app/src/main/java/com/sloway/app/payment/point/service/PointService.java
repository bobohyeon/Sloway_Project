package com.sloway.app.payment.point.service;

import com.sloway.app.payment.point.repository.PointRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// TODO: 포인트 서비스
//       메서드 컨벤션: createPoint / findPointAll / findPointById
//       부가 메서드: savePoint(적립), usePoint(사용), expirePoint(만료)
//       정책 검증:
//         - 사용 시 최소 1,000P 검증
//         - 사용 시 결제액의 30% 초과 검증
//         - 적립은 결제 완료 + 7일 후 확정 (@Scheduled 활용 가능)
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class PointService {

    private final PointRepository pointRepository;

    // TODO: createPoint(PointCreateReqDto reqDto) — @Transactional

    // TODO: findPointAll() / findPointById(Long id)

    // TODO: savePoint(...) — 적립 (status = 대기, 7일 후 확정 예약)

    // TODO: usePoint(...) — 사용 (정책 검증 후 음수 row 생성 또는 적립 row 차감)
}
