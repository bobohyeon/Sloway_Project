import React from 'react';
import styled from 'styled-components';

const Stepper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 15px 30px;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
`;

// active 대신 $active를 사용하여 DOM으로 전달되는 것을 방지합니다.
const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${(props) => (props.$active ? '#bccab0' : '#eee')};
  font-weight: ${(props) => (props.$active ? '600' : '400')};
  font-size: 14px;

  span {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: ${(props) => (props.$active ? '#bccab0' : '#eee')};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }
`;

const StepLine = styled.div`
  flex: 1;
  height: 1px;
  background-color: #eee;
  margin: 0 15px;
`;

function InsertSpaceStateComponent({ currentStep }) {
  return (
    <Stepper>
      {/* props 전달 시 $를 붙여 전달합니다. */}
      <Step $active={currentStep === 1}>
        <span>1</span> 정보
      </Step>
      <StepLine />
      <Step $active={currentStep === 2}>
        <span>2</span> 이미지
      </Step>
      <StepLine />
      <Step $active={currentStep === 3}>
        <span>3</span> 공개 설정
      </Step>
    </Stepper>
  );
}

export default InsertSpaceStateComponent;
