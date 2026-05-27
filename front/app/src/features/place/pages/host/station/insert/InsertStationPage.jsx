import React, { useState } from 'react';
import InsertMainComponent from './../../../../components/host/station/insert/InsertMainComponent';
import InsertDetailComponent from './../../../../components/host/station/insert/InsertDetailComponent';
import InsertFeeComponent from './../../../../components/host/station/insert/InsertFeeComponent';
import InsertImageComponent from './../../../../components/host/station/insert/InsertImageComponent';
import InsertCheckComponent from './../../../../components/host/station/insert/InsertCheckComponent';
import InsertStationLayout from '../../../../layouts/host/station/insert/InsertStationLayout';
import InsertStateComponent from './../../../../components/host/station/insert/InsertStateComponent';
import useInsertStation from '../../../../hooks/host/station/useInsertStation';

function InsertStationPage() {
  const {
    step,
    setStep,
    formData,
    facilityList,
    setFormData,
    handleChange,
    handleCheckChange,
    handleSubmit,
  } = useInsertStation();

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
            facilityList={facilityList}
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
    <InsertStationLayout
      stateSection={<InsertStateComponent currentStep={step} />}
      currentStepSection={renderStepComponent()}
    />
  );
}

export default InsertStationPage;
