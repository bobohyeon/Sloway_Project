import React from 'react';
import styled from 'styled-components';
import PageLayout from './../../../../app/layouts/page/PageLayout';

// --- Styled Components ---
const PageContainer = styled.div`
  padding: 20px;
  background-color: #f4efe6;
  height: 95.2%;
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
  padding: 12px 25px;
  border-radius: 12px;
  border: 1px solid #eee;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
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
      background-color: #a8b89f;
    }
  `}

  span {
    margin-left: 4px;
    background: ${(props) => (props.$active ? '#a8b89f' : '#eee')};
    color: ${(props) => (props.$active ? 'white' : '#aaa')};
    padding: 2px 6px;
    border-radius: 10px;
    font-size: 11px;
  }
`;

// image_fda719.png의 느낌을 살린 부드러운 셀렉트 박스
const StyledSelect = styled.select`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1.5px solid #a8b89f; /* 브랜드 컬러 포인트 */
  background-color: #fff;
  color: #555;
  font-size: 14px;
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #86927e;
    background-color: #f9faf8;
  }

  &:focus {
    box-shadow: 0 0 0 2px rgba(168, 184, 159, 0.2);
  }
`;

function SpaceApprovalLayout({
  currentTab,
  onTabChange,
  counts,
  typeFilter,
  statsSection,
  tableSection,
}) {
  return (
    <PageContainer>
      <PageLayout
        title="공간 검수 및 승인"
        description="호스트가 등록한 공간을 검토하고 최종 승인 상태를 관리하세요"
      >
        {statsSection}

        <FilterBar>
          <TabGroup>
            {Object.keys(counts).map((tab) => (
              <Tab
                key={tab}
                $active={currentTab === tab}
                onClick={() => onTabChange(tab)}
              >
                {tab === 'ALL'
                  ? '전체'
                  : tab === 'P'
                    ? '대기'
                    : tab === 'A'
                      ? '승인'
                      : '반려'}
                <span>{counts[tab]}</span>
              </Tab>
            ))}
          </TabGroup>

          <StyledSelect value={typeFilter.value} onChange={typeFilter.onChange}>
            <option value="ALL">전체 유형</option>
            <option value="STATION">숙소</option>
            <option value="OFFICE">오피스</option>
            <option value="WORK_STAY">워크앤스테이</option>
          </StyledSelect>
        </FilterBar>

        {tableSection}
      </PageLayout>
    </PageContainer>
  );
}

export default SpaceApprovalLayout;
