package com.sloway.app.member.controller;

import com.sloway.app.auth.user.CustomUserDetails;
import com.sloway.app.member.dto.response.UserResponseDto;
import com.sloway.app.member.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/user/mypage")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<UserResponseDto> getUserProfile(@AuthenticationPrincipal CustomUserDetails userDetails){
        log.info("마이페이지 조회 성공~Authenticated user"  + userDetails.getEmail());
        UserResponseDto myInfo = userService.getMyInfo(userDetails.getMemberNo());

        return ResponseEntity.ok(myInfo);
    }
}
