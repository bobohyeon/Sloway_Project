import styled from 'styled-components';
import PageLayout from '../../../../../app/layouts/page/PageLayout';

const PageWrapper = styled.div`
  background-color: #f4efe6;
  min-height: 100vh; /* 페이지 전체 최소 높이 */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 50px; /* 하단 여백 확보 */
`;

const Container = styled.div`
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;
`;

const TabBar = styled.div`
  display: flex;
  gap: 30px;
  margin: 20px 0; /* 요약 섹션과 리스트 사이 간격 */
  border-bottom: 1px solid #eee;
`;

const TabItem = styled.div`
  padding: 12px 5px;
  font-size: 16px;
  font-weight: ${(props) => (props.$active ? '700' : '400')};
  color: ${(props) => (props.$active ? '#768966' : '#999')};
  border-bottom: ${(props) =>
    props.$active ? '3px solid #768966' : '3px solid transparent'};
  cursor: pointer;
  transition: all 0.2s;

  span {
    font-size: 13px;
    margin-left: 6px;
    opacity: 0.6;
  }

  &:hover {
    color: #768966;
  }
`;

const ListContainer = styled.div`
  width: 100%;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 16px; /* 카드 간격 최적화 */
`;

function SpaceListLayout({
  summarySection, // 상단 요약 카드 영역 (전체, 운영중 등)
  listSection, // 필터링된 리스트 영역
  tabs, // 탭 데이터 (key, label, count)
  activeTab, // 현재 활성화된 탭 key
  onTabChange, // 탭 클릭 핸들러
}) {
  return (
    <PageWrapper>
      <Container>
        <PageLayout
          title={'내 공간 목록'}
          description={'운영 중인 공간을 관리하세요'}
        >
          {/* 1. 요약 정보 섹션 (5 전체공간 / 3 운영중 등) */}
          {summarySection}

          {/* 2. 유형별 필터 탭 (전체 / 숙소 / 오피스 / 워크앤스테이) */}
          {tabs && (
            <TabBar>
              {tabs.map((tab) => (
                <TabItem
                  key={tab.key}
                  $active={activeTab === tab.key}
                  onClick={() => onTabChange(tab.key)}
                >
                  {tab.label} <span>{tab.count}</span>
                </TabItem>
              ))}
            </TabBar>
          )}

          {/* 3. 실제 공간 리스트 섹션 */}
          <ListContainer>{listSection}</ListContainer>
        </PageLayout>
      </Container>
    </PageWrapper>
  );
}

export default SpaceListLayout;
