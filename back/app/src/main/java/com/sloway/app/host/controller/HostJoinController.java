package com.sloway.app.host.controller;

import com.sloway.app.host.dto.request.HostJoinRequestDto;
import com.sloway.app.host.service.HostJoinService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/host/join")
public class HostJoinController {

    private final HostJoinService hostJoinService;

    /**
     * 호스트 신청 (사업자등록증 PDF 포함).
     * multipart/form-data: dto(JSON) + businessDoc(파일).
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> hostJoin(
            @RequestPart("dto") HostJoinRequestDto joinRequestDto,
            @RequestPart("businessDoc") MultipartFile businessDoc) {

        hostJoinService.join(joinRequestDto, businessDoc);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}