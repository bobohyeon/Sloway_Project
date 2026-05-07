import React, { useState } from "react";
import styled from "styled-components";
import InsertMainComponent from "../components/InsertMainComponent";
import InsertDetailComponent from "../components/InsertDetailComponent";
import InsertFeeComponent from "../components/InsertFeeComponent";
import InsertImageComponent from "../components/InsertImageComponent";
import InsertCheckComponent from "../components/InsertCheckComponent";
import InsertStateComponent from "../components/InsertStateComponent";

const PageWrapper = styled.div`
  background-color: #f8f9f6;
  min-height: 100vh;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Container = styled.div`
  width: 100%;
  max-width: 900px;
`;

const Header = styled.header`
  margin-bottom: 30px;
  h1 {
    font-size: 28px;
    color: #333;
    margin-bottom: 8px;
  }
  p {
    color: #888;
    font-size: 14px;
  }
`;

const BackButton = styled.div`
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  &:before {
    content: "← ";
    margin-right: 5px;
  }
`;

function InsertStationPage() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    // Step 1: 기본 정보
    title: "",
    address: "",
    detailAddress: "",
    content: "",
    latitude: null,
    longitude: null,

    // Step 2: 공간 상세
    maxPeople: "",
    basePeople: "",
    rooms: "",
    checkIn: "",
    checkOut: "",
    facilities: [],

    // Step 3: 요금 및 운영 (요일별 및 공휴일 포함)
    monPrice: "",
    tuePrice: "",
    wedPrice: "",
    thuPrice: "",
    friPrice: "",
    satPrice: "",
    sunPrice: "",
    holidayPrice: "",
    // 예외 기간 (각 객체 내부에 요일별 요금 구조 포함)
    exceptionPeriods: [],

    // Step 4: 이미지
    images: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckChange = (facility) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((item) => item !== facility)
        : [...prev.facilities, facility],
    }));
  };

  // 최종 제출 처리
  const handleSubmit = () => {
    console.log("최종 제출 데이터:", formData);
    alert("검수 신청이 완료되었습니다!");
  };

  return (
    <PageWrapper>
      <Container>
        <Header>
          <h1>숙소 등록</h1>
          <p>휴식 중심의 숙박 공간을 등록합니다</p>
        </Header>

        <BackButton onClick={() => window.history.back()}>
          내 공간 목록
        </BackButton>

        <InsertStateComponent currentStep={step} />

        {/* 1단계: 기본 정보 */}
        {step === 1 && (
          <InsertMainComponent
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            setStep={setStep}
            currentStep={step}
          />
        )}

        {/* 2단계: 공간 상세 */}
        {step === 2 && (
          <InsertDetailComponent
            formData={formData}
            handleChange={handleChange}
            handleCheckChange={handleCheckChange}
            prev={() => setStep(1)}
            next={() => setStep(3)}
          />
        )}

        {/* 3단계: 요금 · 운영 (수정된 섹션) */}
        {step === 3 && (
          <InsertFeeComponent
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            prev={() => setStep(2)}
            next={() => setStep(4)}
          />
        )}

        {/* 4단계: 이미지 */}
        {step === 4 && (
          <InsertImageComponent
            formData={formData}
            setFormData={setFormData}
            prev={() => setStep(3)}
            next={() => setStep(5)}
          />
        )}

        {/* 5단계: 공개 설정 및 최종 확인 */}
        {step === 5 && (
          <InsertCheckComponent
            formData={formData}
            prev={() => setStep(4)}
            onSubmit={handleSubmit}
          />
        )}
      </Container>
    </PageWrapper>
  );
}

export default InsertStationPage;
