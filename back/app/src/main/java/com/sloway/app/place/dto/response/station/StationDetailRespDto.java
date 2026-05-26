package com.sloway.app.place.dto.response.station;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@ToString
public class StationDetailRespDto {

    // 1. 상단 헤더 정보
    private HeaderInfo header;

    // 2. 대시보드 요약 카드 정보
    private SummaryCard summary;

    // 3. 기본 정보
    private BasicInfo basicInfo;

    // 4. 편의시설 목록 (텍스트 리스트)
    private List<String> facilities;

    // 5. 최근 예약 내역 목록
    private List<RecentBooking> recentBookings;

    // --- Inner DTOs ---

    @Getter
    @Builder
    @AllArgsConstructor
    @ToString
    public static class HeaderInfo {
        private String imageUrl;     // 숙소 대표 이미지 URL (초록 나무 아이콘 부분)
        private String type;         // 유형 (예: "워크앤스테이")
        private String status;       // 운영 상태 (예: "운영 중")
        private String title;        // 공간 이름 (예: "청평 숲속 파인뷰 스테이")
        private String location;     // 주소 요약 (예: "경기 가평군 청평면")
        private Double rating;       // 평점 (예: 4.9)
        private Integer reviewCount; // 리뷰 개수 (예: 127)
    }

    @Getter
    @Builder
    @AllArgsConstructor
    @ToString
    public static class SummaryCard {
        private Integer monthlyBookings; // 이번 달 예약 건수 (예: 8)
        private Long monthlyRevenue;     // 이번 달 매출 (예: 2040000)
        private Double averageRating;    // 평균 평점 (예: 4.9)
        private Integer totalReviews;    // 총 리뷰 수 (예: 127)
    }

    @Getter
    @Builder
    @AllArgsConstructor
    @ToString
    public static class BasicInfo {
        private String name;             // 공간 이름
        private String type;             // 유형
        private String address;          // 전체 주소
        private Integer capacity;        // 최대 수용 인원 (예: 4)
        private Integer baseCapacity;    // 기준 인원 (예: 2)
        private Long basePrice;          // 기본 요금 (1박) (예: 185000)
        private Long weekendPrice;       // 주말 요금 (예: 220000)
        private String checkInTime;      // 체크인 시간 (예: "오후 3:00")
        private String checkOutTime;     // 체크아웃 시간 (예: "오전 11:00")
    }

    @Getter
    @Builder
    @AllArgsConstructor
    @ToString
    public static class RecentBooking {
        private Long bookingId;          // 예약 식별 ID (상세 이동용)
        private String userImageUrl;     // 예약자 프로필 이미지 URL
        private String userName;         // 예약자 이름 (예: "박민수")
        private Long bookingCode;      // 예약 코드 (예: "SW-20260424-892")
        private String bookingPeriod;    // 예약 기간 (예: "5/10-5/12")
        private Integer totalPrice;         // 결제 금액 (예: 370000)
    }
}