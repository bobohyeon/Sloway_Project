import React from 'react';
import styled from 'styled-components';
import { FaEdit, FaRegBuilding } from 'react-icons/fa';

const FormCard = styled.div`
  background: white;
  border-radius: 15px;
  border: 1px solid #e0e0e0;
  padding: 40px;
  width: 100%;
  box-sizing: border-box;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
  color: #333;
`;

const FormGroup = styled.div`
  margin-bottom: 25px;
  label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 10px;
    color: #555;
    span {
      color: #d46a4f;
      margin-left: 4px;
    }
  }
  input,
  textarea,
  select {
    width: 100%;
    padding: 14px 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 15px;
    box-sizing: border-box;
    transition: border-color 0.2s;
    &:focus {
      outline: none;
      border-color: #768966;
    }
    &:disabled {
      background-color: #f9f9f9;
      cursor: not-allowed;
    }
  }
  textarea {
    resize: none;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 18px;
  background-color: #768966;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 20px;
  transition: background 0.2s;
  &:hover {
    background-color: #627254;
  }
`;

function UpdateMainComponent({
  formData,
  setFormData,
  handleChange,
  setStep,
  currentStep,
  // 실제 DB에서 불러온 내 공간 리스트 (PLACE 테이블)
  masterPlaces = [],
  // 수정 모드 여부 (이미 등록된 것을 수정할 때는 공간 변경을 못하게 막을 수도 있음)
  isEditMode = true,
}) {
  // 공간 선택 시 No와 Title을 동시에 저장하는 커스텀 핸들러
  const handlePlaceSelect = (e) => {
    const selectedNo = e.target.value;
    const selectedOption = e.target.options[e.target.selectedIndex];
    const selectedTitle = selectedOption.text;

    setFormData((prev) => ({
      ...prev,
      placeNo: selectedNo,
      placeTitle: selectedTitle,
    }));
  };

  return (
    <FormCard>
      <SectionTitle>
        <FaEdit color="#768966" />
        정보 수정
      </SectionTitle>

      {/* 1. 소속 공간 선택 (수정 시에는 보통 고정) */}
      <FormGroup>
        <label>
          소속된 메인 공간<span>*</span>
        </label>
        <select
          name="placeNo"
          value={formData.placeNo || ''}
          onChange={handlePlaceSelect}
          disabled={isEditMode} // 수정 시 공간 자체를 옮기는 것은 위험하므로 막아두는 편입니다.
        >
          <option value="" disabled>
            공간을 선택하세요
          </option>
          {masterPlaces.map((place) => (
            <option key={place.no} value={place.no}>
              {place.title}
            </option>
          ))}
        </select>
        {isEditMode && (
          <p style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
            * 소속 공간은 변경할 수 없습니다.
          </p>
        )}
      </FormGroup>

      <FormGroup>
        <label>
          명칭<span>*</span>
        </label>
        <input
          name="title"
          value={formData.title || ''}
          placeholder="이름을 입력하세요 (예: 101호, 집중업무석 A 등)"
          onChange={handleChange}
        />
      </FormGroup>

      {/* 3. 유닛 상세 설명 (CONTENT) */}
      <FormGroup>
        <label>
          상세 설명<span>*</span>
        </label>
        <textarea
          name="content"
          rows="6"
          value={formData.content || ''}
          placeholder="이용객에게 보여줄 상세한 설명을 입력해 주세요."
          onChange={handleChange}
        />
      </FormGroup>

      <SubmitButton onClick={() => setStep(currentStep + 1)}>
        다음 단계 (상세 설정)
      </SubmitButton>
    </FormCard>
  );
}

export default UpdateMainComponent;
