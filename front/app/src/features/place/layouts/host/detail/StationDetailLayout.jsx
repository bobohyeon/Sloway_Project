import React from 'react';
import styled from 'styled-components';
import DetailSummaryCards from '../../../components/host/detail/DetailSummaryCards';
import DetailBasicInfo from './../../../components/host/detail/DetailBasicInfo';
import DetailFacilities from '../../../components/host/detail/DetailFacilities';
import RecentBookings from './../../../components/host/detail/RecentBookings';

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
function StationDetailLayout({ data, onBack }) {
  return (
    <PageWrapper>
      <Container>
        <DetailHeader title={data.title} />
        <BackLink onClick={onBack}>← 내 공간 목록</BackLink>

        {/* 프로필 배너 섹션 */}
        <Banner>
          <ProfileInfo>
            <div className="icon">🌲</div>
            <div className="text">
              <div className="tags">
                <Tag $color="#888">{data.type}</Tag>
                <Tag $color="#768966">✓ {data.status}</Tag>
              </div>
              <h2>{data.title}</h2>
              <p style={{ color: '#888', fontSize: '14px' }}>
                📍 {data.location} | ⭐ {data.rating} ({data.reviews}개 리뷰)
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
            >
              👁️ 회원 보기
            </button>
            <button
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: '#4a6fa5',
              }}
            >
              ⏸️ 일시 중지
            </button>
          </div>
        </Banner>

        {/* 수치 요약 카드 */}
        <DetailSummaryCards data={data} />

        {/* 기본 정보 */}
        <DetailBasicInfo info={data.basicInfo} />

        {/* 편의 시설 */}
        <DetailFacilities items={data.facilities} />

        {/* 최근 예약 */}
        <RecentBookings bookings={data.recentBookings} />
      </Container>
    </PageWrapper>
  );
}

export default StationDetailLayout;
