import React from 'react';
import styled from 'styled-components';

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
`;

const SummaryCard = styled.div`
  background: white;
  padding: 25px;
  border-radius: 12px;
  text-align: center;
  border: 1px solid #eee;

  .count {
    font-size: 24px;
    font-weight: bold;
    color: #768966;
    margin-bottom: 10px;
  }
  .label {
    font-size: 14px;
    color: #888;
  }
`;

function SpaceSummaryComponent({ spaces = [] }) {
  // 1. 전체 공간 수
  const totalCount = spaces.length;

  // 2. 운영 중인 공간 수 (status가 '운영 중'인 것 필터링)
  const activeCount = spaces.filter(
    (space) => space.status === '운영 중'
  ).length;

  // 3. 검수 대기 중인 공간 수 (status가 '검수 대기'인 것 필터링)
  const pendingCount = spaces.filter(
    (space) => space.status === '검수 대기'
  ).length;

  // 4. 이번 달 예약 (이 수치는 보통 별도의 API 데이터이므로 임시로 합산하거나 props로 받음)
  const totalBookings = spaces.reduce(
    (acc, cur) => acc + Number(cur.monthlyBookings || 0),
    0
  );

  const stats = [
    { label: '전체 공간', count: totalCount },
    { label: '운영 중', count: activeCount },
    { label: '검수 대기', count: pendingCount },
    { label: '이번 달 예약', count: totalBookings },
  ];

  return (
    <SummaryGrid>
      {stats.map((stat, index) => (
        <SummaryCard key={index}>
          <div className="count">
            {/* 숫자가 0일 때도 0으로 표시되도록 처리 */}
            {typeof stat.count === 'number' ? stat.count.toLocaleString() : 0}
          </div>
          <div className="label">{stat.label}</div>
        </SummaryCard>
      ))}
    </SummaryGrid>
  );
}

export default SpaceSummaryComponent;
