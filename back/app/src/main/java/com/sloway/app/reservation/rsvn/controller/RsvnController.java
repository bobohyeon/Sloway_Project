package com.sloway.app.reservation.rsvn.controller;

import com.sloway.app.auth.user.CustomUserDetails;
import com.sloway.app.common.exception.CustomException;
import com.sloway.app.member.common.MemberRole;
import com.sloway.app.payment.refund.common.RefundReason;
import com.sloway.app.reservation.RsvnErrorCode;
import com.sloway.app.reservation.rsvn.dto.request.RsvnReqDto;
import com.sloway.app.reservation.rsvn.dto.response.HostReservationStatsResDto;
import com.sloway.app.reservation.rsvn.dto.response.HostSpaceResDto;
import com.sloway.app.reservation.rsvn.dto.response.RsvnResDto;
import com.sloway.app.reservation.rsvn.service.RsvnService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<Long> save(@RequestBody RsvnReqDto dto,
                                     @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        long rsvnNo = rsvnService.save(userDetails.getMemberNo(), dto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(rsvnNo);
    }

    //리뷰가능목록 조회
    @GetMapping("/reviewable")
    public ResponseEntity<List<RsvnResDto>> findReviewable(@AuthenticationPrincipal CustomUserDetails userDetail){
        List<RsvnResDto> dtoList = rsvnService.findReviewable(userDetail.getMemberNo());
        return ResponseEntity.ok(dtoList);
    }

    //내 예약 목록 조회 (일반 회원)
    @GetMapping
    public ResponseEntity<List<RsvnResDto>> findAll(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        List<RsvnResDto> dtoList = rsvnService.findAll(userDetails.getMemberNo());
        return ResponseEntity.ok(dtoList);
    }

    //내 공간 목록 조회 (호스트 — blackout 등에서 공간 선택용)
    @GetMapping("/host/spaces")
    public ResponseEntity<List<HostSpaceResDto>> findHostSpaces(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        List<HostSpaceResDto> dtoList = rsvnService.findHostSpaces(userDetails.getMemberNo());
        return ResponseEntity.ok(dtoList);
    }

    //어드민 — 특정 호스트의 공간 목록 조회
    @GetMapping("/admin/host/{hostNo}/spaces")
    public ResponseEntity<List<HostSpaceResDto>> findHostSpacesForAdmin(
            @PathVariable Long hostNo
    ){
        return ResponseEntity.ok(rsvnService.findHostSpacesForAdmin(hostNo));
    }

    //어드민 — 특정 호스트의 예약 건수 통계 (진행중/완료)
    @GetMapping("/admin/host/{hostNo}/reservation-stats")
    public ResponseEntity<HostReservationStatsResDto> findHostReservationStatsForAdmin(
            @PathVariable Long hostNo
    ){
        return ResponseEntity.ok(rsvnService.findHostReservationStatsForAdmin(hostNo));
    }

    //내 공간 예약 목록 조회 (호스트)
    @GetMapping("/host")
    public ResponseEntity<List<RsvnResDto>> findAllByHost(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        List<RsvnResDto> dtoList = rsvnService.findAllByHost(userDetails.getMemberNo());
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
        rsvnService.rejectByHost(userDetails.getMemberNo(), no,payNo);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
