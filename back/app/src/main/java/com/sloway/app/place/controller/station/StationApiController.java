package com.sloway.app.place.controller.station;

import com.sloway.app.place.dto.request.sort.ImgSortReqDto;
import com.sloway.app.place.dto.request.station.StationReqDto;
import com.sloway.app.place.dto.request.station.StationUpdateReqDto;
import com.sloway.app.place.service.station.StationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/station")
@Slf4j
public class StationApiController {

    private final StationService stationService;

    // 숙소 등록
    @PostMapping(value = "/insert", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> saveStation(
            @RequestPart("dto") StationReqDto dto,
            @RequestPart("files") List<MultipartFile> files,
            @RequestPart("sortList") List<ImgSortReqDto> sortList) {

        stationService.saveStation(dto, files, sortList);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }

    // 기본 정보 수정
    @PutMapping("/update/{no}")
    public ResponseEntity<Object> updateStation(
            @PathVariable Long no,
            @RequestBody StationUpdateReqDto dto) {

        stationService.updateStation(no, dto);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }


    // 스테이션 이미지 수정
    @PutMapping(value = "/update/image/{no}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> updateImageStation(
            @PathVariable Long no,
            @RequestPart("files") List<MultipartFile> files,
            @RequestPart("sortList") List<ImgSortReqDto> sortList) {

        stationService.updateStationImg(no, files, sortList);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    // 스테이션 삭제
    @DeleteMapping("/delete/{no}")
    public ResponseEntity<Object> deleteStation(@PathVariable Long no) {

        stationService.deleteStation(no);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }
}