package com.sloway.app.payment.refund.controller;

import com.sloway.app.payment.refund.dto.request.RefundCreateReqDto;
import com.sloway.app.payment.refund.dto.response.RefundResDto;
import com.sloway.app.payment.refund.service.RefundService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment/refund")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin
public class RefundApiController {

    private final RefundService refundService;

    @PostMapping
    public ResponseEntity<RefundResDto> createRefund(@RequestBody RefundCreateReqDto reqDto) {
        RefundResDto resDto = refundService.createRefund(reqDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(resDto);
    }

    @GetMapping
    public ResponseEntity<List<RefundResDto>> findRefundAll() {
        List<RefundResDto> resDtoList = refundService.findRefundAll();
        return ResponseEntity.ok(resDtoList);
    }

    @GetMapping("/{no}")
    public ResponseEntity<RefundResDto> findRefundByNo(@PathVariable Long no) {
        RefundResDto resDto = refundService.findRefundByNo(no);
        return ResponseEntity.ok(resDto);
    }
}
