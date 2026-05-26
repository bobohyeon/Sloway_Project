import React from 'react';
import styled from 'styled-components';
import DetailSummaryCards from '../../../components/host/detail/DetailSummaryCards';
import DetailBasicInfo from './../../../components/host/detail/DetailBasicInfo';
import DetailFacilities from '../../../components/host/detail/DetailFacilities';
import RecentBookings from './../../../components/host/detail/RecentBookings';
import PageLayout from '../../../../../app/layouts/page/PageLayout';

// --- 스타일 정의 ---
const PageWrapper = styled.div`
  background-color: #f4efe6;
  min-height: 100vh;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1100px;
`;

const BackLink = styled.div`
  color: #888;
  font-size: 14px;
  margin-bottom: 20px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Banner = styled.div`
  background: white;
  border-radius: 15px;
  padding: 30px;
  border: 1px solid #e0e4d9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
`;

const ProfileInfo = styled.div`
  display: flex;
  gap: 20px;
  .icon {
    font-size: 50px;
    background: #f1f4ee;
    padding: 15px;
    border-radius: 12px;
  }
  .text h2 {
    font-size: 24px;
    margin-bottom: 8px;
  }
  .tags {
    display: flex;
    gap: 5px;
    margin-bottom: 8px;
  }
`;

const Tag = styled.span`
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  background: #f1f1f1;
  color: ${(props) => props.$color || '#888'}; // Transient prop 사용
`;

// --- 레이아웃 컴포넌트 ---
function StationDetailLayout({
  data,
  onBack,
  handleUpdateDetail,
  handleImageUpdate,
}) {
  return (
    <PageWrapper>
      <Container>
        <PageLayout
          title={data.header.title}
          backTo={onBack}
          backLabel="내 공간 목록"
        >
          {/* 프로필 배너 섹션 */}
          <Banner>
            <ProfileInfo>
              <div className="icon">🌲</div>
              <div className="text">
                <div className="tags">
                  <Tag $color="#888">{data.header.type}</Tag>
                  <Tag $color="#768966">{data.header.status}</Tag>
                </div>
                <h2>{data.basicInfo.name}</h2>
                <p style={{ color: '#888', fontSize: '14px' }}>
                  📍 {data.basicInfo.address} | ⭐ {data.header.rating} (
                  {data.header.reviewCount}개 리뷰)
                </p>
              </div>
            </ProfileInfo>
            <div style={{ textAlign: 'right' }}>
              <button
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  display: 'block',
                  marginBottom: '10px',
                }}
                onClick={handleUpdateDetail}
              >
                정보 수정
              </button>
              <button
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: '#4a6fa5',
                }}
                onClick={handleImageUpdate}
              >
                이미지 수정
              </button>
            </div>
          </Banner>

          {/* 수치 요약 카드 */}
          <DetailSummaryCards data={data.summary} />

          {/* 기본 정보 */}
          <DetailBasicInfo info={data.basicInfo} />

          {/* 편의 시설 */}
          <DetailFacilities items={data.facilities} />

          {/* 최근 예약 */}
          <RecentBookings bookings={data.recentBookings} />
        </PageLayout>
      </Container>
    </PageWrapper>
  );
}

export default StationDetailLayout;
