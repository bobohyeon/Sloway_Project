import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const PageWrapper = styled.div`
  background-color: #f8f9f6;
  height: 100%;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Container = styled.div`
  width: 100%;
  max-width: 900px;
  height: 100%;
  display: flex;
  flex-direction: column;
  /* 기존 패딩 유지 */
  padding: 30px 20px 20px 20px;
`;

const Header = styled.header`
  margin-bottom: 30px;
  flex-shrink: 0;
  h1 {
    font-size: 28px;
    color: #333;
    margin-bottom: 8px;
  }
  p {
    color: #888;
    font-size: 14px;
  }
`;

const BackButton = styled.div`
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  &:before {
    content: '← ';
    margin-right: 5px;
  }
`;

function InsertSpaceLayout({ stateSection, currentStepSection }) {
  const navigate = useNavigate();
  return (
    <PageWrapper>
      <Container>
        <Header>
          <h1>공간 등록</h1>
          <p>공간을 등록합니다</p>
        </Header>

        <BackButton onClick={() => navigate(`/host/space/list`)}>
          내 공간 목록
        </BackButton>

        {/* 단계 표시 바 고정 */}
        <div style={{ flexShrink: 0 }}>{stateSection}</div>

        <div
          style={{
            marginTop: '20px',
            flex: 1,
            paddingBottom: '40px' /* ✅ 하단 버튼 20px 여백 + 여유공간 */,
          }}
        >
          {currentStepSection}
        </div>
      </Container>
    </PageWrapper>
  );
}

export default InsertSpaceLayout;
