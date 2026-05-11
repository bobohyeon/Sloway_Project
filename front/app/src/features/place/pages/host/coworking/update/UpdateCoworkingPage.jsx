import React, { useState } from 'react';
import UpdateCoworkingFeeComponent from '../../../../components/host/coworking/update/UpdateCoworkingFeeComponent';
import UpdateCoworkingCheckComponent from '../../../../components/host/coworking/update/UpdateCoworkingCheckComponent';
import UpdateStateComponent from '../../../../components/host/station/update/UpdateStateComponent';
import UpdateCoworkingLayout from '../../../../layouts/host/coworking/update/UpdateCoworkingLayout';
import UpdateMainComponent from '../../../../components/host/station/update/UpdateMainComponent';
import UpdateCoworkingDetailComponent from './../../../../components/host/coworking/update/UpdateCoworkingDetailComponent';

function UpdateCoworkingPage() {
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
          <UpdateMainComponent
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            setStep={setStep}
            currentStep={step}
          />
        );
      case 2:
        return (
          <UpdateCoworkingDetailComponent
            formData={formData}
            handleChange={handleChange}
            handleCheckChange={handleCheckChange}
            prev={() => setStep(1)}
            next={() => setStep(3)}
          />
        );
      case 3:
        return (
          <UpdateCoworkingFeeComponent
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            prev={() => setStep(2)}
            next={() => setStep(4)}
          />
        );
      case 4:
        return (
          <UpdateCoworkingCheckComponent
            formData={formData}
            prev={() => setStep(3)}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <UpdateCoworkingLayout
      stateSection={<UpdateStateComponent currentStep={step} />}
      currentStepSection={renderStepComponent()}
    />
  );
}

export default UpdateCoworkingPage;
