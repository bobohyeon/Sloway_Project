import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerWorkStayInspection } from '../../../api/host/place/placeApi';

export const facilityList = [
  { no: 1, name: '주방' },
  { no: 2, name: '세탁기' },
  { no: 3, name: '건조기' },
  { no: 4, name: 'WiFi' },
  { no: 5, name: '주차' },
  { no: 6, name: '어메니티' },
  { no: 7, name: 'TV' },
  { no: 8, name: '에어컨' },
  { no: 9, name: '난방' },
  { no: 10, name: '금연' },
  { no: 11, name: '반려동물' },
  { no: 12, name: '바베큐' },
];

export default function useInsertWorkStay() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // 1. 워크스테이(숙소) 데이터 상태
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
    holPrice: '',
    exceptionPeriods: [],
    images: [],
  });

  // 2. 오피스 데이터 상태
  const [officeData, setOfficeData] = useState({
    title: '',
    content: '',
    cnt: '',
    facilities: [],
    images: [],
  });

  // 일반 입력 및 체크박스 핸들러들
  const handleWorkChange = (e) => {
    const { name, value } = e.target;
    setWorkData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOfficeChange = (e) => {
    const { name, value } = e.target;
    setOfficeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckChange = (facilityNo) => {
    setWorkData((prev) => {
      const isExist = prev.facilities.some(
        (item) => item.amenityNo === facilityNo
      );
      return {
        ...prev,
        facilities: isExist
          ? prev.facilities.filter((item) => item.amenityNo !== facilityNo)
          : [...prev.facilities, { amenityNo: facilityNo }],
      };
    });
  };

  const handleWorkCheckChange = (facilityNo) => {
    setOfficeData((prev) => {
      const isExist = prev.facilities.some(
        (item) => item.amenityNo === facilityNo
      );
      return {
        ...prev,
        facilities: isExist
          ? prev.facilities.filter((item) => item.amenityNo !== facilityNo)
          : [...prev.facilities, { amenityNo: facilityNo }],
      };
    });
  };

  // 시간/날짜 변환 헬퍼 함수들
  const convertToLocalDateTime = (timeStr) => {
    if (!timeStr) return null;
    if (timeStr.includes('T')) return timeStr;
    const baseDate = '2000-01-01';
    const formattedTime = timeStr.length === 5 ? `${timeStr}:00` : timeStr;
    return `${baseDate}T${formattedTime}`;
  };

  const convertDateToLocalDateTime = (dateStr, isEndDate = false) => {
    if (!dateStr) return null;
    if (dateStr.includes('T')) return dateStr;
    return isEndDate ? `${dateStr}T23:59:59` : `${dateStr}T00:00:00`;
  };

  // --- 🎯 백엔드 6개 파트 맵업(Map-up) 전송 핸들러 ---
  const handleSubmit = async () => {
    try {
      const workImages = Array.isArray(workData.images) ? workData.images : [];
      const officeImages = Array.isArray(officeData.images)
        ? officeData.images
        : [];

      // ----------------------------------------------------
      // [Part 1] @RequestPart("dto") 데이터 정제
      // ----------------------------------------------------
      const {
        images: wImg,
        facilities: wFac,
        exceptionPeriods: wExp,
        ...wDto
      } = workData;
      const formattedDto = {
        ...wDto,
        placeNo: Number(wDto.placeNo),
        maxPeople: Number(wDto.maxPeople) || 0,
        basePeople: Number(wDto.basePeople) || 0,
        rooms: Number(wDto.rooms) || 0,
        chargeAdd: Number(wDto.chargeAdd) || 0,
        checkIn: convertToLocalDateTime(wDto.checkIn),
        checkOut: convertToLocalDateTime(wDto.checkOut),
        facilityList: wFac,
        exceptionPeriods: wExp.map((period) => ({
          ...period,
          startDate: convertDateToLocalDateTime(period.startDate, false),
          endDate: convertDateToLocalDateTime(period.endDate, true),
        })),
        monPrice: Number(wDto.monPrice) || 0,
        tuePrice: Number(wDto.tuePrice) || 0,
        wedPrice: Number(wDto.wedPrice) || 0,
        thuPrice: Number(wDto.thuPrice) || 0,
        friPrice: Number(wDto.friPrice) || 0,
        satPrice: Number(wDto.satPrice) || 0,
        sunPrice: Number(wDto.sunPrice) || 0,
        holPrice: Number(wDto.holPrice) || 0,
      };

      // ----------------------------------------------------
      // [Part 2] @RequestPart("officeDto") 데이터 정제
      // ----------------------------------------------------
      const { images: oImg, facilities: oFac, ...oDto } = officeData;
      const formattedOfficeDto = {
        title: oDto.title,
        content: oDto.content,
        basePeople: Number(oDto.cnt) || 0,
        facilityList: oFac,
      };

      // ----------------------------------------------------
      // [Part 3, 4, 5, 6] 파일 및 정렬 순서 목록 빌드
      // ----------------------------------------------------
      const files = workImages.map((img) => img.file);
      const sortList = workImages.map((_, index) => ({ sort: index + 1 }));

      const officeFiles = officeImages.map((img) => img.file);
      const officeSortList = officeImages.map((_, index) => ({
        sort: index + 1,
      }));

      // ----------------------------------------------------
      // 🔥 FormData로 6개 파트 찢어서 바인딩하기
      // ----------------------------------------------------
      const formDataToSend = new FormData();

      // 1. dto (JSON Blob)
      formDataToSend.append(
        'dto',
        new Blob([JSON.stringify(formattedDto)], { type: 'application/json' })
      );

      // 2. officeDto (JSON Blob)
      formDataToSend.append(
        'officeDto',
        new Blob([JSON.stringify(formattedOfficeDto)], {
          type: 'application/json',
        })
      );

      // 3. files (MultipartFile 목록)
      files.forEach((file) => formDataToSend.append('files', file));

      // 4. officeFiles (MultipartFile 목록)
      officeFiles.forEach((file) => formDataToSend.append('officeFiles', file));

      // 5. sortList (JSON Blob)
      formDataToSend.append(
        'sortList',
        new Blob([JSON.stringify(sortList)], { type: 'application/json' })
      );

      // 6. officeSortList (JSON Blob)
      formDataToSend.append(
        'officeSortList',
        new Blob([JSON.stringify(officeSortList)], { type: 'application/json' })
      );

      const response = await registerWorkStayInspection(formDataToSend);

      if (
        response &&
        (response.status === 201 || response.status === 200 || response.data)
      ) {
        alert('워크스테이 패키지 검수 신청이 완료되었습니다!');
        navigate('/host/space/list');
      }
    } catch (error) {
      console.error('워크스테이 패키지 등록 실패:', error);
      alert('등록 중 오류가 발생했습니다. 입력 정보를 확인해주세요.');
    }
  };

  return {
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
  };
}
