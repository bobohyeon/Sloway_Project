package com.sloway.app.payment.refund.controller;

import com.sloway.app.payment.refund.service.RefundService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

// TODO: 환불 컨트롤러
//       참고: PayApiController 패턴 (URL 단일화 + 동사+명사 핸들러명)
//       URL: /api/payment/refund
@RestController
@RequestMapping("/api/payment/refund")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin
public class RefundApiController {

    private final RefundService refundService;

    // TODO: POST /api/payment/refund — createRefund 핸들러
    //       @PostMapping, @RequestBody RefundCreateReqDto, 201 Created

    // TODO: GET /api/payment/refund — findRefundAll 핸들러

    // TODO: GET /api/payment/refund/{no} — findRefundById 핸들러, @PathVariable Long no
}
