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

const SubTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #555;
  margin: 25px 0 15px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FormGroup = styled.div`
  label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 6px;
    color: #777;
    span {
      color: #d46a4f;
      margin-left: 2px;
    }
  }
`;

const PriceInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  span.icon {
    position: absolute;
    left: 10px;
    font-size: 12px;
    color: #aaa;
  }

  input {
    width: 100%;
    padding: 10px 10px 10px 25px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 13px;
    box-sizing: border-box;
    color: #333;
    outline: none;

    &:focus {
      border-color: #768966;
      background-color: #fcfcf9;
    }
    &::placeholder {
      color: #eee;
    }
  }
`;

const ExceptionBox = styled.div`
  background-color: #fcfcf9;
  border: 1px solid #f0f0f0;
  padding: 25px;
  border-radius: 12px;
  margin-bottom: 25px;
  position: relative;
`;

const DateGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 20px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  align-items: end;

  input[type='date'] {
    width: 100%;
    padding: 9px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 13px;
  }
`;

const RemoveButton = styled.button`
  background: #ffeded;
  color: #d46a4f;
  border: 1px solid #ffcfcf;
  padding: 9px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 12px;
  transition: all 0.2s;

  &:hover {
    background: #d46a4f;
    color: white;
  }
`;

const AddButton = styled.button`
  background: #f1f4ee;
  color: #768966;
  border: 1px solid #e8ede3;
  padding: 15px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;
  transition: all 0.2s;

  &:hover {
    background: #768966;
    color: white;
  }
`;

const RefundSection = styled.div`
  margin-top: 40px;
  label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 15px;
  }
`;

const RefundGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
`;

const RefundItem = styled.div`
  background-color: #fcfcf9;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  font-size: 12px;
  color: #666;
  border: 1px solid #f0f0f0;

  .percent {
    display: block;
    margin-top: 5px;
    font-weight: 700;
    color: ${(props) => (props.highlight ? '#d46a4f' : '#666')};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 50px;
`;

const PrevButton = styled.button`
  flex: 1;
  padding: 18px;
  background: #f1f1f1;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  color: #555;
`;

const NextButton = styled.button`
  flex: 5;
  padding: 18px;
  background-color: #768966;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
`;
function UpdateFeeComponent({
  formData,
  setFormData,
  handleChange,
  prev,
  next,
}) {
  const dayList = [
    { key: 'monPrice', label: '월' },
    { key: 'tuePrice', label: '화' },
    { key: 'wedPrice', label: '수' },
    { key: 'thuPrice', label: '목' },
    { key: 'friPrice', label: '금' },
    { key: 'satPrice', label: '토' },
    { key: 'sunPrice', label: '일' },
    { key: 'holPrice', label: '공휴일' },
  ];

  // 1. 추가 함수: 항상 가장 최신의 이전 상태(prev)를 기반으로 배열을 추가합니다.
  const addException = () => {
    setFormData((prev) => {
      const currentPeriods = prev?.exceptionPeriods || [];
      console.log(currentPeriods);

      return {
        ...prev,
        exceptionPeriods: [
          ...currentPeriods,
          {
            startDate: '',
            endDate: '',
            monPrice: '',
            tuePrice: '',
            wedPrice: '',
            thuPrice: '',
            friPrice: '',
            satPrice: '',
            sunPrice: '',
            holPrice: '',
          },
        ],
      };
    });
  };

  // 2. 삭제 함수: 마찬가지로 최신 상태(prev)에서 필터링하여 지웁니다.
  const removeException = (index) => {
    setFormData((prev) => {
      const currentPeriods = prev?.exceptionPeriods || [];
      const updated = currentPeriods.filter((_, i) => i !== index);
      return { ...prev, exceptionPeriods: updated };
    });
  };

  // 3. 값 변경 함수: 배열을 직접 수정하지 않고, map을 써서 불변성을 유지하며 값을 바꿉니다. (리액트 정석)
  const handleExceptionChange = (index, field, value) => {
    setFormData((prev) => {
      const currentPeriods = prev?.exceptionPeriods || [];
      const updated = currentPeriods.map((item, i) => {
        if (i === index) {
          return { ...item, [field]: value };
        }
        return item;
      });
      return { ...prev, exceptionPeriods: updated };
    });
  };

  return (
    <FormCard>
      <SectionTitle>요금 및 운영 설정</SectionTitle>

      <SubTitle>📅 평상시 요일별 요금 설정</SubTitle>
      <InputGrid>
        {dayList.map((day) => (
          <FormGroup key={day.key}>
            <label>
              {day.label === '공휴일' ? day.label : `${day.label}요일`} 요금
            </label>
            <PriceInputWrapper>
              <span className="icon">₩</span>
              <input
                type="text"
                name={day.key}
                placeholder="150,000"
                value={formData?.[day.key] ?? ''}
                onChange={handleChange}
              />
            </PriceInputWrapper>
          </FormGroup>
        ))}
      </InputGrid>

      <div
        style={{
          marginTop: '50px',
          borderTop: '1px dashed #ddd',
          paddingTop: '30px',
        }}
      >
        <SubTitle>🔥 특정 기간 예외 요금</SubTitle>
        {(formData?.exceptionPeriods || []).map((item, index) => (
          <ExceptionBox key={index}>
            <DateGrid>
              <FormGroup>
                <label>시작일</label>
                <input
                  type="date"
                  value={item?.startDate ?? ''}
                  onChange={(e) =>
                    handleExceptionChange(index, 'startDate', e.target.value)
                  }
                />
              </FormGroup>
              <FormGroup>
                <label>종료일</label>
                <input
                  type="date"
                  value={item?.endDate ?? ''}
                  onChange={(e) =>
                    handleExceptionChange(index, 'endDate', e.target.value)
                  }
                />
              </FormGroup>
              <RemoveButton
                type="button"
                onClick={() => removeException(index)}
              >
                삭제하기
              </RemoveButton>
            </DateGrid>

            <InputGrid>
              {dayList.map((day) => (
                <FormGroup key={`${index}-${day.key}`}>
                  <label>{day.label} 요금</label>
                  <PriceInputWrapper>
                    <span className="icon">₩</span>
                    <input
                      type="text"
                      placeholder="200,000"
                      value={item?.[day.key] ?? ''}
                      onChange={(e) =>
                        handleExceptionChange(index, day.key, e.target.value)
                      }
                    />
                  </PriceInputWrapper>
                </FormGroup>
              ))}
            </InputGrid>
          </ExceptionBox>
        ))}
        <AddButton type="button" onClick={addException}>
          + 새로운 예외 기간 추가하기
        </AddButton>
      </div>

      <ButtonGroup>
        <PrevButton type="button" onClick={prev}>
          이전
        </PrevButton>
        <NextButton type="button" onClick={next}>
          다음
        </NextButton>
      </ButtonGroup>
    </FormCard>
  );
}

export default UpdateFeeComponent;
