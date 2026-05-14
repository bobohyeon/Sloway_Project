import React, { useState } from 'react';
import InsertMainComponent from './../../../../components/host/station/insert/InsertMainComponent';
import InsertDetailComponent from './../../../../components/host/station/insert/InsertDetailComponent';
import InsertFeeComponent from './../../../../components/host/station/insert/InsertFeeComponent';
import InsertImageComponent from './../../../../components/host/station/insert/InsertImageComponent';
import InsertCheckComponent from './../../../../components/host/station/insert/InsertCheckComponent';
import InsertStationLayout from '../../../../layouts/host/station/insert/InsertStationLayout';
import InsertStateComponent from './../../../../components/host/station/insert/InsertStateComponent';

function InsertStationPage() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    // 1단계: 마스터 공간 선택 및 기본 정보
    placeNo: '',
    placeTitle: '',
    title: '',
    content: '',

    // 2단계: 공간 상세
    maxPeople: '',
    basePeople: '',
    rooms: '',
    checkIn: '',
    checkOut: '',
    facilities: [],

    // 3단계: 요금
    monPrice: '',
    tuePrice: '',
    wedPrice: '',
    thuPrice: '',
    friPrice: '',
    satPrice: '',
    sunPrice: '',
    holPrice: '',
    exceptionPeriods: [],

    // 4단계: 이미지
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

  const handleSubmit = () => {
    console.log('최종 제출 데이터:', formData);
    alert('검수 신청이 완료되었습니다!');
  };

  // 현재 단계에 맞는 컴포넌트를 반환하는 함수
  const renderStepComponent = () => {
    switch (step) {
      case 1:
        return (
          <InsertMainComponent
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            setStep={setStep}
            currentStep={step}
          />
        );
      case 2:
        return (
          <InsertDetailComponent
            formData={formData}
            handleChange={handleChange}
            handleCheckChange={handleCheckChange}
            prev={() => setStep(1)}
            next={() => setStep(3)}
          />
        );
      case 3:
        return (
          <InsertFeeComponent
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            prev={() => setStep(2)}
            next={() => setStep(4)}
          />
        );
      case 4:
        return (
          <InsertImageComponent
            formData={formData}
            setFormData={setFormData}
            prev={() => setStep(3)}
            next={() => setStep(5)}
          />
        );
      case 5:
        return (
          <InsertCheckComponent
            formData={formData}
            prev={() => setStep(4)}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <InsertStationLayout
      stateSection={<InsertStateComponent currentStep={step} />}
      currentStepSection={renderStepComponent()}
    />
  );
}

export default InsertStationPage;
