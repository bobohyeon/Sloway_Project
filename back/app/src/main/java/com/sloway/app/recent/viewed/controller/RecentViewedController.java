package com.sloway.app.recent.viewed.controller;

import com.sloway.app.auth.user.CustomUserDetails;
import com.sloway.app.recent.viewed.dto.response.RecentViewedResDto;
import com.sloway.app.recent.viewed.service.RecentViewedService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/user/recent/viewed")
@RequiredArgsConstructor
@RestController
public class RecentViewedController {

    private final RecentViewedService recentViewedService;

    @PostMapping
    public ResponseEntity<Void> save(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam Long placeNo
    ){
        recentViewedService.save(userDetails.getMemberNo(), placeNo);
        System.out.println("placeNo = " + placeNo);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }

    @GetMapping
    public ResponseEntity<List<RecentViewedResDto>> findAll(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        List<RecentViewedResDto> dtoList = recentViewedService.findAll(userDetails.getMemberNo());
        return ResponseEntity.ok(dtoList);
    }

    @DeleteMapping("/{no}")
    public ResponseEntity<Void> deleteOne(
            @PathVariable Long no,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        recentViewedService.deleteOne(no, userDetails.getMemberNo());
        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAll(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        recentViewedService.deleteAll(userDetails.getMemberNo());
        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .build();
    }
}
