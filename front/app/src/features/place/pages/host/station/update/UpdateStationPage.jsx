import React from 'react';
import { useParams } from 'react-router-dom'; // URL 등에서 stationNo를 추출한다고 가정

import UpdateStationLayout from '../../../../layouts/host/station/update/UpdateStationLayout';
import UpdateStateComponent from '../../../../components/host/station/update/UpdateStateComponent';
import UpdateCheckComponent from '../../../../components/host/station/update/UpdateCheckComponent';
import UpdateFeeComponent from '../../../../components/host/station/update/UpdateFeeComponent';
import UpdateDetailComponent from '../../../../components/host/station/update/UpdateDetailComponent';
import UpdateMainComponent from '../../../../components/host/station/update/UpdateMainComponent';
import { useUpdateStation } from '../../../../hooks/host/station/useUpdateStation';

function UpdateStationPage() {
  // 예시: 라우터 파라미터에서 stationNo를 가져오는 형태
  const { id } = useParams();

  // 커스텀 훅 호출
  const {
    step,
    setStep,
    formData,
    facilityList,
    setFormData,
    isLoading,
    handleChange,
    handleCheckChange,
    handleSubmit,
  } = useUpdateStation(id);

  if (isLoading) {
    return <div>숙소 상세 정보를 불러오는 중입니다...</div>;
  }

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
            facilityList={facilityList}
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
            facilityList={facilityList}
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
