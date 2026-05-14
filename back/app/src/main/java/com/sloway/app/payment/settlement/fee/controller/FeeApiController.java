package com.sloway.app.payment.settlement.fee.controller;

import com.sloway.app.payment.settlement.fee.dto.request.FeeCreateReqDto;
import com.sloway.app.payment.settlement.fee.dto.response.FeeResDto;
import com.sloway.app.payment.settlement.fee.service.FeeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/settlement/fee")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin
public class FeeApiController {

    private final FeeService feeService;

    @PostMapping
    public ResponseEntity<Void> createFee(@RequestBody FeeCreateReqDto reqDto) {
        feeService.createFee(reqDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    public ResponseEntity<List<FeeResDto>> findFeeAll() {
        return ResponseEntity.ok(feeService.findFeeAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FeeResDto> findFeeById(@PathVariable Long id) {
        return ResponseEntity.ok(feeService.findFeeById(id));
    }
}
