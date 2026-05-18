package com.sloway.app.payment.settlement.settle.controller;

import com.sloway.app.payment.settlement.settle.dto.request.SettleCreateReqDto;
import com.sloway.app.payment.settlement.settle.dto.response.SettleResDto;
import com.sloway.app.payment.settlement.settle.service.SettleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// TODO: 정산 컨트롤러 — 패턴은 Refund/Point 핸들러와 동일
//       URL: /api/payment/settlement/settle
@RestController
@RequestMapping("/api/payment/settlement/settle")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin
public class SettleApiController {

    private final SettleService settleService;

//
//
//       @PostMapping
//       public ResponseEntity<SettleResDto> createSettle(@RequestBody SettleCreateReqDto reqDto) {
//           SettleResDto resDto = settleService.createSettle(reqDto);
//           return ResponseEntity.status(HttpStatus.CREATED).body(resDto);
//       }
//
//
//       @GetMapping
//       public ResponseEntity<List<SettleResDto>> findSettleAll() {
//           return ResponseEntity.ok(settleService.findSettleAll());
//       }
//
//       @GetMapping("/{no}")
//       public ResponseEntity<SettleResDto> findSettleByNo(@PathVariable Long no) {
//           return ResponseEntity.ok(settleService.findSettleByNo(no));
//       }
//
//
//       @PatchMapping("/{no}/complete")
//       public ResponseEntity<SettleResDto> completeSettle(@PathVariable Long no) {
//           return ResponseEntity.ok(settleService.completeSettle(no));
//       }
//
//       @PatchMapping("/{no}/invoice")
//       public ResponseEntity<SettleResDto> issueTaxInvoice(@PathVariable Long no) {
//           return ResponseEntity.ok(settleService.issueTaxInvoice(no));
//       }
}
