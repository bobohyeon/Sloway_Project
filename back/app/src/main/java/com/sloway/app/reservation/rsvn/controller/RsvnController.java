package com.sloway.app.reservation.rsvn.controller;

import com.sloway.app.auth.user.CustomUserDetails;
import com.sloway.app.common.exception.CustomException;
import com.sloway.app.member.common.MemberRole;
import com.sloway.app.payment.refund.common.RefundReason;
import com.sloway.app.reservation.RsvnErrorCode;
import com.sloway.app.reservation.rsvn.dto.request.RsvnReqDto;
import com.sloway.app.reservation.rsvn.dto.response.RsvnResDto;
import com.sloway.app.reservation.rsvn.service.RsvnService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/reservation")
@RequiredArgsConstructor
@RestController
public class RsvnController {

    private final RsvnService rsvnService;

    //예약하기
    @PostMapping
    public ResponseEntity<Void> save(@RequestBody RsvnReqDto dto,
                                     @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        rsvnService.save(userDetails.getMemberNo(), dto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }

    //내 예약 목록 조회
    @GetMapping
    public ResponseEntity<List<RsvnResDto>> findAll(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        List<RsvnResDto> dtoList = rsvnService.findAll(userDetails.getMemberNo());
        return ResponseEntity.ok(dtoList);
    }

    //내 예약 정보 상세 조회
    @GetMapping("/{no}")
    public ResponseEntity<RsvnResDto> findOne(
            @AuthenticationPrincipal CustomUserDetails userDetails
            , @PathVariable Long no){
        RsvnResDto dto = rsvnService.findOne(userDetails.getMemberNo(), no);
        return ResponseEntity.ok(dto);
    }

    //예약 취소
    @PostMapping("/{no}/cancel")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal CustomUserDetails userDetails
            , @PathVariable Long no
            , @RequestParam RefundReason refundReason
            ){
        rsvnService.cancel(userDetails.getMemberNo(), no, refundReason);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    //예약 거절
    @PostMapping("/{no}/reject")
    public ResponseEntity<Void> rejectByHost(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long no, @RequestParam Long payNo)
    {
        if(userDetails.getRole() != MemberRole.H){
            throw new CustomException(RsvnErrorCode.UNAUTHORIZED_ACCESS);
        }
        rsvnService.rejectByHost(no,payNo);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
