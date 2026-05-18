import React from 'react';
import styled from 'styled-components';

export default function Toggle({ checked, onChange }) {
  const isChecked = checked === 'Y';
  return (
    <ToggleWrapper
      onClick={() => onChange(isChecked ? 'N' : 'Y')}
      className={isChecked ? 'active' : ''}
    >
      <Circle className={isChecked ? 'active' : ''} />
      <Icon className={isChecked ? 'active' : ''}>{isChecked ? '✓' : '✕'}</Icon>
    </ToggleWrapper>
  );
}

const ToggleWrapper = styled.div`
  position: relative;
  width: 50px;
  height: 28px;
  background-color: #e0e0e0;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  margin: 0 auto;
  &.active {
    background-color: #2ece17;
  }
`;
const Circle = styled.div`
  position: absolute;
  left: 2px;
  width: 24px;
  height: 24px;
  background-color: white;
  border-radius: 50%;
  transition: left 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  &.active {
    left: 24px;
  }
`;
const Icon = styled.span`
  position: absolute;
  font-size: 11px;
  font-weight: bold;
  user-select: none;
  &.active {
    left: 8px;
    color: white;
  }
  &:not(.active) {
    right: 8px;
    color: #b0b0b0;
  }
`;
