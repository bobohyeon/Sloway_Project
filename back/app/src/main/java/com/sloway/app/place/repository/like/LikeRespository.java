package com.sloway.app.place.repository.like;

import com.sloway.app.place.entity.like.LikeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeRespository extends JpaRepository<LikeEntity, Long>, LikeRespositoryCustom {
}
