package com.sloway.app.reservation.blackOut.controller;

import com.sloway.app.reservation.blackOut.dto.request.BlackOutReqDto;
import com.sloway.app.reservation.blackOut.dto.response.BlackOutResDto;
import com.sloway.app.reservation.blackOut.service.BlackOutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<Void> editBlackOut(@PathVariable Long no, @RequestBody BlackOutReqDto dto){
        blackOutService.editBlackOut(no, dto);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping("/{no}")
    public ResponseEntity<Void> deleteBlackOut(@PathVariable Long no){
        blackOutService.deleteBlackOut(no);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
