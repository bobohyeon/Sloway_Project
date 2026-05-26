import React from 'react';
import styled from 'styled-components';
import { FaHotel } from 'react-icons/fa';
import useFetchMasterPlaces from './../../../../hooks/host/useFetchMasterPlace';

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

function InsertMainComponent({
  formData,
  setFormData, // 부모의 상태를 직접 수정하기 위해 추가
  handleChange,
  setStep,
  currentStep,
}) {
  // 공간 선택 시 No와 Title을 동시에 저장하는 커스텀 핸들러
  const handlePlaceSelect = (e) => {
    const selectedNo = e.target.value;
    // 선택된 option의 텍스트(Title) 가져오기
    const selectedTitle = e.target.options[e.target.selectedIndex].text;
    console.log(selectedNo);

    setFormData((prev) => ({
      ...prev,
      placeNo: selectedNo,
      placeTitle: selectedTitle, // 확인 페이지에서 보여줄 이름 저장
    }));
  };

  const { masterPlaces, isLoading } = useFetchMasterPlaces();

  return (
    <FormCard>
      <SectionTitle>
        <FaHotel />
        기본 정보 (단계: {currentStep})
      </SectionTitle>

      <FormGroup>
        <label>
          공간 선택<span>*</span>
        </label>
        <select
          name="placeNo"
          value={formData.placeNo || ''}
          onChange={handlePlaceSelect} // 커스텀 핸들러 사용
          disabled={isLoading}
        >
          <option value="" disabled>
            {isLoading
              ? '공간 목록을 불러오는 중입니다...'
              : '등록할 숙소가 속한 공간을 선택하세요'}
          </option>
          {!isLoading &&
            masterPlaces.map((place) => (
              <option key={place.no} value={place.placeNo}>
                {place.title}
              </option>
            ))}
        </select>
      </FormGroup>

      <FormGroup>
        <label>
          숙소명<span>*</span>
        </label>
        <input
          name="title"
          value={formData.title}
          placeholder="예: 디럭스 더블룸 / 숲속 독채"
          onChange={handleChange}
        />
      </FormGroup>

      <FormGroup>
        <label>
          숙소 설명<span>*</span>
        </label>
        <textarea
          name="content"
          rows="5"
          value={formData.content}
          placeholder="공간을 소개해 주세요"
          onChange={handleChange}
        />
      </FormGroup>

      <SubmitButton onClick={() => setStep(currentStep + 1)}>
        다음 단계로 이동
      </SubmitButton>
    </FormCard>
  );
}

export default InsertMainComponent;
