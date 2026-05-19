package com.sloway.app.member.controller;

import com.sloway.app.member.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/user/mypage")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
}
