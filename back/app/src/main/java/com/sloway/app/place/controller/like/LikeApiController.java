package com.sloway.app.place.controller.like;

import com.sloway.app.place.service.like.LikeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/like")
@Slf4j
public class LikeApiController {

    private final LikeService likeService;

    @PostMapping("/{no}")
    public ResponseEntity<Object> saveLike(@PathVariable Long placeNo, @AuthenticationPrincipal Long userNo){
        likeService.saveLike(placeNo, userNo);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }

    @DeleteMapping("/{likeNo}")
    public ResponseEntity<Object> deleteLike(@PathVariable Long likeNo,@RequestBody Long placeNo, @AuthenticationPrincipal Long userNo){
        likeService.deleteLike(likeNo, placeNo, userNo);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }
}
