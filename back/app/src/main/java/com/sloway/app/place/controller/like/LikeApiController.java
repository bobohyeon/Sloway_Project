package com.sloway.app.place.controller.like;

import com.sloway.app.auth.user.CustomUserDetails;
import com.sloway.app.place.dto.response.like.LikeRespDto;
import com.sloway.app.place.entity.like.LikeEntity;
import com.sloway.app.place.service.like.LikeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/like")
@Slf4j
public class LikeApiController {

    private final LikeService likeService;

    @PostMapping("/{no}")
    public ResponseEntity<Object> saveLike(@PathVariable Long placeNo, @AuthenticationPrincipal CustomUserDetails userDetails){
        if (userDetails == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        Long memberNo = userDetails.getMemberNo();

        likeService.saveLike(placeNo, memberNo);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }

    @DeleteMapping("/{likeNo}")
    public ResponseEntity<Object> deleteLike(@PathVariable Long likeNo, @AuthenticationPrincipal CustomUserDetails userDetails){
        if (userDetails == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        Long memberNo = userDetails.getMemberNo();

        likeService.deleteLike(likeNo, memberNo);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    @GetMapping
    public ResponseEntity<List<LikeRespDto>> likeList(@AuthenticationPrincipal CustomUserDetails userDetails){
        if (userDetails == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        Long memberNo = userDetails.getMemberNo();

        List<LikeRespDto> list = likeService.likeList(memberNo);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(list);
    }
}
