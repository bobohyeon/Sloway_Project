package com.sloway.app.payment.settlement.settle.service;

import com.sloway.app.host.repository.HostRepository;
import com.sloway.app.payment.pay.repository.PayRepository;
import com.sloway.app.payment.refund.common.RefundRate;
import com.sloway.app.payment.refund.repository.RefundRepository;
import com.sloway.app.payment.settlement.fee.repository.FeeRepository;
import com.sloway.app.payment.settlement.settle.repository.SettleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class SettleService {

    private final SettleRepository settleRepository;

    private final HostRepository hostRepository;
    private final PayRepository payRepository;
    private final RefundRepository refundRepository;
    private final FeeRepository feeRepository;

    // ─────────────────────────────────────────────────────────────────
    // TODO: createSettle(SettleCreateReqDto reqDto) — 시나리오 B (관리자 수동)
    // ─────────────────────────────────────────────────────────────────
    //
    //   @Transactional
    //   public SettleResDto createSettle(SettleCreateReqDto reqDto) {
    //
    //       (1) HostEntity 조회
    //           HostEntity host = hostRepository.findById(reqDto.getHostNo())
    //                   .orElseThrow(() -> new EntityNotFoundException("호스트 정보를 조회할 수 없습니다."));
    //
    //       (2) totalAmt 집계 — 기간 내 완료 결제 합산
    //           PayRepository 에 쿼리 메서드 추가 필요:
    //             ┌──────────────────────────────────────────────────────────────┐
    //             │ @Query("SELECT COALESCE(SUM(p.finalAmt), 0) FROM PayEntity p │
    //             │         WHERE p.rsvnNo.placeNo.hostNo.no = :hostNo            │
    //             │           AND p.status = 'COMPLETED'                          │
    //             │           AND p.createdAt BETWEEN :start AND :end")           │
    //             │ Integer sumTotalAmt(Long hostNo, LocalDateTime start, ...);   │
    //             └──────────────────────────────────────────────────────────────┘
    //           ※ LocalDate (reqDto) → LocalDateTime 변환:
    //                start.atStartOfDay() / end.atTime(23, 59, 59)
    //           ※ host → place → rsvn 의존이 깊어서 본인이 단순화하려면:
    //              임시로 PayRepository.findAll() 후 stream 으로 필터링 (Level 1 한정)
    //
    //       (3) feeAmt 계산 — 수수료 정책 적용
    //           옵션 A) 일괄 10% 고정 (Level 1 추천, 단순화):
    //                   int feeAmt = totalAmt * 10 / 100;
    //           옵션 B) Fee 도메인 정책 적용 (host 공간 타입 매핑 필요):
    //                   FeeEntity fee = feeRepository.findByPlaceType(host.getPlaceType());
    //                   int feeAmt = totalAmt * fee.getRate() / 100;
    //
    //       (4) refundAmt 집계 — 기간 내 완료 환불 합산
    //           RefundRepository 에 쿼리 메서드 추가:
    //             @Query("SELECT COALESCE(SUM(r.refundAmt), 0) FROM RefundEntity r
    //                     WHERE r.payNo.rsvnNo.placeNo.hostNo.no = :hostNo
    //                       AND r.status = 'COMPLETED'
    //                       AND r.requestedAt BETWEEN :start AND :end")
    //             Integer sumRefundAmt(Long hostNo, LocalDateTime start, ...);
    //
    //       (5) payoutAmt 계산
    //           int payoutAmt = totalAmt - feeAmt - refundAmt;
    //           ※ 음수 가능 (환불이 매출보다 큰 경우 — 다음 회차 차감 정책).
    //             Level 1 단순화: 음수 그대로 저장.
    //
    //       (6) toEntity(host) → SettleEntity entity
    //           SettleCreateReqDto.toEntity 에서 status=WAITING 강제 박힘.
    //
    //       (7) Rich 메서드로 금액 박기 ← Setter 금지 컨벤션
    //           entity.applyAmounts(totalAmt, feeAmt, refundAmt, payoutAmt);
    //           → SettleEntity 에 applyAmounts(Integer, Integer, Integer, Integer) Rich 메서드 추가 필요
    //           → 가드: this.status != WAITING 이면 throw (선택)
    //
    //       (8) save 후 ResDto 반환
    //           return SettleResDto.from(settleRepository.save(entity));
    //   }

    // ─────────────────────────────────────────────────────────────────
    // TODO: findSettleAll() — Refund/Point 와 동일 패턴
    // ─────────────────────────────────────────────────────────────────
    //
    //   public List<SettleResDto> findSettleAll() {
    //       return settleRepository.findAll().stream().map(SettleResDto::from).toList();
    //   }

    // ─────────────────────────────────────────────────────────────────
    // TODO: findSettleByNo(Long no) — Refund/Point 와 동일 패턴
    // ─────────────────────────────────────────────────────────────────
    //
    //   public SettleResDto findSettleByNo(Long no) {
    //       SettleEntity entity = settleRepository.findById(no)
    //               .orElseThrow(() -> new EntityNotFoundException("정산 정보를 조회할 수 없습니다."));
    //       return SettleResDto.from(entity);
    //   }

    // ─────────────────────────────────────────────────────────────────
    // TODO: (선택) 상태 전이 메서드 — Rich 메서드 호출 (dirty checking, save 불필요!)
    // ─────────────────────────────────────────────────────────────────
    //
    //   completeSettle(Long no) — WAITING → COMPLETE
    //       @Transactional
    //       public SettleResDto completeSettle(Long no) {
    //           SettleEntity entity = settleRepository.findById(no).orElseThrow(...);
    //           entity.completeSettle();                  ← Rich 호출, 가드 자동 검사
    //           return SettleResDto.from(entity);         ← save 불필요, dirty checking
    //       }
    //
    //   issueTaxInvoice(Long no) — COMPLETE → INVOICE
    //       동일 패턴. entity.issueTaxInvoice() 호출.

    // ─────────────────────────────────────────────────────────────────
    // TODO: (Level 후반) 자동 배치 — @Scheduled(cron = "0 0 0 */4 * *") 로 4일마다 실행
    //                  Level 1 보류.
    // ─────────────────────────────────────────────────────────────────
}
