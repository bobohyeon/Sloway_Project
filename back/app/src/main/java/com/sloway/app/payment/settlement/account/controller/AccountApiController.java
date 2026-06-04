package com.sloway.app.payment.settlement.account.controller;


import com.sloway.app.auth.user.CustomUserDetails;
import com.sloway.app.payment.settlement.account.dto.request.AccountCreateReqDto;
import com.sloway.app.payment.settlement.account.dto.response.AccountResDto;
import com.sloway.app.payment.settlement.account.service.AccountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment/account")
@RequiredArgsConstructor
@Slf4j
public class AccountApiController {

    private final AccountService accountService;

    @PostMapping
    public ResponseEntity<AccountResDto> registerAccount(@AuthenticationPrincipal CustomUserDetails host, @RequestBody AccountCreateReqDto reqDto) {
        AccountResDto resDto = accountService.registerAccount(host.getMemberNo(), reqDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(resDto);
    }

    @GetMapping("/host")
    public ResponseEntity<AccountResDto> findAccountByHostNo(@AuthenticationPrincipal CustomUserDetails host) {
        AccountResDto resDto = accountService.findAccountByHostNo(host.getMemberNo());
        return ResponseEntity.ok(resDto);
    }


}
