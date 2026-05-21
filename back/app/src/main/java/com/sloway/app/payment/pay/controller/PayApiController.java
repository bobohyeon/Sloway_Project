package com.sloway.app.payment.pay.controller;

import com.sloway.app.payment.pay.dto.request.PayCreateReqDto;
import com.sloway.app.payment.pay.dto.response.PayResDto;
import com.sloway.app.payment.pay.service.PayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment/pay")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin
public class PayApiController {

    private final PayService payService;

    @PostMapping
    public ResponseEntity<PayResDto> createPay(@RequestBody PayCreateReqDto payCreateReqDto) {
        PayResDto payResDto = payService.createPay(payCreateReqDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(payResDto);
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
}
