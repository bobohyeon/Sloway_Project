import React, { useState } from 'react';
import InsertSpaceMainComponent from '../../../components/host/insert/InsertSpaceMainComponent';
import InsertSpaceStateComponent from '../../../components/host/insert/InsertSpaceStateComponent';
import InsertSpaceLayout from '../../../layouts/host/insert/InsertSpaceLayout';
import InsertSpaceImageComponent from '../../../components/host/insert/InsertSpaceImageComponent';
import InsertSpaceCheckComponent from '../../../components/host/insert/InsertSpaceCheckComponent';

function InsertSpacePage() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    title: '',
    address: '',
    detailAddress: '',
    content: '',
    latitude: null,
    longitude: null,
    exceptionPeriods: [],
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
          <InsertSpaceMainComponent
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            setStep={setStep}
            currentStep={step}
          />
        );
      case 2:
        return (
          <InsertSpaceImageComponent
            formData={formData}
            setFormData={setFormData}
            prev={() => setStep(1)}
            next={() => setStep(3)}
          />
        );
      case 3:
        return (
          <InsertSpaceCheckComponent
            formData={formData}
            prev={() => setStep(2)}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <InsertSpaceLayout
      stateSection={<InsertSpaceStateComponent currentStep={step} />}
      currentStepSection={renderStepComponent()}
    />
  );
}

export default InsertSpacePage;
