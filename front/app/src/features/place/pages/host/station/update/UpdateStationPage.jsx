import React, { useState } from 'react';
import UpdateStationLayout from '../../../../layouts/host/station/update/UpdateStationLayout';
import UpdateStateComponent from '../../../../components/host/station/update/UpdateStateComponent';
import UpdateCheckComponent from '../../../../components/host/station/update/UpdateCheckComponent';
import UpdateFeeComponent from '../../../../components/host/station/update/UpdateFeeComponent';
import UpdateDetailComponent from '../../../../components/host/station/update/UpdateDetailComponent';
import UpdateMainComponent from '../../../../components/host/station/update/UpdateMainComponent';

function UpdateStationPage() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    // 1단계: 마스터 공간 선택 및 기본 정보
    placeNo: '',
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
    holidayPrice: '',
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
          <UpdateDetailComponent
            formData={formData}
            handleChange={handleChange}
            handleCheckChange={handleCheckChange}
            prev={() => setStep(1)}
            next={() => setStep(3)}
          />
        );
      case 3:
        return (
          <UpdateFeeComponent
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            prev={() => setStep(2)}
            next={() => setStep(4)}
          />
        );
      case 4:
        return (
          <UpdateCheckComponent
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
    <UpdateStationLayout
      stateSection={<UpdateStateComponent currentStep={step} />}
      currentStepSection={renderStepComponent()}
    />
  );
}

export default UpdateStationPage;
