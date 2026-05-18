package com.sloway.app.place.controller.amenity;

import com.sloway.app.place.dto.request.amenity.AmenityReqDto;
import com.sloway.app.place.service.amenity.AmenityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/amenity")
public class AmenityApiController {

    private final AmenityService amenityService;

    @PostMapping("/insert")
    public ResponseEntity<Object> insertAmenity(@RequestBody AmenityReqDto dto){
        amenityService.insertAmenity(dto);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    @DeleteMapping("/delete/{no}")
    public void deleteAmenity(@PathVariable Long no){
        amenityService.deleteAmenity(no);
    }
}
