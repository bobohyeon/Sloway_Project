package com.sloway.app.payment.controller;

import com.sloway.app.payment.dto.request.PaymentCreateReqDto;
import com.sloway.app.payment.dto.response.PaymentResDto;
import com.sloway.app.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin
public class PaymentApiController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentResDto> pay(@RequestBody PaymentCreateReqDto reqDto){
        PaymentResDto paymentResDto = paymentService.pay(reqDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentResDto);
    }

    @GetMapping
    public ResponseEntity<List<PaymentResDto>> findPaymentAll(){
        List<PaymentResDto> paymentAll = paymentService.findPaymentAll();
        return ResponseEntity.ok(paymentAll);
    }

    @GetMapping("/{no}")
    public ResponseEntity<PaymentResDto> findPaymentById(@PathVariable Long no){
        PaymentResDto paymentResDto = paymentService.findPaymentById(no);
        return ResponseEntity.ok(paymentResDto);
    }

}
