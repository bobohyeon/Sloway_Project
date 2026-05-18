package com.sloway.app.payment.settlement.settle.controller;

import com.sloway.app.payment.settlement.settle.service.SettleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

// TODO: 정산 컨트롤러 — 패턴은 Refund/Point 핸들러와 동일
//       URL: /api/payment/settlement/settle
@RestController
@RequestMapping("/api/payment/settlement/settle")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin
public class SettleApiController {

    private final SettleService settleService;

    // ─────────────────────────────────────────────────────────────────
    // TODO: createSettle 핸들러 — POST /api/payment/settlement/settle (관리자 수동 트리거)
    // ─────────────────────────────────────────────────────────────────
    //
    //   @PostMapping
    //   public ResponseEntity<SettleResDto> createSettle(@RequestBody SettleCreateReqDto reqDto) {
    //       SettleResDto resDto = settleService.createSettle(reqDto);
    //       return ResponseEntity.status(HttpStatus.CREATED).body(resDto);
    //   }

    // ─────────────────────────────────────────────────────────────────
    // TODO: findSettleAll 핸들러 — GET /api/payment/settlement/settle
    // ─────────────────────────────────────────────────────────────────
    //
    //   @GetMapping
    //   public ResponseEntity<List<SettleResDto>> findSettleAll() {
    //       return ResponseEntity.ok(settleService.findSettleAll());
    //   }

    // ─────────────────────────────────────────────────────────────────
    // TODO: findSettleByNo 핸들러 — GET /api/payment/settlement/settle/{no}
    // ─────────────────────────────────────────────────────────────────
    //
    //   @GetMapping("/{no}")
    //   public ResponseEntity<SettleResDto> findSettleByNo(@PathVariable Long no) {
    //       return ResponseEntity.ok(settleService.findSettleByNo(no));
    //   }

    // ─────────────────────────────────────────────────────────────────
    // TODO: (선택) 상태 전이 핸들러 — @PatchMapping 정석 (POST 도 허용)
    // ─────────────────────────────────────────────────────────────────
    //
    //   @PatchMapping("/{no}/complete")  — 정산 확정 (WAITING → COMPLETE)
    //   public ResponseEntity<SettleResDto> completeSettle(@PathVariable Long no) {
    //       return ResponseEntity.ok(settleService.completeSettle(no));
    //   }
    //
    //   @PatchMapping("/{no}/invoice")   — 세금계산서 발행 (COMPLETE → INVOICE)
    //   public ResponseEntity<SettleResDto> issueTaxInvoice(@PathVariable Long no) {
    //       return ResponseEntity.ok(settleService.issueTaxInvoice(no));
    //   }
}
