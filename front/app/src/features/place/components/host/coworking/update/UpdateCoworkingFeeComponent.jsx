import React from 'react';
import styled from 'styled-components';

// --- Styled Components (기존 유지 및 추가) ---

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
  display: flex;
  align-items: center;
  gap: 10px;
  &:before {
    content: '💰';
  }
`;

const SubTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #555;
  margin: 25px 0 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-left: 4px solid #768966;
  padding-left: 10px;
`;

const ExceptionBox = styled.div`
  background-color: #fcfcf9;
  border: 1px solid #f0f0e0;
  padding: 25px;
  border-radius: 12px;
  margin-bottom: 30px;
  position: relative;
`;

const DateInputRow = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;

  input[type='date'] {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
  }
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 10px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TimePriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #eee;

  .time-label {
    flex: 1;
    font-size: 12px;
    font-weight: 700;
    color: #768966;
  }
`;

const PriceInputWrapper = styled.div`
  position: relative;
  flex: 2;
  display: flex;
  align-items: center;
  input {
    width: 100%;
    padding: 6px 25px 6px 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 12px;
    text-align: right;
  }
  span.unit {
    position: absolute;
    right: 8px;
    font-size: 11px;
    color: #aaa;
  }
`;

const AddButton = styled.button`
  width: 100%;
  padding: 15px;
  background: #f1f4ee;
  color: #768966;
  border: 1px dashed #768966;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 40px;
  &:hover {
    background: #e8ede3;
  }
`;

const RemoveButton = styled.button`
  padding: 8px 12px;
  background: #fff0f0;
  color: #d46a4f;
  border: 1px solid #ffdada;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  &:hover {
    background: #d46a4f;
    color: white;
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

// --- Main Component ---

function UpdateCoworkingFeeComponent({ formData, setFormData, prev, next }) {
  const dayList = [
    { key: '1', label: '월요일' },
    { key: '2', label: '화요일' },
    { key: '3', label: '수요일' },
    { key: '4', label: '목요일' },
    { key: '5', label: '금요일' },
    { key: '6', label: '토요일' },
    { key: '7', label: '일요일' },
    { key: '8', label: '공휴일' },
  ];

  const hourList = Array.from(
    { length: 24 },
    (_, i) => `${String(i).padStart(2, '0')}:00`
  );

  // 1. 평상시 요금 변경 핸들러
  const handleBasePriceChange = (dayKey, hour, value) => {
    if (value !== '' && !/^\d+$/.test(value)) return;
    setFormData((prev) => ({
      ...prev,
      officePeriods: {
        ...prev.officePeriods,
        [dayKey]: { ...(prev.officePeriods?.[dayKey] || {}), [hour]: value },
      },
    }));
  };

  // 2. 예외 기간(성수기) 추가
  const addException = () => {
    const newException = {
      startDate: '',
      endDate: '',
      hottimeYn: 'Y',
      prices: {},
    };
    setFormData((prev) => ({
      ...prev,
      exceptionPeriods: [...(prev.exceptionPeriods || []), newException],
    }));
  };

  // 3. 예외 기간 데이터 변경
  const handleExceptionChange = (
    index,
    field,
    value,
    dayKey = null,
    hour = null
  ) => {
    const updated = [...formData.exceptionPeriods];
    if (dayKey && hour) {
      if (!updated[index].prices[dayKey]) updated[index].prices[dayKey] = {};
      updated[index].prices[dayKey][hour] = value;
    } else {
      updated[index][field] = value;
    }
    setFormData((prev) => ({ ...prev, exceptionPeriods: updated }));
  };

  const removeException = (index) => {
    const updated = formData.exceptionPeriods.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, exceptionPeriods: updated }));
  };

  return (
    <FormCard>
      <SectionTitle>요금 및 운영 시간 설정</SectionTitle>

      <SubTitle>평상시 시간당 요금</SubTitle>
      <div style={{ marginBottom: '50px' }}>
        {dayList.map((day) => (
          <div key={day.key} style={{ marginBottom: '25px' }}>
            <div
              style={{
                fontSize: '13px',
                fontWeight: '600',
                marginBottom: '10px',
                color: '#888',
              }}
            >
              {day.label}
            </div>
            <InputGrid>
              {hourList.map((hour) => (
                <TimePriceRow key={`${day.key}-${hour}`}>
                  <span className="time-label">{hour} ~</span>
                  <PriceInputWrapper>
                    <input
                      type="text"
                      placeholder="0"
                      value={formData.officePeriods?.[day.key]?.[hour] || ''}
                      onChange={(e) =>
                        handleBasePriceChange(day.key, hour, e.target.value)
                      }
                    />
                    <span className="unit">원</span>
                  </PriceInputWrapper>
                </TimePriceRow>
              ))}
            </InputGrid>
          </div>
        ))}
      </div>

      {/* --- 파트 2: 예외 기간 (성수기) 설정 --- */}
      <SubTitle>예외 기간 설정</SubTitle>
      {formData.exceptionPeriods?.map((exp, idx) => (
        <ExceptionBox key={idx}>
          <DateInputRow>
            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
              기간 {idx + 1}
            </div>
            <input
              type="date"
              value={exp.startDate}
              onChange={(e) =>
                handleExceptionChange(idx, 'startDate', e.target.value)
              }
            />
            <span>~</span>
            <input
              type="date"
              value={exp.endDate}
              onChange={(e) =>
                handleExceptionChange(idx, 'endDate', e.target.value)
              }
            />
            <div style={{ flex: 1 }} />
            <RemoveButton onClick={() => removeException(idx)}>
              삭제
            </RemoveButton>
          </DateInputRow>

          <p style={{ fontSize: '12px', color: '#999', marginBottom: '15px' }}>
            * 이 기간에는 아래 설정한 요금이 우선 적용됩니다.
          </p>

          {dayList.map((day) => (
            <div key={day.key} style={{ marginBottom: '15px' }}>
              <div
                style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}
              >
                {day.label}요일 (성수기 요금)
              </div>
              <InputGrid>
                {hourList.map((hour) => (
                  <TimePriceRow key={`exp-${idx}-${day.key}-${hour}`}>
                    <span className="time-label">{hour} ~</span>
                    <PriceInputWrapper>
                      <input
                        type="text"
                        placeholder="0"
                        value={exp.prices?.[day.key]?.[hour] || ''}
                        onChange={(e) =>
                          handleExceptionChange(
                            idx,
                            'prices',
                            e.target.value,
                            day.key,
                            hour
                          )
                        }
                      />
                      <span className="unit">원</span>
                    </PriceInputWrapper>
                  </TimePriceRow>
                ))}
              </InputGrid>
            </div>
          ))}
        </ExceptionBox>
      ))}

      <AddButton type="button" onClick={addException}>
        + 성수기/이벤트 예외 기간 추가하기
      </AddButton>

      <ButtonGroup>
        <PrevButton type="button" onClick={prev}>
          이전 단계
        </PrevButton>
        <NextButton type="button" onClick={next}>
          다음 등록
        </NextButton>
      </ButtonGroup>
    </FormCard>
  );
}

export default UpdateCoworkingFeeComponent;
