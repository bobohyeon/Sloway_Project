package com.sloway.app.payment.pay.controller;

import com.sloway.app.payment.pay.dto.request.PayCreateReqDto;
import com.sloway.app.payment.pay.dto.response.PayReadyResDto;
import com.sloway.app.payment.pay.dto.response.PayResDto;
import com.sloway.app.payment.pay.service.PayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.List;

@RestController
@RequestMapping("/api/payment/pay")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin
public class PayApiController {

    private final PayService payService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @PostMapping("/ready")
    public ResponseEntity<PayReadyResDto> readyPay(@RequestBody PayCreateReqDto payCreateReqDto) {
        PayReadyResDto payReadyResDto = payService.readyPay(payCreateReqDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(payReadyResDto);
    }

    @GetMapping
    public ResponseEntity<List<PayResDto>> findPayAll() {
        List<PayResDto> payAll = payService.findPayAll();
        return ResponseEntity.ok(payAll);
    }

    @GetMapping("/{no}")
    public ResponseEntity<PayResDto> findPayByNo(@PathVariable Long no) {
        PayResDto payResDto = payService.findPayByNo(no);
        return ResponseEntity.ok(payResDto);
    }

    @GetMapping("/member/{no}")
    public ResponseEntity<List<PayResDto>> findPaysByMemberNo(@PathVariable Long no) {
        List<PayResDto> payResDtoList = payService.findPaysByMemberNo(no);
        return ResponseEntity.ok(payResDtoList);
    }

    // TODO: 토스 결제 준비 — 프론트가 SDK 결제창 열기 직전 호출
    //   @PostMapping("/toss/prepare")
    //   public ResponseEntity<TossPrepareResDto> prepareTossPay(@RequestBody PayCreateReqDto reqDto) {
    //     payService.prepareTossPay(reqDto) 호출 → 201 Created 또는 200 OK 반환
    //   }
    //   ※ 카카오 readyPay 핸들러 패턴 참고. 단 RedirectView 아님 — JSON 응답 (프론트가 SDK 호출)

    // TODO: 토스 결제 승인 — 프론트 success 페이지가 paymentKey/orderId/amount 들고 호출
    //   @PostMapping("/toss/confirm")
    //   public ResponseEntity<???> confirmTossPay(@RequestBody TossConfirmReqDto reqDto) {
    //     payService.confirmTossPay(reqDto.getPaymentKey(), reqDto.getOrderId(), reqDto.getAmount())
    //     → 완료 후 payNo 또는 PayResDto 반환 (프론트가 complete 화면 그릴 값)
    //   }
    //   ※ 카카오는 GET /approve(RedirectView)였지만, 토스는 프론트가 직접 호출하는 POST + JSON
    //   ※ @RequestBody DTO: pg/toss의 TossConfirmReqDto 재활용 vs 별도 요청 DTO 신규 — 택1

    @GetMapping("/approve")
    public RedirectView approvePay(
            @RequestParam Long payNo,
            @RequestParam("pg_token") String pgToken) {
        payService.approvePay(payNo, pgToken);
        return new
                RedirectView(frontendUrl+"/user/payment/complete?payNo=" + payNo);
    }
}
