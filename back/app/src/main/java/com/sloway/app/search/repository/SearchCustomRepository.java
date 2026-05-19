package com.sloway.app.search.repository;


import com.sloway.app.place.entity.place.PlaceEntity;
import com.sloway.app.search.dto.request.SearchReqDto;

import java.util.List;

public interface SearchCustomRepository {

    List<PlaceEntity> search(SearchReqDto dto);
}
