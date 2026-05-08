import React from 'react';
import { FaLeaf } from 'react-icons/fa';
import styled from 'styled-components';

const FormCard = styled.div`
  background: white;
  border-radius: 15px;
  border: 1px solid #e0e0e0;
  padding: 40px;
  width: 100%;
  box-sizing: border-box;
  height: 100%;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
`;

const FormGroup = styled.div`
  margin-bottom: 25px;
  label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 10px;
    span {
      color: #d46a4f;
      margin-left: 4px;
    }
  }
  input,
  textarea,
  select {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 15px;
    box-sizing: border-box;
    &:focus {
      outline: none;
      border-color: #8fa382;
    }
  }

  /* 셀렉트 박스 화살표 디자인 */
  select {
    cursor: pointer;
    background-color: white;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23666' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: calc(100% - 15px) center;
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
  font-weight: 600;
  cursor: pointer;
  margin-top: 20px;
  &:hover {
    background-color: #627254;
  }
`;

function InsertCoworkingMainComponent({
  formData,
  setFormData, // 이름과 번호를 동시 저장하기 위해 필요
  handleChange,
  setStep,
  currentStep,
  masterPlaces = [
    { no: 10, title: '성수 브릭스 타워' },
    { no: 11, title: '강남 워크플렉스' },
  ],
}) {
  const handlePlaceSelect = (e) => {
    const selectedNo = e.target.value;
    const selectedTitle = e.target.options[e.target.selectedIndex].text;

    setFormData((prev) => ({
      ...prev,
      placeNo: selectedNo,
      placeTitle: selectedTitle,
    }));
  };

  return (
    <FormCard>
      <SectionTitle>
        <FaLeaf />
        오피스 기본 정보 (단계: {currentStep})
      </SectionTitle>

      <FormGroup>
        <label>
          공간 선택<span>*</span>
        </label>
        <select
          name="placeNo"
          value={formData.placeNo || ''}
          onChange={handlePlaceSelect}
        >
          <option value="" disabled>
            오피스가 위치한 공간을 선택하세요
          </option>
          {masterPlaces.map((place) => (
            <option key={place.no} value={place.no}>
              {place.title}
            </option>
          ))}
        </select>
      </FormGroup>

      {/* 2. 상세 오피스명 */}
      <FormGroup>
        <label>
          오피스 구역/명칭<span>*</span>
        </label>
        <input
          name="title"
          value={formData.title}
          placeholder="예: 4층 오픈데스크 A구역 / 프라이빗 룸 402호"
          onChange={handleChange}
        />
      </FormGroup>

      {/* 3. 오피스 설명 */}
      <FormGroup>
        <label>
          공간 설명<span>*</span>
        </label>
        <textarea
          name="content"
          rows="5"
          value={formData.content}
          placeholder="해당 오피스 구역의 특징(집중하기 좋은 환경 등)을 소개해 주세요"
          onChange={handleChange}
        />
      </FormGroup>

      <SubmitButton onClick={() => setStep(currentStep + 1)}>
        다음 단계로 이동
      </SubmitButton>
    </FormCard>
  );
}

export default InsertCoworkingMainComponent;
