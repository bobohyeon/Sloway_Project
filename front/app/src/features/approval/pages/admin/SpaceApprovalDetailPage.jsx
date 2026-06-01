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

const CHECKLIST_DATA = [
  {
    id: 'info',
    label: '기본 정보 확인',
    desc: '공간명, 주소, 소개글이 적절한지',
  },
  {
    id: 'image',
    label: '이미지 검수',
    desc: '실제 공간과 맞고, 선명하며, 부적절한 이미지가 없는지',
  },
  {
    id: 'price',
    label: '가격 적정성',
    desc: '유사 공간 대비 과도한 가격이 아닌지',
  },
  {
    id: 'amenity',
    label: '편의시설 확인',
    desc: '표기된 시설이 실제 준비되었는지 (사진 대조)',
  },
  {
    id: 'policy',
    label: '운영 정책 확인',
    desc: '환불 정책, 체크인 시간 등이 명확한지',
  },
  {
    id: 'legal',
    label: '법적 요건 확인',
    desc: '숙박업의 경우 신고증, 허가증 확인',
  },
];

const SpaceApprovalDetailPage = () => {
  const totalCount = CHECKLIST_DATA.length;
  const { type, id } = useParams();
  const { spaceData, loading, reason, setReason, handleApprove, handleReject } =
    useSpaceApproval(type, id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const checkedCount = Object.values(checkedItems).filter(
    (item) => item === true
  ).length;

  // 2. 모든 항목이 체크되었는지 확인
  const isAllChecked = checkedCount === totalCount;

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
        <ChecklistSection
          checkedItems={checkedItems}
          setCheckedItems={setCheckedItems}
          totalCount={totalCount}
          CHECKLIST_DATA={CHECKLIST_DATA}
        />

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
            <ActionButton
              $primary
              onClick={handleApprove}
              disabled={!isAllChecked}
              style={{
                opacity: !isAllChecked ? 0.5 : 1,
                cursor: !isAllChecked ? 'not-allowed' : 'pointer',
              }}
            >
              {' '}
              공간 승인
            </ActionButton>
          </ButtonGroup>
        </FloatingFooter>
      </ContentWrapper>
    </SpaceApprovalDetailLayout>
  );
};

export default SpaceApprovalDetailPage;
