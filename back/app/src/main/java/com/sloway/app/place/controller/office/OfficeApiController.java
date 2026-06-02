package com.sloway.app.place.controller.office;

import com.sloway.app.place.dto.request.office.OfficeUpdateReqDto;
import com.sloway.app.place.dto.request.office.OfficeReqDto;
import com.sloway.app.place.dto.request.sort.ImgSortReqDto;
import com.sloway.app.place.dto.request.sort.ImgUpdateSortReqDto;
import com.sloway.app.place.dto.response.office.OfficeUpdateDetailReqDto;
import com.sloway.app.place.dto.response.place.PlaceImgListRespDto;
import com.sloway.app.place.dto.response.station.StationDetailRespDto;
import com.sloway.app.place.service.office.OfficeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/office")
@RequiredArgsConstructor
@Slf4j
public class OfficeApiController {

    private final OfficeService officeService;

    // 장소 등록 (정보 + 이미지 + 정렬정보)
    @PostMapping(value = "/insert", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> savePlace(
            @RequestPart("dto") OfficeReqDto dto,
            @RequestPart("files") List<MultipartFile> files,
            @RequestPart("sortList") List<ImgSortReqDto> sortList,
            @AuthenticationPrincipal Long memberNo) {

        // userNo값 필요 파라미터 추가예정
        officeService.saveOffice(dto, files, sortList, Long.valueOf(2));

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }

    // 장소 기본 정보 수정 (제목, 내용)
    @PutMapping("/update/{no}")
    public ResponseEntity<Object> updateOffice(
            @PathVariable Long no,
            @RequestBody OfficeUpdateReqDto dto,
            @AuthenticationPrincipal Long memberNo) {

        officeService.updateOffice(no, dto, Long.valueOf(2));

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    // 장소 이미지 수정 (기존 이미지 삭제 후 재생성)
    @PutMapping(value = "/update/image/{no}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> updateImageOffice(
            @PathVariable Long no,
            @RequestPart(name = "files", required = false) List<MultipartFile> files,
            @RequestPart("sortList") List<ImgUpdateSortReqDto> sortList,
            @AuthenticationPrincipal Long memberNo) {

        officeService.updateOfficeImg(no, files, sortList, Long.valueOf(2));

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    // 장소 삭제 (Soft Delete)
    @DeleteMapping("/delete/{no}")
    public ResponseEntity<Object> deleteOffice(@PathVariable Long no) {

        officeService.deleteOffice(no);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    @GetMapping("/update/image/{no}")
    public ResponseEntity<PlaceImgListRespDto> selectImageList(@PathVariable Long no, @AuthenticationPrincipal Long memberNo){
        PlaceImgListRespDto dto = officeService.selectImageList(no, Long.valueOf(2));
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/detail/dash/{no}")
    public ResponseEntity<StationDetailRespDto> selectStationDetailDashBoard(@PathVariable Long no, @AuthenticationPrincipal Long memberNo){
        StationDetailRespDto dto = officeService.selectOfficeDetailDashBoard(no, Long.valueOf(2));
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/update/{no}")
    public ResponseEntity<OfficeUpdateDetailReqDto> selectOfficeForUpdate(@PathVariable Long no, @AuthenticationPrincipal Long memberNo){
        OfficeUpdateDetailReqDto dto = officeService.selectOfficeForUpdate(no, Long.valueOf(2));

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/image/list/{no}")
    public ResponseEntity<PlaceImgListRespDto> getImageList(@PathVariable Long no){
        PlaceImgListRespDto dto = officeService.getImageList(no);

        return ResponseEntity.ok(dto);
    }
}
