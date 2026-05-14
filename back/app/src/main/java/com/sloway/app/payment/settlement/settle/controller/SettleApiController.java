package com.sloway.app.payment.settlement.settle.controller;

import com.sloway.app.payment.settlement.settle.service.SettleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

// TODO: 정산 컨트롤러
//       URL: /api/payment/settlement/settle
@RestController
@RequestMapping("/api/payment/settlement/settle")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin
public class SettleApiController {

    private final SettleService settleService;

    // TODO: POST /api/payment/settlement/settle — createSettle 핸들러 (관리자 수동 트리거)

    // TODO: GET /api/payment/settlement/settle — findSettleAll 핸들러

    // TODO: GET /api/payment/settlement/settle/{no} — findSettleById 핸들러
}
