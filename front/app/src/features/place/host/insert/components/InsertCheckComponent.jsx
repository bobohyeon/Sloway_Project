import React, { useState } from "react";
import styled from "styled-components";

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
    background: #eee;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
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
  background-color: ${(props) => (props.disabled ? "#ccc" : "#768966")};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background 0.2s;
`;

function InsertCheckComponent({ formData, prev, onSubmit }) {
  const [agreed, setAgreed] = useState({
    info: false,
    terms: false,
  });

  const isAllAgreed = agreed.info && agreed.terms;

  return (
    <FormCard>
      <SectionTitle>공개 설정 및 등록</SectionTitle>

      <SummaryBox>
        <h3 style={{ fontSize: "15px", marginBottom: "20px" }}>
          등록 내용 요약
        </h3>

        <SummaryItem>
          <div className="label">공간 유형</div>
          <div className="tag">🏠 숙소</div>
        </SummaryItem>

        <SummaryItem>
          <div className="label">공간명</div>
          <div className="value">{formData.title || "(입력한 이름)"}</div>
        </SummaryItem>

        <SummaryItem>
          <div className="label">주소</div>
          <div className="value">{formData.address || "(입력한 주소)"}</div>
        </SummaryItem>

        <SummaryItem>
          <div className="label">편의시설</div>
          <div className="value">
            {formData.facilities.length > 0
              ? formData.facilities.join(", ")
              : "(선택한 편의시설 없음)"}
          </div>
        </SummaryItem>

        <SummaryItem>
          <div className="label">대표 요금</div>
          <div className="value">
            {formData.basePrice
              ? `${Number(formData.basePrice).toLocaleString()}원`
              : "(입력한 요금)"}
          </div>
        </SummaryItem>
      </SummaryBox>

      <AgreementSection>
        <label>
          <input
            type="checkbox"
            checked={agreed.info}
            onChange={() =>
              setAgreed((prev) => ({ ...prev, info: !prev.info }))
            }
          />
          <span>*</span> 등록한 내용이 실제 운영 상황과 일치합니다
        </label>
        <label>
          <input
            type="checkbox"
            checked={agreed.terms}
            onChange={() =>
              setAgreed((prev) => ({ ...prev, terms: !prev.terms }))
            }
          />
          <span>*</span> 호스트 이용약관 및 운영 정책에 동의합니다
        </label>
      </AgreementSection>

      <InfoBanner>
        <div className="icon">⏱️</div>
        <div className="text">
          <h4>관리자 검수 후 공개됩니다</h4>
          <p>
            등록 신청 후 영업일 기준 1~3일 내 검수 결과를 알림으로 안내드립니다.
            승인 후 자동으로 공개되며, 이후 자유롭게 수정하실 수 있어요.
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

export default InsertCheckComponent;
