import React from 'react';
import styled from 'styled-components';
import RecentCardList from '../components/user/recentCardList';

// --- Styled Components ---
const PageContainer = styled.div`
  background-color: #f4efe6; /* 요청하신 배경색 */
  min-height: 100vh;
  padding: 40px;
  font-family: 'Pretendard', sans-serif; /* 기본 폰트 가정 */
`;

const LayoutWrapper = styled.div`
  display: flex;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

const SidebarPlaceholder = styled.aside`
  width: 200px;
  /* 임시 사이드바 스타일 (나중에 교체) */
`;

const MainContent = styled.main`
  flex: 1;
`;

const HeaderSection = styled.div`
  margin-bottom: 24px;
`;

const PageTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 12px;
`;

const PageSubtitle = styled.p`
  font-size: 14px;
  color: #777;
  margin-bottom: 20px;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #ddd;
  margin-bottom: 20px;
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const TotalCount = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #555;
`;

const ClearAllButton = styled.button`
  background: none;
  border: none;
  font-size: 13px;
  color: #a8b89f; /* 요청하신 포인트 색상 적용 */
  text-decoration: underline;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #8a9a82;
  }
`;

// --- Component ---
function RecentPlacePage() {
  return (
    <PageContainer>
      {/* <h1>헤더공간</h1> (추후 공용 컴포넌트로 교체) */}
      <LayoutWrapper>
        <SidebarPlaceholder>{/* <h1>사이드바공간</h1> */}</SidebarPlaceholder>

        <MainContent>
          <HeaderSection>
            <PageTitle>최근 본 공간</PageTitle>
            <PageSubtitle>
              최근 조회한 공간 7개 · 최대 10개까지 표시됩니다
            </PageSubtitle>
            <Divider />
          </HeaderSection>

          <ListHeader>
            <TotalCount>총 7개</TotalCount>
            <ClearAllButton>전체 지우기</ClearAllButton>
          </ListHeader>

          {/* 리스트 영역 */}
          <RecentCardList />
        </MainContent>
      </LayoutWrapper>
    </PageContainer>
  );
}

export default RecentPlacePage;
