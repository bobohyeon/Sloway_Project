import React from "react";
import styled from "styled-components";
import DetailHeader from "../components/DetailHeader";
import DetailSummaryCards from "../components/DetailSummaryCards";
import DetailBasicInfo from "../components/DetailBasicInfo";
import DetailFacilities from "../components/DetailFacilities";
import RecentBookings from "../components/RecentBookings";

const PageWrapper = styled.div`
  background-color: #f8f9f6;
  min-height: 100vh;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1100px;
`;

const BackLink = styled.div`
  color: #888;
  font-size: 14px;
  margin-bottom: 20px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

function StationDetailPage() {
  // 실제로는 useParams로 ID를 가져와 서버에서 데이터를 호출합니다.
  const spaceData = {
    title: "청평 숲속 파인뷰 스테이",
    type: "워크앤스테이",
    status: "운영 중",
    location: "경기 가평군 청평면",
    rating: 4.9,
    reviews: 127,
    bookings: 8,
    revenue: "2,040,000",
    basicInfo: {
      name: "청평 숲속 파인뷰 스테이",
      type: "워크앤스테이",
      address: "경기 가평군 청평면",
      capacity: "4명 (기준 2명)",
      price: "185,000",
      weekendPrice: "220,000",
      checkIn: "오후 3:00",
      checkOut: "오전 11:00",
    },
    facilities: [
      "듀얼 모니터",
      "회의실",
      "프린터",
      "폰부스",
      "광랜 WIFI",
      "공용 라운지",
      "주방",
      "주차",
    ],
    recentBookings: [
      {
        id: 1,
        name: "박민수",
        code: "SW-20260424-892",
        date: "5/10-5/12",
        price: "370,000",
      },
      {
        id: 2,
        name: "홍길동",
        code: "SW-20260424-847",
        date: "5/8-5/10",
        price: "326,500",
      },
      {
        id: 3,
        name: "김수현",
        code: "SW-20260420-712",
        date: "4/30-5/2",
        price: "370,000",
      },
    ],
  };

  return (
    <PageWrapper>
      <Container>
        <DetailHeader title={spaceData.title} />
        <BackLink>← 내 공간 목록</BackLink>

        {/* 상단 프로필 섹션 */}
        <ProfileBanner data={spaceData} />

        {/* 수치 요약 카드 */}
        <DetailSummaryCards data={spaceData} />

        {/* 기본 정보 */}
        <DetailBasicInfo info={spaceData.basicInfo} />

        {/* 편의 시설 */}
        <DetailFacilities items={spaceData.facilities} />

        {/* 최근 예약 */}
        <RecentBookings bookings={spaceData.recentBookings} />
      </Container>
    </PageWrapper>
  );
}

// 내부 보조 컴포넌트: ProfileBanner
const Banner = styled.div`
  background: white;
  border-radius: 15px;
  padding: 30px;
  border: 1px solid #e0e4d9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
`;

const ProfileInfo = styled.div`
  display: flex;
  gap: 20px;
  .icon {
    font-size: 50px;
    background: #f1f4ee;
    padding: 15px;
    border-radius: 12px;
  }
  .text h2 {
    font-size: 24px;
    margin-bottom: 8px;
  }
  .tags {
    display: flex;
    gap: 5px;
    margin-bottom: 8px;
  }
`;

function ProfileBanner({ data }) {
  return (
    <Banner>
      <ProfileInfo>
        <div className="icon">🌲</div>
        <div className="text">
          <div className="tags">
            <Tag color="#888">{data.type}</Tag>
            <Tag color="#768966">✓ {data.status}</Tag>
          </div>
          <h2>{data.title}</h2>
          <p style={{ color: "#888", fontSize: "14px" }}>
            📍 {data.location} | ⭐ {data.rating} ({data.reviews}개 리뷰)
          </p>
        </div>
      </ProfileInfo>
      <div style={{ textAlign: "right" }}>
        <button
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            display: "block",
            marginBottom: "10px",
          }}
        >
          👁️ 회원 보기
        </button>
        <button
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            color: "#4a6fa5",
          }}
        >
          ⏸️ 일시 중지
        </button>
      </div>
    </Banner>
  );
}

const Tag = styled.span`
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  background: #f1f1f1;
  color: ${(props) => props.color};
`;

export default StationDetailPage;
