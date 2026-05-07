import React, { useState } from "react";
import styled from "styled-components";
import SpaceSummaryComponent from "../components/SpaceSummaryComponent";
import SpaceListComponent from "../components/SpaceListComponent";

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

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 30px;

  .title-area {
    h1 {
      font-size: 28px;
      color: #333;
      margin-bottom: 8px;
    }
    p {
      color: #888;
      font-size: 14px;
    }
  }

  .button-group {
    display: flex;
    gap: 10px;
  }
`;

const NavButton = styled.button`
  padding: 10px 18px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: white;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
  color: #555;
  transition: all 0.2s ease-in-out;

  /* active 클래스 대신 hover 스타일 적용 */
  &:hover {
    background-color: #5a6a4d;
    color: white;
    border-color: #5a6a4d;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

function SpaceListPage() {
  const [activeTab, setActiveTab] = useState("전체");

  const [spaces, setSpaces] = useState([
    {
      id: 1,
      type: "워크앤스테이",
      status: "운영 중",
      title: "청평 숲속 파인뷰 스테이",
      location: "경기 가평",
      rating: "4.9",
      reviews: "127",
      monthlyBookings: 8,
      price: "185,000",
      icon: "🌲",
    },
    {
      id: 2,
      type: "코워킹오피스",
      status: "운영 중",
      title: "성수 브릭라운지",
      location: "서울 성수",
      rating: "4.88",
      reviews: "312",
      monthlyBookings: 24,
      price: "25,000",
      icon: "🧱",
    },
    {
      id: 3,
      type: "숙소",
      status: "검수 대기",
      title: "제주 돌담집 리트릿",
      location: "제주 서귀포",
      rating: "4.9",
      reviews: "89",
      monthlyBookings: 5,
      price: "220,000",
      icon: "🏝️",
    },
  ]);

  return (
    <PageWrapper>
      <Container>
        <Header>
          <div className="title-area">
            <h1>내 공간 목록</h1>
            <p>운영 중인 공간을 관리하세요</p>
          </div>
          <div className="button-group">
            <NavButton>🏠 숙소 등록</NavButton>
            <NavButton>🌿 워크앤스테이 등록</NavButton>
            <NavButton>💻 오피스 등록</NavButton>
          </div>
        </Header>

        <SpaceSummaryComponent spaces={spaces} />

        <SpaceListComponent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          spaces={spaces}
        />
      </Container>
    </PageWrapper>
  );
}

export default SpaceListPage;
