import React from 'react';
import styled from 'styled-components';

const EditWrapper = styled.div`
  background-color: #f4efe6;
  min-height: 100vh;
  padding: 40px 0 60px 0; /* 상하 여백 조정 */
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/* 헤더: 흰 배경, 테두리, 그림자를 모두 제거하여 '박스' 느낌을 없앴습니다 */
const Header = styled.div`
  width: 100%;
  max-width: 1100px;
  padding: 0 20px;
  margin-bottom: 30px;
  text-align: left;

  h1 {
    font-size: 28px;
    font-weight: 800;
    color: #333;
    margin: 0;
    letter-spacing: -1px;
  }

  p {
    font-size: 16px;
    color: #666;
    margin: 8px 0 0 0;
  }
`;

const ContentArea = styled.div`
  width: 100%;
  max-width: 1100px;
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
      {/* 1. 헤더: 박스 없이 텍스트만 노출 */}
      <Header>
        <h1>{title}</h1>
        <p>공간 정보를 정확하게 수정해주세요.</p>
      </Header>

      {/* 2. 본문 영역 */}
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
    </EditWrapper>
  );
}

export default SpaceUpdateLayout;
