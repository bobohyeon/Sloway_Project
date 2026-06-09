package com.sloway.app.recent.keyword.controller;

import com.sloway.app.auth.user.CustomUserDetails;
import com.sloway.app.recent.keyword.dto.response.RecentKeywordResDto;
import com.sloway.app.recent.keyword.service.RecentKeywordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/user/recent/keyword")
@RequiredArgsConstructor
@RestController
public class RecentKeywordController {

    private final RecentKeywordService recentKeywordService;

    //최근 검색어 저장
    @PostMapping
    public ResponseEntity<Void> save(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam String keyword){

        recentKeywordService.save(userDetails.getMemberNo(), keyword);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }

    //최근 검색어 목록
    @GetMapping
    public ResponseEntity<List<RecentKeywordResDto>> findAll(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        List<RecentKeywordResDto> dtoList = recentKeywordService.findAll(userDetails.getMemberNo());
        return ResponseEntity
                .ok(dtoList);
    }

    //최근 검색어 단건 삭제
    @DeleteMapping("/{no}")
    public ResponseEntity<Void> deleteOne(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long no
    ){
        recentKeywordService.deleteOne(userDetails.getMemberNo(), no);
        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .build();
    }

    //최근 검색어 전체 삭제
    @DeleteMapping
    public ResponseEntity<Void> deleteAll(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        recentKeywordService.deleteAll(userDetails.getMemberNo());
        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .build();
    }
}
