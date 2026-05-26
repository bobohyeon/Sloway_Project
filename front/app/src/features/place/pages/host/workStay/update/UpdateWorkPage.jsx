import React from 'react';
import { useParams } from 'react-router-dom';
import UpdateWorkLayout from '../../../../layouts/host/workStay/update/UpdateWorkLayout';
import UpdateWorkStateComponent from '../../../../components/host/workStay/update/UpdateWorkStateComponent';
import UpdateMainComponent from '../../../../components/host/station/update/UpdateMainComponent';
import UpdateDetailComponent from '../../../../components/host/station/update/UpdateDetailComponent';
import UpdateFeeComponent from '../../../../components/host/station/update/UpdateFeeComponent';
import UpdateWorkOfficeDetailComponent from '../../../../components/host/workStay/update/UpdateWorkOfficeDetailComponent';
import UpdateWorkCheckComponent from '../../../../components/host/workStay/update/UpdateWorkCheckComponent';
import { useUpdateWorkStay } from '../../../../hooks/host/workStay/useUpdateWorkStay';

// 방금 만든 커스텀 훅 가져오기

function UpdateWorkPage() {
  const { id } = useParams();

  const {
    step,
    setStep,
    formData,
    setFormData,
    isLoading,
    handleChange,
    handleOfficeChange,
    handleCheckChange,
    handleOfficeCheckChange,
    handleSubmit,
  } = useUpdateWorkStay(id);

  if (isLoading) {
    return <div>워크앤스테이 상세 정보를 불러오는 중입니다...</div>;
  }

  // 렌더링 단계 제어 함수
  const renderStepComponent = () => {
    switch (step) {
      case 1: // 1단계: 워크스테이 기본 정보
        return (
          <UpdateMainComponent
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            setStep={setStep}
            currentStep={step}
          />
        );
      case 2: // 2단계: 워크스테이 상세 정보 및 편의시설 목록
        return (
          <UpdateDetailComponent
            formData={formData}
            handleChange={handleChange}
            setFormData={setFormData}
            handleCheckChange={handleCheckChange} // 워크스테이용 체크
            prev={() => setStep(1)}
            next={() => setStep(3)}
          />
        );
      case 3: // 3단계: 워크스테이 요금 및 예외기간 요금 설정
        return (
          <UpdateFeeComponent
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            prev={() => setStep(2)}
            next={() => setStep(4)}
          />
        );
      case 4: // 4단계: 1:1 연관 오피스 정보 및 오피스 전용 편의시설 ID 리스트
        return (
          <UpdateWorkOfficeDetailComponent
            formData={formData.office} // 오피스 단건 객체 전달
            handleChange={handleOfficeChange} // 오피스 전용 값 변경 핸들러
            handleCheckChange={handleOfficeCheckChange} // 오피스 전용 리스트 체크 핸들러
            prev={() => setStep(3)}
            next={() => setStep(5)}
          />
        );
      case 5: // 5단계: 최종 입력값 확인 및 API 요청 제출
        return (
          <UpdateWorkCheckComponent
            formData={formData} // 전체 통합된 객체 그대로 전송
            prev={() => setStep(4)}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <UpdateWorkLayout
      stateSection={<UpdateWorkStateComponent currentStep={step} />}
      currentStepSection={renderStepComponent()}
    />
  );
}

export default UpdateWorkPage;
