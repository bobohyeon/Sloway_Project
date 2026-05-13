import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PageLayout from './../../../../../../app/layouts/page/PageLayout';

const PageWrapper = styled.div`
  background-color: #f4efe6;
  height: 100%;
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

function UpdateStationLayout({ stateSection, currentStepSection }) {
  return (
    <PageWrapper>
      <Container>
        <PageLayout
          title={'숙소 등록'}
          description={'휴식 중심의 숙박 공간을 등록합니다'}
          backTo={`/host/space/list`}
          backLabel="내 공간 목록"
        >
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
        </PageLayout>
      </Container>
    </PageWrapper>
  );
}

export default UpdateStationLayout;
