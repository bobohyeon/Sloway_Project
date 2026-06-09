package com.sloway.app.payment.settlement.settle.controller;

import com.sloway.app.auth.user.CustomUserDetails;
import com.sloway.app.payment.settlement.settle.dto.request.SettleCreateReqDto;
import com.sloway.app.payment.settlement.settle.dto.response.SettleResDto;
import com.sloway.app.payment.settlement.settle.dto.response.SettleStatsResDto;
import com.sloway.app.payment.settlement.settle.service.SettleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment/settlement/settle")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin
public class SettleApiController {

    private final SettleService settleService;


    @PostMapping
    public ResponseEntity<SettleResDto> createSettle(@RequestBody SettleCreateReqDto reqDto) {
        SettleResDto resDto = settleService.createSettle(reqDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(resDto);
    }


    @GetMapping
    public ResponseEntity<Page<SettleResDto>> findSettleAll(@RequestParam(defaultValue = "0") int pno, @RequestParam(defaultValue = "all") String tab) {
        return ResponseEntity.ok(settleService.findSettleAll(pno, tab));
    }

    @GetMapping("/stats")
    public SettleStatsResDto findSettleStats() {
        return settleService.findSettleStats();
    }

    @GetMapping("/{no}")
    public ResponseEntity<SettleResDto> findSettleByNo(@PathVariable Long no) {
        return ResponseEntity.ok(settleService.findSettleByNo(no));
    }

    @GetMapping("/host")
    public ResponseEntity<List<SettleResDto>> findSettleByHostNo(@AuthenticationPrincipal CustomUserDetails host) {
        List<SettleResDto> settleResDtoList = settleService.findSettleByHostNo(host.getMemberNo());
        return ResponseEntity.ok(settleResDtoList);
    }

    @GetMapping("/admin/host/{hostNo}")
    public ResponseEntity<List<SettleResDto>> findSettleByHostNoForAdmin(@PathVariable Long hostNo) {
        return ResponseEntity.ok(settleService.findSettleByHostNoForAdmin(hostNo));
    }


    @PatchMapping("/{no}/complete")
    public ResponseEntity<SettleResDto> completeSettle(@PathVariable Long no) {
        return ResponseEntity.ok(settleService.completeSettle(no));
    }

    @PatchMapping("/{no}/invoice")
    public ResponseEntity<SettleResDto> issueTaxInvoice(@PathVariable Long no) {
        return ResponseEntity.ok(settleService.issueTaxInvoice(no));
    }
}
