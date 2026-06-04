import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
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
    background-image: url(${(props) => props.$imageUrl});
    background-size: cover;
    background-position: center;
    background-color: #f1f4ee;
    padding: 15px;
    width: 180px;
    height: 150px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
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

/////////////////////////////////////////////모달
const ModalOverlay = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.8);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000;
`;

const SlideContainer = styled.div`
  position: relative;
  img { max-width: 90vw; max-height: 80vh; border-radius: 8px; }
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.left ? 'left: 20px;' : 'right: 20px;'}
  
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: white;
  font-size: 20px;

  &:hover {
    background: rgba(255, 255, 255, 0.4);
    transform: translateY(-50%) scale(1.1);
  }
`;

const zoomIn = keyframes`
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const AnimatedImage = styled.img`
  max-width: 90vw;
  max-height: 80vh;
  border-radius: 8px;
  animation: ${zoomIn} 0.6s ease-out;
`;

// --- 레이아웃 컴포넌트 ---
function StationDetailLayout({
  data,
  onBack,
  handleUpdateDetail,
  handleImageUpdate,
  setCurrentIdx,
  closeModal,
  openModal,
  isModalOpen,
  sortedImages,
  currentIdx,
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
            <ProfileInfo $imageUrl={data.header.imageUrl}>
              <div className="icon"
                onClick={() => openModal(0)} 
                style={{ cursor: 'pointer' }}>
                {!data.header.imageUrl && "🌲"}
              </div>
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
    {isModalOpen && (
      <ModalOverlay onClick={() => closeModal()}>
        <SlideContainer onClick={(e) => e.stopPropagation()}>
          <AnimatedImage 
            key={currentIdx} 
            src={sortedImages[currentIdx].preview} 
            alt="detail" 
          />       
          <ArrowButton left onClick={() => setCurrentIdx((prev) => (prev === 0 ? sortedImages.length - 1 : prev - 1))}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </ArrowButton>

          <ArrowButton onClick={() => setCurrentIdx((prev) => (prev === sortedImages.length - 1 ? 0 : prev + 1))}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 6 15 12 9 18"></polyline>
            </svg>
          </ArrowButton>
        </SlideContainer>
      </ModalOverlay>
    )}
    </PageWrapper>  
  );
}

export default StationDetailLayout;
