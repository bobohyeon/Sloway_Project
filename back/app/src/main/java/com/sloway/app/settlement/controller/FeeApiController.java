package com.sloway.app.settlement.controller;

import com.sloway.app.settlement.dto.request.FeeCreateReqDto;
import com.sloway.app.settlement.dto.response.FeeResDto;
import com.sloway.app.settlement.service.FeeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/settlement")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin
public class FeeApiController {

    private final FeeService feeService;

    @PostMapping("/fee")
    public ResponseEntity<Void> create(@RequestBody FeeCreateReqDto reqDto) {
        feeService.save(reqDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/fee")
    public ResponseEntity<List<FeeResDto>> findAll() {
        return ResponseEntity.ok(feeService.findFeeAll());
    }

    @GetMapping("/fee/{id}")
    public ResponseEntity<FeeResDto> findOne(@PathVariable Long id) {
        return ResponseEntity.ok(feeService.findFeeById(id));
    }
}
