import React, { useState } from 'react';
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

const SummaryBox = styled.div`
  background-color: #fcfcf9;
  border-radius: 12px;
  padding: 30px;
  border: 1px solid #f0f0e0;
  margin-bottom: 30px;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }

  .label {
    color: #888;
    font-size: 14px;
  }
  .value {
    color: #333;
    font-size: 15px;
    font-weight: 500;
    text-align: right;
  }
  .tag {
    background: #768966;
    color: white;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .tag.office {
    background: #bccab0;
    color: #333;
  }
`;

const AgreementSection = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;

  label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #555;
    cursor: pointer;
    input {
      width: 18px;
      height: 18px;
      accent-color: #768966;
    }
    span {
      color: #d46a4f;
      font-weight: bold;
    }
  }
`;

const InfoBanner = styled.div`
  background-color: #fff9f0;
  border: 1px solid #ffedcc;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 30px;
  display: flex;
  gap: 15px;

  .icon {
    font-size: 20px;
  }
  .text {
    h4 {
      margin: 0 0 5px 0;
      font-size: 14px;
      color: #333;
    }
    p {
      margin: 0;
      font-size: 13px;
      color: #777;
      line-height: 1.5;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
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

const SubmitButton = styled.button`
  flex: 5;
  padding: 18px;
  background-color: ${(props) => (props.disabled ? '#ccc' : '#768966')};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: background 0.2s;
`;

function UpdateWorkCheckComponent({
  formData,
  prev,
  onSubmit,
  facilityList,
  officeFacilityList,
}) {
  const [agreed, setAgreed] = useState({
    info: false,
    terms: false,
  });

  const isAllAgreed = agreed.info && agreed.terms;

  return (
    <FormCard>
      <SectionTitle>공개 설정 및 등록 확인</SectionTitle>

      {/* 워크스테이 요약 */}
      <SummaryBox>
        <h3
          style={{ fontSize: '15px', marginBottom: '20px', color: '#768966' }}
        >
          🏠 워크스테이 요약
        </h3>
        <SummaryItem>
          <div className="label">공간</div>
          <div className="value">
            {formData.placeNo
              ? `[No.${formData.stay.placeNo}] ${formData.stay.placeTitle}`
              : '선택 안됨'}
          </div>
        </SummaryItem>

        <SummaryItem>
          <div className="label">워크스테이명</div>
          <div className="value">{formData.stay.title || '(미입력)'}</div>
        </SummaryItem>

        <SummaryItem>
          <div className="label">편의시설</div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {formData.stay.facilities.length > 0 ? (
              formData.stay.facilities.map((f) => {
                const target = facilityList.find((item) => item.no === f);
                return target ? (
                  <span
                    key={f}
                    style={{
                      padding: '4px 10px',
                      background: '#f1f4ee',
                      color: '#768966',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '500',
                    }}
                  >
                    {target.name}
                  </span>
                ) : null;
              })
            ) : (
              <span style={{ color: '#aaa' }}>선택된 편의시설 없음</span>
            )}
          </div>
        </SummaryItem>

        <SummaryItem>
          <div className="label">대표 요금(월)</div>
          <div className="value">
            {formData.monPrice
              ? `${Number(formData.monPrice).toLocaleString()}원`
              : '0원'}
          </div>
        </SummaryItem>
      </SummaryBox>

      {/* 오피스 요약 */}
      <SummaryBox style={{ backgroundColor: '#f9f9f9' }}>
        <h3
          style={{ fontSize: '15px', marginBottom: '20px', color: '#768966' }}
        >
          💻 오피스 정보 (무료 제공)
        </h3>
        <SummaryItem>
          <div className="label">수용 인원</div>
          {/* 💡 2. 오피스 정보 컴포넌트의 변수명 규격인 cnt와 매핑해줍니다 */}
          <div className="value">{formData.office?.cnt || 0}명</div>
        </SummaryItem>

        <SummaryItem>
          <div className="label">편의시설</div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {formData.office.facilities.length > 0 ? (
              formData.office.facilities.map((f) => {
                const target = officeFacilityList.find((item) => item.no === f);
                return target ? (
                  <span
                    key={f}
                    style={{
                      padding: '4px 10px',
                      background: '#f1f4ee',
                      color: '#768966',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '500',
                    }}
                  >
                    {target.name}
                  </span>
                ) : null;
              })
            ) : (
              <span style={{ color: '#aaa' }}>선택된 편의시설 없음</span>
            )}
          </div>
        </SummaryItem>
      </SummaryBox>

      <AgreementSection>
        <label>
          <input
            type="checkbox"
            checked={agreed.info}
            onChange={() => setAgreed((p) => ({ ...p, info: !p.info }))}
          />
          <span>*</span> 정보가 실제와 일치합니다.
        </label>
        <label>
          <input
            type="checkbox"
            checked={agreed.terms}
            onChange={() => setAgreed((p) => ({ ...p, terms: !p.terms }))}
          />
          <span>*</span> 이용약관에 동의합니다.
        </label>
      </AgreementSection>

      <InfoBanner>
        <div className="icon">⏱️</div>
        <div className="text">
          <h4>관리자 검수 프로세스</h4>
          <p>
            평일 기준 1~3일 내에 승인이 완료되며, 승인 즉시 서비스에 노출됩니다.
          </p>
        </div>
      </InfoBanner>

      <ButtonGroup>
        <PrevButton onClick={prev}>이전</PrevButton>
        <SubmitButton disabled={!isAllAgreed} onClick={onSubmit}>
          검수 신청하기
        </SubmitButton>
      </ButtonGroup>
    </FormCard>
  );
}

export default UpdateWorkCheckComponent;
