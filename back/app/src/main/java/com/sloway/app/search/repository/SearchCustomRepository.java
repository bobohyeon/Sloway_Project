package com.sloway.app.search.repository;


import com.sloway.app.search.dto.request.SearchReqDto;
import com.sloway.app.search.dto.response.SearchResDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SearchCustomRepository {

    Page<SearchResDto> search(SearchReqDto dto, Pageable pageable);
}
