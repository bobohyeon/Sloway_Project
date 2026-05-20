import React, { useState } from 'react';
import InsertSpaceMainComponent from '../../../components/host/insert/InsertSpaceMainComponent';
import InsertSpaceStateComponent from '../../../components/host/insert/InsertSpaceStateComponent';
import InsertSpaceLayout from '../../../layouts/host/insert/InsertSpaceLayout';
import InsertSpaceImageComponent from '../../../components/host/insert/InsertSpaceImageComponent';
import InsertSpaceCheckComponent from '../../../components/host/insert/InsertSpaceCheckComponent';
import { useNavigate } from 'react-router-dom';
import useInsertSpace from '../../../hooks/host/place/useInsertSpace';

function InsertSpacePage() {
  const {
    TYPE_MAPPING,
    step,
    setStep,
    formData,
    setFormData,
    handleChange,
    handleSubmit,
  } = useInsertSpace();

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
            handleSubmit={handleSubmit}
            TYPE_MAPPING={TYPE_MAPPING}
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
