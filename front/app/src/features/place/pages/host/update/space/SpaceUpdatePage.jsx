import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SpaceEditFormComponent from '../../../../components/host/update/space/SpaceEditFormComponent';
import SpaceUpdateLayout from '../../../../layouts/host/update/space/SpaceUpadteLayout';

function SpaceUpdatePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 제공하신 InsertStationPage의 데이터 구조와 100% 동일하게 초기화
  const [formData, setFormData] = useState({
    placeNo: '',
    title: '',
    content: '',
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

  // 데이터 로드 (실제로는 API 연동 부분)
  useEffect(() => {
    // 예시 데이터 로드
    const mockData = {
      placeNo: '45',
      title: '성수동 감성 공간',
      content: '창고형을 개조한 감성적인 공간입니다.',
      maxPeople: '6',
      basePeople: '2',
      rooms: '2',
      checkIn: '14:00',
      checkOut: '11:00',
      facilities: ['WiFi', '주차 가능', '빔프로젝터'],
      monPrice: '120000',
      tuePrice: '120000',
      wedPrice: '120000',
      thuPrice: '120000',
      friPrice: '150000',
      satPrice: '180000',
      sunPrice: '130000',
      holidayPrice: '200000',
      exceptionPeriods: [],
      images: [],
    };
    setFormData(mockData);
  }, [id]);

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

  const handleSaveSubmit = () => {
    console.log('수정 요청 데이터:', formData);
    alert('공간 정보 수정이 완료되었습니다.');
    navigate('/host/space/list');
  };

  return (
    <SpaceUpdateLayout
      title="공간 수정"
      onSave={handleSaveSubmit}
      onCancel={() => navigate(-1)}
    >
      <SpaceEditFormComponent
        formData={formData}
        handleChange={handleChange}
        handleCheckChange={handleCheckChange}
      />
    </SpaceUpdateLayout>
  );
}

export default SpaceUpdatePage;
