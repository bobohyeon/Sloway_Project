import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SpaceApprovalDetailLayout from '../../layouts/admin/SpaceApprovalDetailLayout';
import ImageGrid from '../../components/admin/ImageGrid';
import InfoSection from '../../components/admin/InfoSection';
import styled from 'styled-components';
import ChecklistSection from '../../components/admin/ChecklistSection';

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  max-width: 1200px;
  margin: 0 auto;
`;

const FloatingFooter = styled.div`
  background: white;
  padding: 30px 40px;
  border-radius: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
  margin-top: 20px;
  width: 100%;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button`
  padding: 12px 28px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid ${(props) => (props.$primary ? '#a8b89f' : '#ddd')};
  background: ${(props) => (props.$primary ? '#a8b89f' : 'white')};
  color: ${(props) => (props.$primary ? 'white' : '#666')};

  &:hover {
    filter: brightness(0.9);
  }
`;

const SpaceApprovalDetailPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [spaceData, setSpaceData] = useState(null);

  useEffect(() => {
    // API 호출 시뮬레이션
    setTimeout(() => {
      setSpaceData({
        id: id,
        type: 'STATION',
        name: '제주 돌담집 리트릿',
        address: '제주특별자치도 서귀포시 성산읍...',
        hostName: '폴인제주 리조트',
        description: '제주의 전통 돌담 안에서 즐기는 고즈넉한 휴식...',
        basePrice: 220000,
        // 이미지 객체 배열 (sort 포함)
        images: [
          { url: 'https://via.placeholder.com/600x400', sort: 1 },
          { url: 'https://via.placeholder.com/300x200', sort: 2 },
          { url: 'https://via.placeholder.com/300x200', sort: 3 },
          { url: 'https://via.placeholder.com/300x200', sort: 4 },
          { url: 'https://via.placeholder.com/300x200', sort: 5 },
          { url: 'https://via.placeholder.com/300x200', sort: 6 },
          { url: 'https://via.placeholder.com/300x200', sort: 7 },
          { url: 'https://via.placeholder.com/300x200', sort: 8 },
          { url: 'https://via.placeholder.com/300x200', sort: 9 },
          { url: 'https://via.placeholder.com/300x200', sort: 10 },
        ],
        // 워크앤스테이 전용 내부 오피스 이미지
        officeImages: [
          { url: 'https://via.placeholder.com/300x200?text=Office1', sort: 1 },
          { url: 'https://via.placeholder.com/300x200?text=Office2', sort: 2 },
          { url: 'https://via.placeholder.com/300x200?text=Office3', sort: 3 },
          { url: 'https://via.placeholder.com/300x200?text=Office4', sort: 4 },
          { url: 'https://via.placeholder.com/300x200?text=Office5', sort: 5 },
          { url: 'https://via.placeholder.com/300x200?text=Office6', sort: 6 },
          { url: 'https://via.placeholder.com/300x200?text=Office7', sort: 7 },
          { url: 'https://via.placeholder.com/300x200?text=Office8', sort: 8 },
          { url: 'https://via.placeholder.com/300x200?text=Office9', sort: 9 },
          {
            url: 'https://via.placeholder.com/300x200?text=Office10',
            sort: 10,
          },
        ],
        amenities: ['WiFi', '주방', '세탁기', '주차', 'TV', '에어컨'],
        officeAmenities: ['고속인터넷', '모션데스크', '듀얼모니터', '커피머신'],
      });
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading)
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        데이터 로딩 중...
      </div>
    );

  return (
    <SpaceApprovalDetailLayout
      title="공간 검수 상세"
      description={`[${spaceData.id}] 공간 정보를 확인하고 승인 여부를 결정하세요.`}
    >
      <ContentWrapper>
        {/* 메인 공간 이미지 그리드 */}
        <ImageGrid images={spaceData.images} title="공간 이미지" />

        {/* 워크앤스테이인 경우 내부 오피스 이미지 그리드 추가 */}
        {spaceData.type === 'WORK_STAY' && (
          <ImageGrid
            images={spaceData.officeImages}
            title="내부 오피스 이미지"
          />
        )}

        {/* 상세 정보 및 요금/편의시설 섹션 */}
        <InfoSection data={spaceData} />

        {/* 검수 체크리스트 (이전 답변에서 드린 컴포넌트) */}
        <ChecklistSection />

        <FloatingFooter>
          <div>
            <span style={{ color: '#627c54', fontWeight: 'bold' }}>
              검수 대기중
            </span>
            <p style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
              모든 체크리스트 확인 후 승인이 가능합니다.
            </p>
          </div>
          <ButtonGroup>
            <ActionButton>반려</ActionButton>
            <ActionButton
              $primary
              onClick={() => alert('최종 승인 처리되었습니다.')}
            >
              공간 승인
            </ActionButton>
          </ButtonGroup>
        </FloatingFooter>
      </ContentWrapper>
    </SpaceApprovalDetailLayout>
  );
};

export default SpaceApprovalDetailPage;
