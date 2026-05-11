import React from 'react';
import styled from 'styled-components';

const PageWrapper = styled.div`
  background-color: #f4efe6;
  min-height: 100vh;
  padding: 40px 20px 120px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
`;
const Container = styled.div`
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 30px;

  .title-area h1 {
    font-size: 28px;
    font-weight: 800;
    color: #333;
    margin: 0;
  }

  .title-area p {
    font-size: 16px;
    color: #666;
    margin: 8px 0 0 0;
  }
`;

const TabBar = styled.div`
  display: flex;
  gap: 30px;
  margin: 20px 0; /* 요약 섹션과 리스트 사이 간격 */
  border-bottom: 1px solid #eee;
`;

const TabItem = styled.div`
  padding: 12px 5px;
  font-size: 16px;
  font-weight: ${(props) => (props.$active ? '700' : '400')};
  color: ${(props) => (props.$active ? '#768966' : '#999')};
  border-bottom: ${(props) =>
    props.$active ? '3px solid #768966' : '3px solid transparent'};
  cursor: pointer;
  transition: all 0.2s;

  span {
    font-size: 13px;
    margin-left: 6px;
    opacity: 0.6;
  }

  &:hover {
    color: #768966;
  }
`;

const ListContainer = styled.div`
  width: 100%;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 16px; /* 카드 간격 최적화 */
`;

function SpaceListLayout({
  summarySection, // 상단 요약 카드 영역 (전체, 운영중 등)
  listSection, // 필터링된 리스트 영역
  tabs, // 탭 데이터 (key, label, count)
  activeTab, // 현재 활성화된 탭 key
  onTabChange, // 탭 클릭 핸들러
}) {
  return (
    <PageWrapper>
      <Container>
        <Header>
          <div className="title-area">
            <h1>내 공간 목록</h1>
            <p>운영 중인 공간을 관리하세요</p>
          </div>
        </Header>

        {/* 1. 요약 정보 섹션 (5 전체공간 / 3 운영중 등) */}
        {summarySection}

        {/* 2. 유형별 필터 탭 (전체 / 숙소 / 오피스 / 워크앤스테이) */}
        {tabs && (
          <TabBar>
            {tabs.map((tab) => (
              <TabItem
                key={tab.key}
                $active={activeTab === tab.key}
                onClick={() => onTabChange(tab.key)}
              >
                {tab.label} <span>{tab.count}</span>
              </TabItem>
            ))}
          </TabBar>
        )}

        {/* 3. 실제 공간 리스트 섹션 */}
        <ListContainer>{listSection}</ListContainer>
      </Container>
    </PageWrapper>
  );
}

export default SpaceListLayout;
