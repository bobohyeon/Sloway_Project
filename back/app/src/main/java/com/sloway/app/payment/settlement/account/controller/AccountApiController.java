package com.sloway.app.payment.settlement.account.controller;


import com.sloway.app.payment.settlement.account.dto.request.AccountCreateReqDto;
import com.sloway.app.payment.settlement.account.dto.response.AccountResDto;
import com.sloway.app.payment.settlement.account.service.AccountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment/account")
@RequiredArgsConstructor
@Slf4j
public class AccountApiController {

    private final AccountService accountService;

    @PostMapping
    public ResponseEntity<AccountResDto> registerAccount(@RequestBody AccountCreateReqDto reqDto) {
        AccountResDto resDto = accountService.registerAccount(reqDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(resDto);
    }

    @GetMapping("/host/{hostNo}")
    public ResponseEntity<AccountResDto> findAccountByHostNo(@PathVariable Long hostNo) {
        AccountResDto resDto = accountService.findAccountByHostNo(hostNo);
        return ResponseEntity.ok(resDto);
    }


}
