package com.sloway.app.place.controller.hostPlace;

import com.sloway.app.place.dto.request.hostPlace.HostPlaceRejectReqDto;
import com.sloway.app.place.dto.response.hostPlace.HostPlaceListRespDto;
import com.sloway.app.place.service.hostPlace.HostPlaceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hostPlace")
@Slf4j
@RequiredArgsConstructor
public class HostPlaceApiController {

    private final HostPlaceService hostPlaceService;

    @PutMapping("/approved/{no}")
    public ResponseEntity<Object> approveHostPlace(@PathVariable Long no){
        hostPlaceService.approveHostPlace(no);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    @PutMapping("/rejected/{no}")
    public ResponseEntity<Object> rejectHostPlace(@PathVariable Long no, @RequestBody HostPlaceRejectReqDto dto){
        hostPlaceService.rejectHostPlace(no, dto);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    @GetMapping
    public ResponseEntity<List<HostPlaceListRespDto>> hostPlaceList(){
        List<HostPlaceListRespDto> dtoList = hostPlaceService.hostPlaceList();

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(dtoList);
    }
}
