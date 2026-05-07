import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import ApprovalTable from './../../components/admin/ApprovalTable';
import ApprovalStats from '../../components/admin/ApprovalStats';

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
  color: ${(props) => (props.active ? '#333' : '#aaa')};
  font-weight: ${(props) => (props.active ? '600' : '400')};
  cursor: pointer;
  position: relative;
  padding-bottom: 5px;

  ${(props) =>
    props.active &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: #768966;
    }
  `}

  span {
    margin-left: 4px;
    background: ${(props) => (props.active ? '#768966' : '#eee')};
    color: ${(props) => (props.active ? 'white' : '#aaa')};
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

function SpaceApprovalPage() {
  const [currentTab, setCurrentTab] = useState('검수 대기');

  // 1. 전체 원본 데이터 (더미)
  const rawData = [
    {
      id: 'SP-000142',
      name: '제주 돌담집 리트릿',
      host: '박진호',
      type: '숙소',
      images: 7,
      price: '220,000',
      date: '2026.04.23 18:20',
      wait: '1일',
      status: '검수 대기',
    },
    {
      id: 'SP-000141',
      name: '판교 테크오피스',
      host: '이민지',
      type: '코워킹오피스',
      images: 8,
      price: '28,000',
      date: '2026.04.22 10:15',
      wait: '2일',
      status: '검수 대기',
      isAlert: true,
    },
    {
      id: 'SP-000140',
      name: '성수 루프탑 스튜디오',
      host: '김철수',
      type: '스튜디오',
      images: 5,
      price: '55,000',
      date: '2026.04.20 14:00',
      wait: '-',
      status: '승인 완료',
    },
    {
      id: 'SP-000139',
      name: '강남 세미나룸',
      host: '최영희',
      type: '회의실',
      images: 4,
      price: '15,000',
      date: '2026.04.19 09:30',
      wait: '-',
      status: '반려',
    },
    {
      id: 'SP-000138',
      name: '홍대 연습실',
      host: '정민수',
      type: '연습실',
      images: 6,
      price: '12,000',
      date: '2026.04.18 11:10',
      wait: '-',
      status: '중지',
    },
    {
      id: 'SP-000137',
      name: '부산 오션뷰 카페',
      host: '이하늘',
      type: '카페',
      images: 10,
      price: '40,000',
      date: '2026.04.17 16:45',
      wait: '-',
      status: '승인 완료',
    },
  ];

  // 2. 탭별 개수 계산
  const counts = {
    전체: rawData.length,
    '검수 대기': rawData.filter((d) => d.status === '검수 대기').length,
    '승인 완료': rawData.filter((d) => d.status === '승인 완료').length,
    반려: rawData.filter((d) => d.status === '반려').length,
    중지: rawData.filter((d) => d.status === '중지').length,
  };

  // 3. 현재 탭에 맞는 필터링 데이터
  const filteredData = useMemo(() => {
    if (currentTab === '전체') return rawData;
    return rawData.filter((item) => item.status === currentTab);
  }, [currentTab]);

  return (
    <PageContainer>
      <Header>
        <h1>공간 검수 및 승인</h1>
        <p>호스트가 등록한 공간을 검토하고 최종 승인 상태를 관리하세요</p>
      </Header>

      {/* 통계 컴포넌트에 데이터 전달 가능 (필요 시) */}
      <ApprovalStats totalData={rawData} />

      <FilterBar>
        <TabGroup>
          {Object.keys(counts).map((tab) => (
            <Tab
              key={tab}
              active={currentTab === tab}
              onClick={() => setCurrentTab(tab)}
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

      {/* 필터링된 데이터를 자식에게 전달 */}
      <ApprovalTable data={filteredData} />
    </PageContainer>
  );
}

export default SpaceApprovalPage;
