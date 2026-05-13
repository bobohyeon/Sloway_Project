import React from 'react';
import styled from 'styled-components';
import PageLayout from '../../../../../../app/layouts/page/PageLayout';

const EditWrapper = styled.div`
  background-color: #f4efe6;
  width: 100%;
  min-height: 100vh;
  padding: 30px 20px; /* 상하 여백 조정 */
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentArea = styled.div`
  width: 100%;
  min-width: 850px;
  margin-bottom: 40px;
  padding: 0 20px;
`;

const BottomButtonGroup = styled.div`
  width: 100%;
  max-width: 1100px;
  padding: 0 20px;
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 50px;
`;

const ActionButton = styled.button`
  height: 56px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  &.cancel {
    background: #eeeeee;
    color: #333;
    width: 180px;
    &:hover {
      background: #e0e0e0;
    }
  }

  &.save {
    background: #768966;
    color: white;
    flex: 1;
    &:hover {
      background: #627254;
    }
  }
`;

function SpaceUpdateLayout({ title, onSave, onCancel, children }) {
  return (
    <EditWrapper>
      <PageLayout
        title={title}
        description={'공간 정보를 정확하게 수정해주세요.'}
        backTo={'/host/space/list'}
        backLabel={'내 공간 목록'}
      >
        <ContentArea>{children}</ContentArea>

        {/* 3. 하단 버튼 영역 */}
        <BottomButtonGroup>
          <ActionButton className="cancel" onClick={onCancel}>
            이전
          </ActionButton>
          <ActionButton className="save" onClick={onSave}>
            정보 수정 완료
          </ActionButton>
        </BottomButtonGroup>
      </PageLayout>
    </EditWrapper>
  );
}

export default SpaceUpdateLayout;
