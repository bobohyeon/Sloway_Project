package com.sloway.app.place.controller.station;

import com.sloway.app.auth.user.CustomUserDetails;
import com.sloway.app.place.dto.request.sort.ImgSortReqDto;
import com.sloway.app.place.dto.request.sort.ImgUpdateSortReqDto;
import com.sloway.app.place.dto.request.station.StationReqDto;
import com.sloway.app.place.dto.request.station.StationUpdateReqDto;
import com.sloway.app.place.dto.response.place.PlaceImgListRespDto;
import com.sloway.app.place.dto.response.station.StationDetailRespDto;
import com.sloway.app.place.dto.response.station.StationUpdateDetailRespDto;
import com.sloway.app.place.service.station.StationService;
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
@RequestMapping("/api/station")
@Slf4j
public class StationApiController {

    private final StationService stationService;

    // 숙소 등록
    @PostMapping(value = "/insert", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> saveStation(
            @RequestPart("dto") StationReqDto dto,
            @RequestPart("files") List<MultipartFile> files,
            @RequestPart("sortList") List<ImgSortReqDto> sortList,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        Long memberNo = userDetails.getMemberNo();

        stationService.saveStation(dto, files, sortList,memberNo);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }

    // 기본 정보 수정
    @PutMapping("/update/{no}")
    public ResponseEntity<Object> updateStation(
            @PathVariable Long no,
            @RequestBody StationUpdateReqDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        Long memberNo = userDetails.getMemberNo();

        stationService.updateStation(no, dto, memberNo);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }


    // 스테이션 이미지 수정
    @PutMapping(value = "/update/image/{no}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> updateImageStation(
            @PathVariable Long no,
            @RequestPart(name = "files", required = false) List<MultipartFile> files,
            @RequestPart("sortList") List<ImgUpdateSortReqDto> sortList,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        Long memberNo = userDetails.getMemberNo();


        stationService.updateStationImg(no, files, sortList, memberNo);

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

    @GetMapping("/update/image/{no}")
    public ResponseEntity<PlaceImgListRespDto> selectImageList(@PathVariable Long no, @AuthenticationPrincipal CustomUserDetails userDetails){
        if (userDetails == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        Long memberNo = userDetails.getMemberNo();
        PlaceImgListRespDto dto = stationService.selectImageList(no, memberNo);

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/detail/dash/{no}")
    public ResponseEntity<StationDetailRespDto> selectStationDetailDashBoard(@PathVariable Long no, @AuthenticationPrincipal CustomUserDetails userDetails){
        if (userDetails == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        Long memberNo = userDetails.getMemberNo();

        StationDetailRespDto dto = stationService.selectStationDetailDashBoard(no, memberNo);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/update/{no}")
    public ResponseEntity<StationUpdateDetailRespDto> selectDetailForUpdate(@PathVariable Long no, @AuthenticationPrincipal CustomUserDetails userDetails){
        if (userDetails == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        Long memberNo = userDetails.getMemberNo();

        StationUpdateDetailRespDto dto = stationService.selectDetailForUpdate(no, memberNo);

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/image/list/{no}")
    public ResponseEntity<PlaceImgListRespDto> getImageList(@PathVariable Long no){
        PlaceImgListRespDto dto = stationService.getImageList(no);

        return ResponseEntity.ok(dto);
    }
}