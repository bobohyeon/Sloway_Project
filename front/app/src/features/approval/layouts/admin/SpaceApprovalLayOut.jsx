import React from 'react';
import styled from 'styled-components';

// --- Styled Components (레이아웃 스타일) ---
const PageContainer = styled.div`
  padding: 40px;
  background-color: #f9faf8;
  min-height: 100vh;
`;

const Header = styled.div`
  margin-bottom: 30px;
  h1 {
    font-size: 24px;
    color: #333;
    margin-bottom: 8px;
  }
  p {
    font-size: 14px;
    color: #888;
  }
`;

const FilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: white;
  padding: 15px 25px;
  border-radius: 12px;
  border: 1px solid #eee;
`;

const TabGroup = styled.div`
  display: flex;
  gap: 20px;
`;

const Tab = styled.div`
  font-size: 14px;
  color: ${(props) => (props.$active ? '#333' : '#aaa')};
  font-weight: ${(props) => (props.$active ? '600' : '400')};
  cursor: pointer;
  position: relative;
  padding-bottom: 5px;

  ${(props) =>
    props.$active &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: 0; left: 0; width: 100%; height: 2px;
      background-color: #768966;
    }
  `}

  span {
    margin-left: 4px;
    background: ${(props) => (props.$active ? '#768966' : '#eee')};
    color: ${(props) => (props.$active ? 'white' : '#aaa')};
    padding: 2px 6px;
    border-radius: 10px;
    font-size: 11px;
  }
`;

const SearchArea = styled.div`
  display: flex;
  gap: 10px;
  select,
  input {
    padding: 8px 12px;
    border: 1px solid #eee;
    border-radius: 6px;
    font-size: 13px;
    outline: none;
  }
`;

// --- Layout 컴포넌트 ---
function SpaceApprovalLayout({
  currentTab,
  onTabChange,
  counts,
  statsSection,
  tableSection,
}) {
  return (
    <PageContainer>
      <Header>
        <h1>공간 검수 및 승인</h1>
        <p>호스트가 등록한 공간을 검토하고 최종 승인 상태를 관리하세요</p>
      </Header>

      {/* 상단 통계 영역 슬롯 */}
      {statsSection}

      <FilterBar>
        <TabGroup>
          {Object.keys(counts).map((tab) => (
            <Tab
              key={tab}
              $active={currentTab === tab}
              onClick={() => onTabChange(tab)}
            >
              {tab} <span>{counts[tab]}</span>
            </Tab>
          ))}
        </TabGroup>
        <SearchArea>
          <select>
            <option>전체 유형</option>
          </select>
          <input type="text" placeholder="🔍 공간명·호스트 검색" />
        </SearchArea>
      </FilterBar>

      {/* 하단 테이블 영역 슬롯 */}
      {tableSection}
    </PageContainer>
  );
}

export default SpaceApprovalLayout;
