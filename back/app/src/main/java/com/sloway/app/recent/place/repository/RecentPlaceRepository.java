package com.sloway.app.recent.place.repository;

import com.sloway.app.recent.place.entity.RecentPlaceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecentPlaceRepository extends JpaRepository<RecentPlaceEntity, Long> {


    List<RecentPlaceEntity> recentPlaceList();

    void deleteAllByUserNo(); //userNo 받아야함
}
