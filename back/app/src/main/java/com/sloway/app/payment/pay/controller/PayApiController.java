package com.sloway.app.payment.pay.controller;

import com.sloway.app.payment.pay.dto.request.PayCreateReqDto;
import com.sloway.app.payment.pay.dto.response.PayReadyResDto;
import com.sloway.app.payment.pay.dto.response.PayResDto;
import com.sloway.app.payment.pay.dto.response.PayStatsResDto;
import com.sloway.app.payment.pay.dto.response.TossPrepareResDto;
import com.sloway.app.auth.user.CustomUserDetails;
import com.sloway.app.payment.pay.pg.toss.dto.request.TossConfirmReqDto;
import com.sloway.app.payment.pay.service.PayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    public ResponseEntity<PayReadyResDto> readyPay(
            @RequestBody PayCreateReqDto payCreateReqDto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        PayReadyResDto payReadyResDto = payService.readyPay(payCreateReqDto, userDetails.getMemberNo());
        return ResponseEntity.status(HttpStatus.CREATED).body(payReadyResDto);
    }

    @GetMapping
    public ResponseEntity<Page<PayResDto>> findPayAll(
            @RequestParam(defaultValue = "0") int pno,
            @RequestParam(defaultValue = "all") String tab,
            @RequestParam(defaultValue = "month") String period) {
        return ResponseEntity.ok(payService.findPayAll(pno, tab, period));
    }

    @GetMapping("/stats")
    public ResponseEntity<PayStatsResDto> findPayStats(
            @RequestParam(defaultValue = "month") String period) {
        return ResponseEntity.ok(payService.findPayStats(period));
    }

    @GetMapping("/{no}")
    public ResponseEntity<PayResDto> findPayByNo(@PathVariable Long no) {
        PayResDto payResDto = payService.findPayByNo(no);
        return ResponseEntity.ok(payResDto);
    }

    @GetMapping("/member/{no}")
    public ResponseEntity<List<PayResDto>> findPaysByMemberNo(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        // 본인 결제 내역만 — URL의 no 대신 인증 토큰의 memberNo 사용 (IDOR 방지)
        List<PayResDto> payResDtoList = payService.findPaysByMemberNo(userDetails.getMemberNo());
        return ResponseEntity.ok(payResDtoList);
    }

    @PostMapping("/toss/prepare")
    public ResponseEntity<TossPrepareResDto> prepareTossPay(
            @RequestBody PayCreateReqDto payCreateReqDto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        TossPrepareResDto resDto = payService.prepareTossPay(payCreateReqDto, userDetails.getMemberNo());
        return ResponseEntity.status(HttpStatus.CREATED).body(resDto);
    }

    @PostMapping("/toss/confirm")
    public ResponseEntity<PayResDto> confirmTossPay(@RequestBody TossConfirmReqDto reqDto) {
        PayResDto payResDto = payService.confirmTossPay(
                reqDto.getPaymentKey(), reqDto.getOrderId(), reqDto.getAmount());
        return ResponseEntity.ok(payResDto);
    }

    @GetMapping("/approve")
    public RedirectView approvePay(
            @RequestParam Long payNo,
            @RequestParam("pg_token") String pgToken) {
        payService.approvePay(payNo, pgToken);
        return new
                RedirectView(frontendUrl+"/user/payment/complete?payNo=" + payNo);
    }
}
