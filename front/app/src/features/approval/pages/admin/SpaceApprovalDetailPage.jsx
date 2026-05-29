import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SpaceApprovalDetailLayout from '../../layouts/admin/SpaceApprovalDetailLayout';
import ImageGrid from '../../components/admin/ImageGrid';
import InfoSection from '../../components/admin/InfoSection';
import styled from 'styled-components';
import ChecklistSection from '../../components/admin/ChecklistSection';
import { useSpaceApproval } from '../../hooks/admin/useSpaceApproval';
import RejectModal from '../../components/admin/RejectModal';

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  min-width: 1200px;
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
  const { type, id } = useParams();
  const { spaceData, loading, reason, setReason, handleApprove, handleReject } =
    useSpaceApproval(type, id);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        <ImageGrid images={spaceData.images} title="공간 이미지" />

        {spaceData.type === 'WORK_STAY' && (
          <ImageGrid images={spaceData.subImages} title="내부 오피스 이미지" />
        )}

        <InfoSection data={spaceData} />
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
            <ActionButton onClick={() => setIsModalOpen(true)}>
              반려
            </ActionButton>

            <RejectModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              reason={reason}
              setReason={setReason}
              onConfirm={() => {
                handleReject(); // 훅의 API 함수 호출
                setIsModalOpen(false);
              }}
            />
            <ActionButton $primary onClick={handleApprove}>
              공간 승인
            </ActionButton>
          </ButtonGroup>
        </FloatingFooter>
      </ContentWrapper>
    </SpaceApprovalDetailLayout>
  );
};

export default SpaceApprovalDetailPage;
