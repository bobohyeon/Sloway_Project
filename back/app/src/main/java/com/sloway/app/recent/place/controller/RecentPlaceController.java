package com.sloway.app.recent.place.controller;

import com.sloway.app.recent.place.dto.response.RecentPlaceResDto;
import com.sloway.app.recent.place.service.RecentPlaceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/user/recent/place")
@RequiredArgsConstructor
@Slf4j
@RestController
public class RecentPlaceController {

    private final RecentPlaceService recentPlaceService;

    //최근 본 공간 저장
    @PostMapping
    public ResponseEntity<Void> recentPlaceSave(@RequestParam Long placeNo){
        recentPlaceService.recentPlaceSave(placeNo);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }

    //최근 본 공간 목록
    @GetMapping
    public ResponseEntity<List<RecentPlaceResDto>> recentPlaceList(){
        List<RecentPlaceResDto> dtoList = recentPlaceService.recentPlaceList();
        return ResponseEntity.ok(dtoList);
    }

    //최근 본 공간 삭제(단건)
    @DeleteMapping("/{no}")
    public ResponseEntity<Void> recentPlaceDeleteByNo(@PathVariable Long no){
        recentPlaceService.recentPlaceDeleteByNo(no);
        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .build();
    }

    //최근 본 공간 삭제(전체)
    @DeleteMapping()
    public ResponseEntity<Void> recentPlaceDeleteAll(){
        recentPlaceService.recentPlaceDeleteAll();
        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .build();
    }
}
