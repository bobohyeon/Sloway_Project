import React from "react";
import styled from "styled-components";

const TabContainer = styled.div`
  display: flex;
  gap: 30px;
  border-bottom: 1px solid #eee;
  margin-bottom: 25px;
`;

const Tab = styled.div`
  padding: 12px 5px;
  font-size: 15px;
  cursor: pointer;
  color: ${(props) => (props.active ? "#333" : "#aaa")};
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  border-bottom: ${(props) => (props.active ? "2px solid #768966" : "none")};
  display: flex;
  align-items: center;
  gap: 6px;

  span {
    background: ${(props) => (props.active ? "#768966" : "#eee")};
    color: ${(props) => (props.active ? "white" : "#999")};
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 11px;
  }
`;

const SpaceCard = styled.div`
  background: white;
  border-radius: 15px;
  border: 1px solid #eee;
  padding: 20px;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  position: relative;
`;

const Thumbnail = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  background-color: #f1f4ee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  margin-right: 20px;
`;

const ContentArea = styled.div`
  flex: 1;
  .type-status {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
  }
  h3 {
    font-size: 18px;
    margin-bottom: 8px;
    color: #333;
  }
  .info {
    font-size: 13px;
    color: #888;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const Tag = styled.span`
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
  background: ${(props) => (props.type === "status" ? "#f1f1f1" : "#fff4f0")};
  color: ${(props) => (props.type === "status" ? "#888" : "#d46a4f")};
  border: 1px solid ${(props) => (props.type === "status" ? "#ddd" : "#ffedcc")};
`;

const RightArea = styled.div`
  text-align: right;
  .price {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
    span {
      font-size: 14px;
      font-weight: normal;
    }
  }
  .actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: white;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  &:hover {
    background: #f9f9f9;
  }
`;

function SpaceListComponent({ activeTab, setActiveTab, spaces = [] }) {
  // 1. 각 카테고리별 개수 동적 계산
  const counts = {
    전체: spaces.length,
    숙소: spaces.filter((s) => s.type === "숙소").length,
    워크앤스테이: spaces.filter((s) => s.type === "워크앤스테이").length,
    코워킹오피스: spaces.filter((s) => s.type === "코워킹오피스").length,
  };

  // 2. 현재 선택된 탭에 따른 리스트 필터링
  const filteredSpaces =
    activeTab === "전체"
      ? spaces
      : spaces.filter((space) => space.type === activeTab);

  return (
    <>
      <TabContainer>
        {["전체", "숙소", "워크앤스테이", "코워킹오피스"].map((tabName) => (
          <Tab
            key={tabName}
            active={activeTab === tabName}
            onClick={() => setActiveTab(tabName)}
          >
            {tabName} <span>{counts[tabName]}</span>
          </Tab>
        ))}
      </TabContainer>

      {filteredSpaces.length > 0 ? (
        filteredSpaces.map((space) => (
          <SpaceCard key={space.id}>
            <Thumbnail>{space.icon}</Thumbnail>
            <ContentArea>
              <div className="type-status">
                <Tag>{space.type}</Tag>
                <Tag type="status">{space.status}</Tag>
              </div>
              <h3>{space.title}</h3>
              <div className="info">
                <span>📍 {space.location}</span>
                <span>
                  ⭐ {space.rating} ({space.reviews})
                </span>
                <span>• 이번 달 {space.monthlyBookings}건 예약</span>
              </div>
            </ContentArea>
            <RightArea>
              <div className="price">
                {typeof space.price === "string"
                  ? space.price
                  : space.price.toLocaleString()}
                원~
              </div>
              <div className="actions">
                <ActionButton>🖼️ 이미지</ActionButton>
                <ActionButton>📝 수정</ActionButton>
              </div>
            </RightArea>
          </SpaceCard>
        ))
      ) : (
        <div style={{ textAlign: "center", padding: "50px", color: "#888" }}>
          해당 카테고리에 등록된 공간이 없습니다.
        </div>
      )}
    </>
  );
}

export default SpaceListComponent;
