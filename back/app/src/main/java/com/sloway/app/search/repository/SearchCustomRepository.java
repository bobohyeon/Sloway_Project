package com.sloway.app.search.repository;


import com.sloway.app.search.dto.request.SearchReqDto;
import com.sloway.app.search.dto.response.SearchResDto;

import java.util.List;

public interface SearchCustomRepository {

    List<SearchResDto> search(SearchReqDto dto);
}
