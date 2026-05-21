import React, { useState } from 'react';
import InsertWorkMainComponent from '../../../../components/host/workStay/insert/InsertWorkMainComponent';
import InsertDetailComponent from './../../../../components/host/station/insert/InsertDetailComponent';
import InsertFeeComponent from './../../../../components/host/station/insert/InsertFeeComponent';
import InsertWorkOfficeDetailComponent from './../../../../components/host/workStay/insert/InsertWorkOfficeDetailComponent';
import InsertImageComponent from './../../../../components/host/station/insert/InsertImageComponent';
import InsertWorkStateComponent from '../../../../components/host/workStay/insert/InsertWorkStateComponent';
import InsertWorkLayout from '../../../../layouts/host/workStay/insert/InsertWorkLayout';
import InsertWorkCheckComponent from './../../../../components/host/workStay/insert/InsertWorkCheckComponent';
import useInsertWorkStay from '../../../../hooks/host/workStay/useInsertWorkStay';

function InsertWorkPage() {
  const {
    step,
    setStep,
    workData,
    setWorkData,
    officeData,
    setOfficeData,
    handleWorkChange,
    handleOfficeChange,
    handleCheckChange,
    handleWorkCheckChange,
    handleSubmit,
  } = useInsertWorkStay();

  const renderStepComponent = () => {
    switch (step) {
      case 1: // 워크스테이 기본 정보 입력
        return (
          <InsertWorkMainComponent
            formData={workData}
            setFormData={setWorkData}
            handleChange={handleWorkChange}
            setStep={setStep}
            currentStep={step}
          />
        );
      case 2: // 워크스테이 상세 정보 (인원, 방 수, 시설 등)
        return (
          <InsertDetailComponent
            formData={workData}
            handleChange={handleWorkChange}
            setFormData={setWorkData}
            handleCheckChange={handleCheckChange}
            prev={() => setStep(1)}
            next={() => setStep(3)}
          />
        );
      case 3: // 워크스테이 요금 설정
        return (
          <InsertFeeComponent
            formData={workData}
            setFormData={setWorkData}
            handleChange={handleWorkChange}
            prev={() => setStep(2)}
            next={() => setStep(4)}
          />
        );
      case 4: // 워크스테이 이미지 등록
        return (
          <InsertImageComponent
            formData={workData}
            setFormData={setWorkData}
            prev={() => setStep(3)}
            next={() => setStep(5)}
          />
        );
      case 5: // 오피스 상세 정보 입력 (수용인원 등)
        return (
          <InsertWorkOfficeDetailComponent
            formData={officeData}
            setFormData={setOfficeData}
            handleChange={handleOfficeChange}
            handleCheckChange={handleWorkCheckChange}
            prev={() => setStep(4)}
            next={() => setStep(6)}
          />
        );
      case 6: // 오피스 이미지 등록
        return (
          <InsertImageComponent
            formData={officeData}
            setFormData={setOfficeData}
            prev={() => setStep(5)}
            next={() => setStep(7)}
          />
        );
      case 7: // 최종 확인 및 제출
        return (
          <InsertWorkCheckComponent
            formData={{ ...workData, office: officeData }}
            prev={() => setStep(6)}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <InsertWorkLayout
      stateSection={<InsertWorkStateComponent currentStep={step} />}
      currentStepSection={renderStepComponent()}
    />
  );
}

export default InsertWorkPage;
