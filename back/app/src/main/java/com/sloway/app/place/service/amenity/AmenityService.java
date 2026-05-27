package com.sloway.app.place.service.amenity;

import com.sloway.app.place.dto.request.amenity.AmenityReqDto;
import com.sloway.app.place.dto.response.amenity.AmenityInsertRespDto;
import com.sloway.app.place.dto.response.amenity.AmenityListRespDto;
import com.sloway.app.place.entity.amenity.AmenityEntity;
import com.sloway.app.place.repository.amenity.AmenityRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class AmenityService {

    private final AmenityRepository amenityRepository;

    @Transactional
    public AmenityInsertRespDto insertAmenity() {
        AmenityEntity entity = AmenityReqDto.toNoArgsEntity();

        AmenityEntity saved =amenityRepository.save(entity);
        return AmenityInsertRespDto.from(saved);
    }

    @Transactional
    public void deleteAmenity(Long no) {
        AmenityEntity amenity = amenityRepository.findById(no)
                .orElseThrow(()-> new EntityNotFoundException("[AMENITY-291]Amenity Not Found For Delete"));

        amenity.deleteAmenity(no);
    }

    @Transactional
    public void updateAmenity(Long no, AmenityReqDto dto) {
        AmenityEntity amenity = amenityRepository.findById(no)
                .orElseThrow(()-> new EntityNotFoundException("[AMENITY-292]Amenity Not Found For Update"));

        amenity.updateAmenity(dto);
        amenityRepository.save(amenity);
    }

    public AmenityListRespDto selectAmenityList() {
        return amenityRepository.findAllByDelYn("N");
    }

    public AmenityListRespDto selectAmenityListFromType(String type) {
        return amenityRepository.findAllByDelYnAndType(type);
    }
}
