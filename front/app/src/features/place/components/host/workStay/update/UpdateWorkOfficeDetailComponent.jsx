import React from 'react';
import styled from 'styled-components';

const FormCard = styled.div`
  background: white;
  border-radius: 15px;
  border: 1px solid #e0e0e0;
  padding: 40px;
  width: 100%;
  box-sizing: border-box;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 30px;
  color: #333;
`;

const InputGrid = styled.div`
  display: grid;
  gap: 20px;
  margin-bottom: 25px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
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
  input {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #fff;
    box-sizing: border-box;
  }
`;

const CheckboxGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-top: 10px;
`;

const CheckItem = styled.label`
  display: flex;
  align-items: center;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background-color: #f9f9f9;
  }
  input {
    margin-right: 10px;
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 40px;
`;

const PrevButton = styled.button`
  flex: 1;
  padding: 18px;
  background: #f1f1f1;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
`;

const NextButton = styled.button`
  flex: 5;
  padding: 18px;
  background-color: #768966;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
`;

function UpdateWorkOfficeDetailComponent({
  formData, // 부모가 준 formData.office
  facilityList,
  handleChange, // 부모의 handleOfficeChange
  handleCheckChange, // 부모의 handleOfficeCheckChange
  prev,
  next,
}) {
  return (
    <FormCard>
      <SectionTitle>공간 상세 정보</SectionTitle>

      <InputGrid>
        <FormGroup>
          <label>
            수용 인원 <span>*</span>
          </label>
          <input
            name="cnt"
            placeholder="ex ) 40"
            value={formData?.cnt || ''}
            onChange={handleChange}
          />
        </FormGroup>
      </InputGrid>

      <FormGroup style={{ marginTop: '20px' }}>
        <label>편의시설 (제공 항목을 모두 선택해주세요)</label>
        <CheckboxGrid>
          {facilityList.map((item) => (
            // ✨ [수정 포인트 2] 고유 key값을 고유 ID인 item.no로 변경
            <CheckItem key={item.no}>
              <input
                type="checkbox"
                // ✨ [수정 포인트 3] formData.facilities 배열(숫자 리스트)에 포함되어 있는지 번호로 비교
                checked={formData.facilities.includes(item.no)}
                // ✨ [수정 포인트 4] 핸들러에 텍스트가 아닌 고유 번호(no)를 전달
                onChange={() => handleCheckChange(item.no, item.name)}
              />
              {item.name}
            </CheckItem>
          ))}
        </CheckboxGrid>
      </FormGroup>

      <ButtonGroup>
        <PrevButton onClick={prev}>이전</PrevButton>
        <NextButton onClick={next}>다음</NextButton>
      </ButtonGroup>
    </FormCard>
  );
}

export default UpdateWorkOfficeDetailComponent;
