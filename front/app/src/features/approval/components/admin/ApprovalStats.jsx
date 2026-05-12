import React from 'react';
import styled from 'styled-components';
import {
  FaGlobe,
  FaHourglassHalf,
  FaCheckCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  padding: 25px;
  border-radius: 15px;
  border: 1px solid ${(props) => (props.$highlight ? '#a8b89f' : '#eee')};
  border-width: ${(props) => (props.$highlight ? '2px' : '1px')};
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);

  .label-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #666;

    .icon {
      color: ${(props) => (props.$highlight ? '#a8b89f' : '#ccc')};
    }
  }
  .value {
    font-size: 28px;
    font-weight: bold;
    color: #333;
  }
  .trend {
    font-size: 12px;
    color: #a8b89f;
  }
`;

function ApprovalStats({ totalData }) {
  // ✅ image_fe87d7.png의 상태값(P, A, R)을 기준으로 데이터 계산
  const total = totalData.length;

  // P: PENDING (대기)
  const waiting = totalData.filter((d) => d.status === 'P').length;

  // A: APPROVED (승인) - 이번 달 승인 데이터가 실제 데이터에 있다면 필터링 가능
  const approved = totalData.filter((d) => d.status === 'A').length;

  // R: REJECTED (반려)
  const rejected = totalData.filter((d) => d.status === 'R').length;

  return (
    <StatsGrid>
      <StatCard>
        <div className="label-row">
          <FaGlobe className="icon" /> 전체 공간
        </div>
        <div className="value">{total}개</div>
      </StatCard>

      <StatCard $highlight>
        <div className="label-row">
          <FaHourglassHalf className="icon" /> 검수 대기
        </div>
        <div className="value">{waiting}개</div>
      </StatCard>

      <StatCard>
        <div className="label-row">
          <FaCheckCircle className="icon" /> 누적 승인
        </div>
        <div className="value">{approved}개</div>
        <div className="trend">실시간 업데이트</div>
      </StatCard>

      <StatCard>
        <div className="label-row">
          <FaExclamationTriangle className="icon" /> 반려
        </div>
        <div className="value">{rejected}개</div>
      </StatCard>
    </StatsGrid>
  );
}

export default ApprovalStats;
