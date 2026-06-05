package com.sloway.app.place.repository.place;

import com.sloway.app.place.entity.place.ImgPlaceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImgPlaceRepository extends JpaRepository<ImgPlaceEntity,Long>, ImgPlaceRepositoryCustom {

    void deleteAllByPlaceEntityNo(Long no);

    List<ImgPlaceEntity> findByPlaceEntity_NoInAndSort(List<Long> placeNos, int sort);
}
