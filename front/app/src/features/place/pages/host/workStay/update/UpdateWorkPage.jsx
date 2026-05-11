import React, { useState } from 'react';
import UpdateFeeComponent from '../../../../components/host/station/update/UpdateFeeComponent';
import UpdateWorkCheckComponent from '../../../../components/host/workStay/update/UpdateWorkCheckComponent';
import UpdateWorkLayout from '../../../../layouts/host/workStay/update/UpdateWorkLayout';
import UpdateWorkStateComponent from '../../../../components/host/workStay/update/UpdateWorkStateComponent';
import UpdateMainComponent from '../../../../components/host/station/update/UpdateMainComponent';
import UpdateWorkOfficeDetailComponent from './../../../../components/host/workStay/update/UpdateWorkOfficeDetailComponent';
import UpdateDetailComponent from '../../../../components/host/station/update/UpdateDetailComponent';

function UpdateWorkPage() {
  const [step, setStep] = useState(1);

  // 1. 워크스테이(숙소) 데이터: 기간별/요일별 요금 포함
  const [workData, setWorkData] = useState({
    placeNo: '',
    title: '',
    content: '',
    maxPeople: '',
    basePeople: '',
    rooms: '',
    checkIn: '',
    checkOut: '',
    chargeAdd: '',
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

  // 2. 오피스 데이터: 요금 관련 필드 제거
  const [officeData, setOfficeData] = useState({
    title: '',
    content: '',
    cnt: '', // 수용인원
    facilities: [], // OFFICE_AMENITY
    images: [],
  });

  const handleWorkChange = (e) => {
    const { name, value } = e.target;
    setWorkData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOfficeChange = (e) => {
    const { name, value } = e.target;
    setOfficeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckChange = (facility) => {
    setWorkData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((item) => item !== facility)
        : [...prev.facilities, facility],
    }));
  };

  const handleWorkCheckChange = (facility) => {
    setOfficeData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((item) => item !== facility)
        : [...prev.facilities, facility],
    }));
  };

  const handleSubmit = () => {
    const finalData = {
      workStay: workData,
      office: officeData, // 오피스는 요금 정보 없이 기본 정보와 이미지만 포함
    };
    console.log('최종 제출 데이터:', finalData);
    alert('검수 신청이 완료되었습니다!');
  };

  const renderStepComponent = () => {
    switch (step) {
      case 1: // 워크스테이 기본 정보 입력
        return (
          <UpdateMainComponent
            formData={workData}
            setFormData={setWorkData}
            handleChange={handleWorkChange}
            setStep={setStep}
            currentStep={step}
          />
        );
      case 2: // 워크스테이 상세 정보 (인원, 방 수, 시설 등)
        return (
          <UpdateDetailComponent
            formData={workData}
            handleChange={handleWorkChange}
            setFormData={setWorkData}
            handleCheckChange={handleCheckChange}
            prev={() => setStep(1)}
            next={() => setStep(3)}
          />
        );
      case 3: // 워크스테이 요금 설정 (숙소 비용은 필요)
        return (
          <UpdateFeeComponent
            formData={workData}
            setFormData={setWorkData}
            handleChange={handleWorkChange}
            prev={() => setStep(2)}
            next={() => setStep(4)}
          />
        );

      case 4: // 오피스 상세 정보 입력 (수용인원 등)
        return (
          <UpdateWorkOfficeDetailComponent
            formData={officeData}
            setFormData={setOfficeData}
            handleChange={handleOfficeChange}
            handleCheckChange={handleWorkCheckChange}
            prev={() => setStep(3)}
            next={() => setStep(5)}
          />
        );
      case 5:
        return (
          <UpdateWorkCheckComponent
            formData={{ ...workData, office: officeData }}
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
