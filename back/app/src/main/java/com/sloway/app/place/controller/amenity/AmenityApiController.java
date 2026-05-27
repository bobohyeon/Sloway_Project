package com.sloway.app.place.controller.amenity;

import com.sloway.app.place.dto.request.amenity.AmenityReqDto;
import com.sloway.app.place.dto.response.amenity.AmenityInsertRespDto;
import com.sloway.app.place.dto.response.amenity.AmenityListRespDto;
import com.sloway.app.place.service.amenity.AmenityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/amenity")
public class AmenityApiController {

    private final AmenityService amenityService;

    @PostMapping("/insert")
    public ResponseEntity<AmenityInsertRespDto> insertAmenity(){
        AmenityInsertRespDto dto = amenityService.insertAmenity();

        return ResponseEntity
                .ok(dto);
    }

    @DeleteMapping("/delete/{no}")
    public ResponseEntity<Object> deleteAmenity(@PathVariable Long no){
        amenityService.deleteAmenity(no);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }


    @PutMapping("/update/{no}")
    public ResponseEntity<Object> updateAmenity(@PathVariable Long no, @RequestBody AmenityReqDto dto){
        amenityService.updateAmenity(no, dto);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    @GetMapping("/list")
    public ResponseEntity<AmenityListRespDto> selectAmenityList(){
        AmenityListRespDto dto = amenityService.selectAmenityList();

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/list/{type}")
    public ResponseEntity<AmenityListRespDto> selectAmenityListFromType(@PathVariable String type){
        AmenityListRespDto dto = amenityService.selectAmenityListFromType(type);

        return ResponseEntity.ok(dto);
    }
}
