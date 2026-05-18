package com.sloway.app.place.repository.like;

import com.sloway.app.place.dto.response.like.LikeRespDto;

import java.util.List;

public interface LikeRespositoryCustom {
    List<LikeRespDto> findLikeByUserId(Long userNo);
}
