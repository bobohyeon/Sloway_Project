import React, { useState } from 'react';
import InsertStateComponent from '../../../../components/host/station/insert/InsertStateComponent';
import InsertCoworkingLayout from '../../../../layouts/host/coworking/insert/InsertCoworkingLayout';
import InsertCoworkingImageComponent from '../../../../components/host/coworking/insert/InsertCoworkingImageComponent';
import InsertCoworkingCheckComponent from '../../../../components/host/coworking/insert/InsertCoworkingCheckComponent';
import InsertFeeComponent from '../../../../components/host/station/insert/InsertFeeComponent';
import InsertDetailComponent from '../../../../components/host/station/insert/InsertDetailComponent';
import InsertMainComponent from '../../../../components/host/station/insert/InsertMainComponent';

function InsertCoworkingPage() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    title: '',
    address: '',
    detailAddress: '',
    content: '',
    latitude: null,
    longitude: null,
    maxPeople: '',
    basePeople: '',
    rooms: '',
    checkIn: '',
    checkOut: '',
    facilities: [],
    monPrice: '',
    tuePrice: '',
    wedPrice: '',
    thuPrice: '',
    friPrice: '',
    satPrice: '',
    sunPrice: '',
    holidayPrice: '',
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
          <InsertCoworkingImageComponent
            formData={formData}
            setFormData={setFormData}
            prev={() => setStep(3)}
            next={() => setStep(5)}
          />
        );
      case 5:
        return (
          <InsertCoworkingCheckComponent
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
    <InsertCoworkingLayout
      stateSection={<InsertStateComponent currentStep={step} />}
      currentStepSection={renderStepComponent()}
    />
  );
}

export default InsertCoworkingPage;
