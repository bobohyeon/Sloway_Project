import React from 'react';
import styled from 'styled-components';

const Stepper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 15px 20px;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  color: ${(props) =>
    props.$active ? '#768966' : props.$completed ? '#333' : '#aaa'};
  font-weight: ${(props) => (props.$active ? '700' : '400')};
  font-size: 13px;
  white-space: nowrap;

  span {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background-color: ${(props) =>
      props.$active ? '#768966' : props.$completed ? '#bccab0' : '#eee'};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    transition: all 0.3s ease;
  }
`;

const StepLine = styled.div`
  flex: 1;
  height: 1px;
  background-color: ${(props) => (props.$completed ? '#bccab0' : '#eee')};
  margin: 0 10px;
  min-width: 8px;
`;

function InsertWorkStateComponent({ currentStep }) {
  const steps = [
    { id: 1, label: '워크스테이 기본' },
    { id: 2, label: '상세 설정' },
    { id: 3, label: '숙소 요금' },
    { id: 4, label: '숙소 이미지' },
    { id: 5, label: '오피스 정보' },
    { id: 6, label: '오피스 이미지' },
    { id: 7, label: '최종 확인' },
  ];

  return (
    <Stepper>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <Step
            $active={currentStep === step.id}
            $completed={currentStep > step.id}
          >
            <span>{step.id}</span> {step.label}
          </Step>
          {index < steps.length - 1 && (
            <StepLine $completed={currentStep > step.id} />
          )}
        </React.Fragment>
      ))}
    </Stepper>
  );
}

export default InsertWorkStateComponent;
