package com.sloway.app.place.controller.place;

import com.sloway.app.place.dto.request.place.PlaceImageUpdateDto;
import com.sloway.app.place.dto.request.place.PlaceReqDto;
import com.sloway.app.place.dto.request.place.PlaceUpdateReqDto;
import com.sloway.app.place.service.place.PlaceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/place")
@Slf4j
public class PlaceApiController {

    private final PlaceService placeService;

    @PostMapping("/insert")
    public ResponseEntity<Object> savePlace(@RequestBody PlaceReqDto dto){
        //userNo값 필요 파라미터 추가예정
        placeService.savePlace(dto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }

    @PutMapping("/update/{no}")
    public ResponseEntity<Object> updatePlace(@PathVariable Long no, @RequestBody PlaceUpdateReqDto dto){
        placeService.updatePlace(no,dto);
        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    @PutMapping("/update/image/{no}")
    public ResponseEntity<Object> updateImagePlace(@PathVariable Long no, @RequestPart PlaceImageUpdateDto dto){
        placeService.updatePlaceImg(no,dto);
        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    @DeleteMapping("/delete/{no}")
    public ResponseEntity<Object> deletePlace(@PathVariable Long no){
        placeService.deletePlace(no);
        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

}
