import React from 'react';
import { useParams } from 'react-router-dom'; // URL에서 officeNo를 받기 위해 사용
import UpdateCoworkingFeeComponent from '../../../../components/host/coworking/update/UpdateCoworkingFeeComponent';
import UpdateCoworkingCheckComponent from '../../../../components/host/coworking/update/UpdateCoworkingCheckComponent';
import UpdateStateComponent from '../../../../components/host/station/update/UpdateStateComponent';
import UpdateCoworkingLayout from '../../../../layouts/host/coworking/update/UpdateCoworkingLayout';
import UpdateMainComponent from '../../../../components/host/station/update/UpdateMainComponent';
import UpdateCoworkingDetailComponent from './../../../../components/host/coworking/update/UpdateCoworkingDetailComponent';
import useUpdateCoworking from '../../../../hooks/host/coworking/useUpdateCoworking';

function UpdateCoworkingPage() {
  const { id } = useParams(); // URL 파라미터에서 ID 획득
  const {
    step,
    setStep,
    formData,
    facilityList,
    setFormData,
    handleChange,
    handlePriceChange,
    handleCheckChange,
    handleSubmit,
  } = useUpdateCoworking(id);

  // 데이터가 아직 로드되지 않았을 때의 처리 (초기 로딩 방지)
  if (!formData.title && !formData.placeNo) {
    return <div>데이터를 불러오는 중입니다...</div>;
  }

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
            facilityList={facilityList}
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
            handlePriceChange={handlePriceChange} // 훅에서 넘겨준 핸들러 사용
            prev={() => setStep(2)}
            next={() => setStep(4)}
          />
        );
      case 4:
        return (
          <UpdateCoworkingCheckComponent
            formData={formData}
            facilityList={facilityList}
            prev={() => setStep(3)}
            onSubmit={handleSubmit} // 훅의 handleSubmit 실행
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
