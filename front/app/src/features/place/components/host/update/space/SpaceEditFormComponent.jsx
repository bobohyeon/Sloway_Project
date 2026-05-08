import React from 'react';
import styled from 'styled-components';

const Section = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #eee;
  padding: 32px;
  margin-bottom: 24px;

  h2 {
    font-size: 18px;
    font-weight: 700;
    color: #333;
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 2px solid #f1f4ee;
  }
`;

const FieldGroup = styled.div`
  margin-bottom: 20px;
  label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #555;
    margin-bottom: 10px;
  }
  input,
  textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    box-sizing: border-box;
    &:focus {
      outline: none;
      border-color: #768966;
    }
  }
  textarea {
    height: 120px;
    resize: none;
  }
`;

const FlexRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

const PriceLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  background: #fcfcf9;
  padding: 24px;
  border-radius: 10px;
`;

const FacilityList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 15px;
`;

const CheckItem = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
  input {
    width: 18px;
    height: 18px;
    accent-color: #768966;
  }
`;

function SpaceEditFormComponent({ formData, handleChange, handleCheckChange }) {
  const commonFacilities = [
    'WiFi',
    '주차 가능',
    '에어컨',
    '냉장고',
    '주방',
    '빔프로젝터',
    '화이트보드',
    '커피머신',
  ];

  return (
    <>
      {/* 기본 정보 섹션 */}
      <Section>
        <h2>기본 공간 정보</h2>
        <FieldGroup>
          <label>공간명</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </FieldGroup>
        <FieldGroup>
          <label>공간 설명</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
          />
        </FieldGroup>
      </Section>
    </>
  );
}

export default SpaceEditFormComponent;
