package com.sloway.app.reservation.blackOut.controller;

import com.sloway.app.auth.user.CustomUserDetails;
import com.sloway.app.reservation.blackOut.dto.request.BlackOutReqDto;
import com.sloway.app.reservation.blackOut.dto.response.BlackOutResDto;
import com.sloway.app.reservation.blackOut.service.BlackOutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/blackout")
@RequiredArgsConstructor
@RestController
public class BlackOutController {

    private final BlackOutService blackOutService;

    @PostMapping
    public ResponseEntity<Void> save(@RequestBody BlackOutReqDto dto, @RequestParam Long placeNo){

        blackOutService.save(placeNo, dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    public ResponseEntity<List<BlackOutResDto>> findAll(@RequestParam Long placeNo){
        List<BlackOutResDto> dtoList = blackOutService.findAll(placeNo);
        return ResponseEntity.ok(dtoList);
    }

    @PutMapping("/{no}")
    public ResponseEntity<Void> editBlackOut(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long no,
            @RequestBody BlackOutReqDto dto
    ){
        blackOutService.editBlackOut(userDetails.getMemberNo(), no, dto);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping("/{no}")
    public ResponseEntity<Void> deleteBlackOut(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long no
    ){
        blackOutService.deleteBlackOut(userDetails.getMemberNo(), no);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
