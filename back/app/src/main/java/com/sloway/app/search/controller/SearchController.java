package com.sloway.app.search.controller;

import com.sloway.app.search.dto.request.SearchReqDto;
import com.sloway.app.search.dto.response.SearchResDto;
import com.sloway.app.search.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping("/api/spaces/search")
@RequiredArgsConstructor
@RestController
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    public ResponseEntity<List<SearchResDto>> search(
            @ModelAttribute SearchReqDto dto
            ){
        List<SearchResDto> dtoList = searchService.search(dto);
        return ResponseEntity.ok(dtoList);
    }
}
