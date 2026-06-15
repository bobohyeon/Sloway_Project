package com.sloway.app.search.service;

import com.sloway.app.common.exception.CustomException;
import com.sloway.app.reservation.RsvnErrorCode;
import com.sloway.app.search.dto.request.SearchReqDto;
import com.sloway.app.search.dto.response.SearchResDto;
import com.sloway.app.search.repository.SearchCustomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class SearchService {

    private final SearchCustomRepository searchCustomRepository;

    public Page<SearchResDto> search(
            SearchReqDto dto,
            Pageable pageable
            ) {
        // 날짜는 둘 다 null이거나 둘 다 있어야 함 — 한 쪽만 보내면 거부
        if ((dto.getCheckIn() == null) != (dto.getCheckOut() == null)) {
            throw new CustomException(RsvnErrorCode.INVALID_DATE_RANGE);
        }
        // 둘 다 있을 때 역순 방어
        if (dto.getCheckIn() != null && !dto.getCheckIn().isBefore(dto.getCheckOut())) {
            throw new CustomException(RsvnErrorCode.INVALID_DATE_RANGE);
        }
        // 인원 0 이하 방어 (null은 필터 미적용으로 허용)
        if (dto.getGuestCount() != null && dto.getGuestCount() <= 0) {
            throw new CustomException(RsvnErrorCode.INVALID_COUNT);
        }

        Page<SearchResDto> dtoList = searchCustomRepository.search(dto, pageable);

        return dtoList;
    }
}

