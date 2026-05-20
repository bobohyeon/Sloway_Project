package com.sloway.app.host.controller;


import com.sloway.app.host.dto.request.HostJoinRequestDto;
import com.sloway.app.host.service.HostJoinService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/host/join")
public class HostJoinController {

    private final HostJoinService hostJoinService;

    @PostMapping
    public ResponseEntity<Object> hostJoin(@RequestBody HostJoinRequestDto joinRequestDto){
        hostJoinService.join(joinRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .build();
    }
}
