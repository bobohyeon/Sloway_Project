package com.sloway.app.search.dto.request;

import com.sloway.app.search.dto.RegionType;
import com.sloway.app.search.dto.SortType;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
public class SearchReqDto {

    // 지역 미선택 시 전체 검색 가능. null 허용
    private RegionType region;

    //  둘 다 nullable (날짜 미선택하면 잔여 객실 수 안보임)
    private LocalDate checkIn;
    private LocalDate checkOut;

    // null이면 필터 미적용
    private Integer guestCount;

    // placeType에서 나눠지는 걸로 각각 office/workstay/station 테이블을 받아와야함
    private String placeType;

    // 편의시설 번호 받아옴
    private List<Long> amenities;

    private SortType sort;
}
