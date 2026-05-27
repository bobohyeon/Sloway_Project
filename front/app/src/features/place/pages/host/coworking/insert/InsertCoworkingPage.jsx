import React, { useState } from 'react';
import InsertStateComponent from '../../../../components/host/station/insert/InsertStateComponent';
import InsertCoworkingLayout from '../../../../layouts/host/coworking/insert/InsertCoworkingLayout';
import InsertCoworkingCheckComponent from '../../../../components/host/coworking/insert/InsertCoworkingCheckComponent';
import InsertCoworkingMainComponent from '../../../../components/host/coworking/insert/InsertCoworkingMainComponent';
import InsertCoworkingDetailComponent from './../../../../components/host/coworking/insert/InsertCoworkingDetailComponent';
import InsertCoworkingFeeComponent from './../../../../components/host/coworking/insert/InsertCoworkingFeeComponent';
import InsertImageComponent from '../../../../components/host/station/insert/InsertImageComponent';
import useInsertCoworking from './../../../../hooks/host/coworking/useInsertCoworking';

function InsertCoworkingPage() {
  // 공통 비즈니스 로직 쏙 빼오기
  const {
    step,
    setStep,
    formData,
    facilityList,
    setFormData,
    handleChange,
    handleCheckChange,
    handleSubmit,
  } = useInsertCoworking();

  // 현재 단계에 맞는 컴포넌트를 반환하는 함수
  const renderStepComponent = () => {
    switch (step) {
      case 1:
        return (
          <InsertCoworkingMainComponent
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            setStep={setStep}
            currentStep={step}
          />
        );
      case 2:
        return (
          <InsertCoworkingDetailComponent
            formData={formData}
            facilityList={facilityList}
            handleChange={handleChange}
            handleCheckChange={handleCheckChange}
            prev={() => setStep(1)}
            next={() => setStep(3)}
          />
        );
      case 3:
        return (
          <InsertCoworkingFeeComponent
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
          <InsertCoworkingCheckComponent
            formData={formData}
            facilityList={facilityList}
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
