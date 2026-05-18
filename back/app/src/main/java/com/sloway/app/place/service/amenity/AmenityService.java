package com.sloway.app.place.service.amenity;

import com.sloway.app.place.dto.request.amenity.AmenityReqDto;
import com.sloway.app.place.entity.amenity.AmenityEntity;
import com.sloway.app.place.repository.amenity.AmenityRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class AmenityService {

    private final AmenityRepository amenityRepository;

    @Transactional
    public void insertAmenity(AmenityReqDto dto) {
        AmenityEntity entity = dto.toEntity();
        amenityRepository.save(entity);
    }

    @Transactional
    public void deleteAmenity(Long no) {
        AmenityEntity amenity = amenityRepository.findById(no)
                .orElseThrow(()-> new EntityNotFoundException("[AMENITY-291]Amenity Not Found For Delete");

        amenity.deleteAmenity(no);
    }
}
