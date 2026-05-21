package com.sloway.app.place.controller.place;

import com.sloway.app.place.dto.request.sort.ImgSortReqDto;
import com.sloway.app.place.dto.request.place.PlaceReqDto;
import com.sloway.app.place.dto.request.place.PlaceUpdateReqDto;
import com.sloway.app.place.dto.response.place.MasterPlaceRespDto;
import com.sloway.app.place.dto.response.place.PlaceBriefRespDto;
import com.sloway.app.place.dto.response.place.PlaceDetailListRespDto;
import com.sloway.app.place.dto.response.place.PlaceListRespDto;
import com.sloway.app.place.service.place.PlaceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/place")
@Slf4j
public class PlaceApiController {

    private final PlaceService placeService;

     // 장소 등록 (정보 + 이미지 + 정렬정보)
    @PostMapping(value = "/insert", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> savePlace(
            @RequestPart("dto") PlaceReqDto dto,
            @RequestPart("files") List<MultipartFile> files,
            @RequestPart("sortList") List<ImgSortReqDto> sortList,
            @AuthenticationPrincipal Long hostNo) {

        // userNo값 필요 파라미터 추가예정
        placeService.savePlace(dto, files, sortList, Long.valueOf(1));

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }

    // 장소 기본 정보 수정 (제목, 내용)
    @PutMapping("/update/{no}")
    public ResponseEntity<Object> updatePlace(
            @PathVariable Long no,
            @RequestBody PlaceUpdateReqDto dto) {

        placeService.updatePlace(no, dto);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

     // 장소 이미지 수정 (기존 이미지 삭제 후 재생성)
    @PutMapping(value = "/update/image/{no}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> updateImagePlace(
            @PathVariable Long no,
            @RequestPart("files") List<MultipartFile> files,
            @RequestPart("sortList") List<ImgSortReqDto> sortList) {

        placeService.updatePlaceImg(no, files, sortList);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    // 장소 삭제 (Soft Delete)
    @DeleteMapping("/delete/{no}")
    public ResponseEntity<Object> deletePlace(@PathVariable Long no) {

        placeService.deletePlace(no);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    @GetMapping("/list/detail/{placeNo}")
    public ResponseEntity<List<PlaceDetailListRespDto>> placeDetailList(@PathVariable Long placeNo, @AuthenticationPrincipal Long memberNo){
        List<PlaceDetailListRespDto> placeList =placeService.placeDetailList(placeNo, Long.valueOf(2));
        return ResponseEntity.ok(placeList);
    }

    @GetMapping("/list/brief/{placeNo}")
    public ResponseEntity<PlaceBriefRespDto> placeBrief(@PathVariable Long placeNo){
        PlaceBriefRespDto dto = placeService.placeBrief(placeNo);

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/list")
    public ResponseEntity<List<PlaceListRespDto>> placeList(@AuthenticationPrincipal Long memberNo){
        List<PlaceListRespDto> placeList = placeService.placeList(Long.valueOf(2));

        return ResponseEntity.ok(placeList);
    }

    @GetMapping("/master")
    public ResponseEntity<List<MasterPlaceRespDto>> selectMasterPlaceList(@RequestParam("type") String type, @AuthenticationPrincipal Long memberNo){
        List<MasterPlaceRespDto> placeList = placeService.selectMasterPlaceList(type, Long.valueOf(2));

        return ResponseEntity.ok(placeList);
    }

    @GetMapping("/detail/update/{no}")
    public ResponseEntity<PlaceUpdateReqDto> selectPlaceForUpdate(@AuthenticationPrincipal Long memberNo, @PathVariable Long no){
        PlaceUpdateReqDto dto = placeService.selectPlaceForUpdate(Long.valueOf(2), no);

        return ResponseEntity.ok(dto);
    }
}