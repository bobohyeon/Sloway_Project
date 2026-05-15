package com.sloway.app.place.controller.office;

import com.sloway.app.place.dto.request.office.OfficeUpdateReqDto;
import com.sloway.app.place.dto.request.office.OfficeReqDto;
import com.sloway.app.place.dto.request.sort.ImgSortReqDto;
import com.sloway.app.place.service.office.OfficeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
            @RequestPart("sortList") List<ImgSortReqDto> sortList) {

        // userNo값 필요 파라미터 추가예정
        officeService.saveOffice(dto, files, sortList);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }

    // 장소 기본 정보 수정 (제목, 내용)
    @PutMapping("/update/{no}")
    public ResponseEntity<Object> updateOffice(
            @PathVariable Long no,
            @RequestBody OfficeUpdateReqDto dto) {

        officeService.updateOffice(no, dto);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    // 장소 이미지 수정 (기존 이미지 삭제 후 재생성)
    @PutMapping(value = "/update/image/{no}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> updateImageOffice(
            @PathVariable Long no,
            @RequestPart("files") List<MultipartFile> files,
            @RequestPart("sortList") List<ImgSortReqDto> sortList) {

        officeService.updateOfficeImg(no, files, sortList);

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

}
