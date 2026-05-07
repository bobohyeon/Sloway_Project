import React from 'react';
import styled from 'styled-components';

const PageWrapper = styled.div`
  background-color: #f8f9f6;
  /* 화면 전체 높이를 고정하여 내부 스크롤 유도 */
  height: 100%;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden; /* 브라우저 자체 스크롤은 막음 */
`;

const Container = styled.div`
  width: 100%;
  max-width: 900px;
  /* height: 50%를 삭제하고 flex를 활용해 남은 공간을 다 쓰게 합니다 */
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  margin-bottom: 30px;
  flex-shrink: 0; /* 헤더는 스크롤 시 사라지지 않게 고정 */
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

// 콘텐츠 폼이 담길 스크롤 영역
const FormScrollArea = styled.div`
  flex: 1; /* 남은 높이를 모두 차지 */
  overflow-y: auto; /* 내용이 길어지면 스크롤 발생 */
  padding-right: 10px; /* 스크롤바와 콘텐츠 간격 */

  /* 스크롤바 디자인 (3px) */
  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #768966;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`;

function InsertStationLayout({ stateSection, currentStepSection }) {
  return (
    <PageWrapper>
      <Container>
        <Header>
          <h1>숙소 등록</h1>
          <p>휴식 중심의 숙박 공간을 등록합니다</p>
        </Header>

        <BackButton onClick={() => window.history.back()}>
          내 공간 목록
        </BackButton>

        {/* 단계 표시 바는 고정 (상태를 계속 봐야 하므로) */}
        <div style={{ flexShrink: 0 }}>{stateSection}</div>

        {/* 입력 폼 부분만 스크롤 발생 */}
        <FormScrollArea style={{ marginTop: '20px' }}>
          {currentStepSection}
        </FormScrollArea>
      </Container>
    </PageWrapper>
  );
}

export default InsertStationLayout;
