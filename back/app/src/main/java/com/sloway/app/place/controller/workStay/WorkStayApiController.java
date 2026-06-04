package com.sloway.app.place.controller.workStay;

import com.sloway.app.auth.user.CustomUserDetails;
import com.sloway.app.place.dto.request.sort.ImgSortReqDto;
import com.sloway.app.place.dto.request.sort.ImgUpdateSortReqDto;
import com.sloway.app.place.dto.request.workStay.WorkStayReqDto;
import com.sloway.app.place.dto.request.workStay.WorkUpdateDtoWrapper;
import com.sloway.app.place.dto.request.workStay.workOffice.WorkOfficeReqDto;
import com.sloway.app.place.dto.response.place.PlaceImgListRespDto;
import com.sloway.app.place.dto.response.station.StationDetailRespDto;
import com.sloway.app.place.dto.response.station.StationUpdateDetailRespDto;
import com.sloway.app.place.dto.response.workStay.WorkStayImageListRespDto;
import com.sloway.app.place.dto.response.workStay.WorkStayUpdateDetailRespDto;
import com.sloway.app.place.service.workStay.WorkStayService;
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
@Slf4j
@RestController
@RequestMapping("/api/workStay")
public class WorkStayApiController {
    private final WorkStayService workStayService;

    // 숙소 등록
    @PostMapping(value = "/insert", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> saveWorkStay(
            @RequestPart("dto") WorkStayReqDto dto,
            @RequestPart("officeDto") WorkOfficeReqDto officeDto,
            @RequestPart(name = "files", required = false) List<MultipartFile> files,
            @RequestPart(name = "officeFiles", required = false) List<MultipartFile> officeFiles,
            @RequestPart("sortList") List<ImgSortReqDto> sortList,
            @RequestPart("officeSortList") List<ImgSortReqDto> officeSortList,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        Long memberNo = userDetails.getMemberNo();

        workStayService.saveWorkStay(dto, officeDto, files, officeFiles,sortList, officeSortList, memberNo);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }

    // 기본 정보 수정
    @PutMapping("/update/{no}")
    public ResponseEntity<Object> updateWorkStay(
            @PathVariable Long no,
            @RequestBody WorkUpdateDtoWrapper wrapper,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        if (userDetails == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        Long memberNo = userDetails.getMemberNo();

        workStayService.updateWorkStay(no, wrapper.getStay(), wrapper.getOffice(), memberNo);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }


    // 스테이션 이미지 수정
    @PutMapping(value = "/update/image/{no}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> updateImageWorkStay(
            @PathVariable Long no,
            @RequestPart(name = "files", required = false) List<MultipartFile> files,
            @RequestPart(name = "officeFiles", required = false) List<MultipartFile> officeFiles,
            @RequestPart("sortList") List<ImgUpdateSortReqDto> sortList,
            @RequestPart("officeSortList") List<ImgUpdateSortReqDto> officeSortList,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        Long memberNo = userDetails.getMemberNo();

        workStayService.updateImageWorkStay(no, files, sortList, officeFiles, officeSortList, memberNo);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    // 스테이션 삭제
    @DeleteMapping("/delete/{no}")
    public ResponseEntity<Object> deleteWorkStay(@PathVariable Long no) {

        workStayService.deleteWorkStay(no);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    @GetMapping("/update/image/{no}")
    public ResponseEntity<WorkStayImageListRespDto> selectImageList(@PathVariable Long no, @AuthenticationPrincipal CustomUserDetails userDetails){
        if (userDetails == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        Long memberNo = userDetails.getMemberNo();

        WorkStayImageListRespDto dto = workStayService.selectImageList(no, memberNo);

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/detail/dash/{no}")
    public ResponseEntity<StationDetailRespDto> selectWorkStayDetailDashBoard(@PathVariable Long no, @AuthenticationPrincipal CustomUserDetails userDetails){
        if (userDetails == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        Long memberNo = userDetails.getMemberNo();

        StationDetailRespDto dto = workStayService.selectWorkStayDetailDashBoard(no, memberNo);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/update/{no}")
    public ResponseEntity<WorkStayUpdateDetailRespDto> selectDetailForUpdate(@PathVariable Long no, @AuthenticationPrincipal CustomUserDetails userDetails){
        if (userDetails == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        Long memberNo = userDetails.getMemberNo();

        WorkStayUpdateDetailRespDto dto = workStayService.selectDetailForUpdate(no, memberNo);

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/image/list/{no}")
    public ResponseEntity<PlaceImgListRespDto> getImageList(@PathVariable Long no){
        PlaceImgListRespDto dto = workStayService.getImageList(no);

        return ResponseEntity.ok(dto);
    }
}
