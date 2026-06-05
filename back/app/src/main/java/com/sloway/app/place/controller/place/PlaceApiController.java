package com.sloway.app.place.controller.place;

import com.sloway.app.auth.user.CustomUserDetails;
import com.sloway.app.place.dto.request.sort.ImgSortReqDto;
import com.sloway.app.place.dto.request.place.PlaceReqDto;
import com.sloway.app.place.dto.request.place.PlaceUpdateReqDto;
import com.sloway.app.place.dto.request.sort.ImgUpdateSortReqDto;
import com.sloway.app.place.dto.response.place.*;
import com.sloway.app.place.dto.response.workStay.WorkStayImageListRespDto;
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
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        Long memberNo = userDetails.getMemberNo();


        // userNo값 필요 파라미터 추가예정
        placeService.savePlace(dto, files, sortList, memberNo);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }

    // 장소 기본 정보 수정 (제목, 내용)
    @PutMapping("/update/{no}")
    public ResponseEntity<Object> updatePlace(
            @PathVariable Long no,
            @RequestBody PlaceUpdateReqDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        Long memberNo = userDetails.getMemberNo();

        placeService.updatePlace(no, dto, memberNo);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    // 장소 이미지 수정 (기존 이미지 삭제 후 재생성)
    @PutMapping(value = "/update/image/{no}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> updateImagePlace(
            @PathVariable Long no,
            @RequestPart(name = "files", required = false) List<MultipartFile> files,
            @RequestPart("sortList") List<ImgUpdateSortReqDto> sortList,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        Long memberNo = userDetails.getMemberNo();

        placeService.updatePlaceImg(no, files, sortList, memberNo);

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
    public ResponseEntity<List<PlaceDetailListRespDto>> placeDetailList(@PathVariable Long placeNo, @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        Long memberNo = userDetails.getMemberNo();

        List<PlaceDetailListRespDto> placeList = placeService.placeDetailList(placeNo,memberNo);
        return ResponseEntity.ok(placeList);
    }

    @GetMapping("/list/brief/{placeNo}")
    public ResponseEntity<PlaceBriefRespDto> placeBrief(@PathVariable Long placeNo) {
        PlaceBriefRespDto dto = placeService.placeBrief(placeNo);

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/list")
    public ResponseEntity<List<PlaceListRespDto>> placeList(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        Long memberNo = userDetails.getMemberNo();

        List<PlaceListRespDto> placeList = placeService.placeList(memberNo);

        return ResponseEntity.ok(placeList);
    }

    @GetMapping("/master")
    public ResponseEntity<List<MasterPlaceRespDto>> selectMasterPlaceList(@RequestParam("type") String type, @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        Long memberNo = userDetails.getMemberNo();

        List<MasterPlaceRespDto> placeList = placeService.selectMasterPlaceList(type, memberNo);

        return ResponseEntity.ok(placeList);
    }

    @GetMapping("/detail/update/{no}")
    public ResponseEntity<PlaceUpdateReqDto> selectPlaceForUpdate(@AuthenticationPrincipal CustomUserDetails userDetails, @PathVariable Long no) {
        if (userDetails == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        Long memberNo = userDetails.getMemberNo();

        PlaceUpdateReqDto dto = placeService.selectPlaceForUpdate(memberNo, no);

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/update/image/{no}")
    public ResponseEntity<PlaceImgListRespDto> selectImageList(@PathVariable Long no, @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        Long memberNo = userDetails.getMemberNo();

        PlaceImgListRespDto dto = placeService.selectImageList(no, memberNo);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/topSpaces")
    public ResponseEntity<List<PlaceCardDto>> getTop4PlacesByType(){
        List<PlaceCardDto> dtoList = placeService.getTop4PlacesByType();

        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/recommend")
    public ResponseEntity<List<PlaceCardDto>> getRecommendPlace(){
        List<PlaceCardDto> dtoList = placeService.getRecommendPlace();

        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/random")
    public ResponseEntity<WorkStayCardDto> getRandomWorkStay(){
        WorkStayCardDto dto = placeService.getRandomWorkStay();
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/image/list/{no}")
    public ResponseEntity<PlaceImgListRespDto> getImageList(@PathVariable Long no){
        PlaceImgListRespDto dto = placeService.getImageList(no);

        return ResponseEntity.ok(dto);
    }
    // 어드민 — 특정 호스트 공간 목록 (SecurityConfig 에서 ADMIN 권한 필요) -오준호 요청사항 직접 수정
    @GetMapping("/admin/host/{hostNo}")
    public ResponseEntity<List<PlaceListRespDto>> placeListForAdmin(@PathVariable Long hostNo) {
        return ResponseEntity.ok(placeService.placeListForAdmin(hostNo));
    }

}