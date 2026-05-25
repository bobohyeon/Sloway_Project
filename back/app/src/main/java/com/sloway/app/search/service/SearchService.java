package com.sloway.app.search.service;

import com.sloway.app.search.dto.request.SearchReqDto;
import com.sloway.app.search.dto.response.SearchResDto;
import com.sloway.app.search.repository.SearchCustomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class SearchService {

    private final SearchCustomRepository searchCustomRepository;

    public List<SearchResDto> search(SearchReqDto dto) {

        return searchCustomRepository.search(dto);
    }
}

