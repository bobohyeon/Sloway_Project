import React from "react";
import styled from "styled-components";

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
  border: 1px solid ${(props) => (props.highlight ? "#768966" : "#eee")};
  border-width: ${(props) => (props.highlight ? "2px" : "1px")};
  display: flex;
  flex-direction: column;
  gap: 10px;

  .label-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #666;
  }
  .value {
    font-size: 28px;
    font-weight: bold;
    color: #333;
  }
  .trend {
    font-size: 12px;
    color: #768966;
  }
`;

function ApprovalStats({ totalData }) {
  // 부모로부터 받은 데이터를 기반으로 통계 계산
  const total = totalData.length;
  const waiting = totalData.filter((d) => d.status === "검수 대기").length;
  const rejected = totalData.filter(
    (d) => d.status === "반려" || d.status === "중지",
  ).length;

  return (
    <StatsGrid>
      <StatCard>
        <div className="label-row">
          <span>🌿</span> 전체 공간
        </div>
        <div className="value">{total}개</div>
      </StatCard>
      <StatCard highlight>
        <div className="label-row">
          <span>⏳</span> 검수 대기
        </div>
        <div className="value">{waiting}개</div>
      </StatCard>
      <StatCard>
        <div className="label-row">
          <span>✓</span> 이번 달 승인
        </div>
        <div className="value">8개</div>
        <div className="trend">+2</div>
      </StatCard>
      <StatCard>
        <div className="label-row">
          <span>⚠️</span> 반려·중지
        </div>
        <div className="value">{rejected}개</div>
      </StatCard>
    </StatsGrid>
  );
}

export default ApprovalStats;
