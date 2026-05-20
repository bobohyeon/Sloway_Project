import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerStationInspection } from '../../../api/host/place/placeApi';

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

export default function useInsertStation() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // 1단계: 마스터 공간 선택 및 기본 정보
    placeNo: '',
    placeTitle: '',
    title: '',
    content: '',

    // 2단계: 공간 상세
    maxPeople: '',
    basePeople: '',
    rooms: '',
    checkIn: '',
    checkOut: '',
    facilities: [],

    // 3단계: 요금
    monPrice: '',
    tuePrice: '',
    wedPrice: '',
    thuPrice: '',
    friPrice: '',
    satPrice: '',
    sunPrice: '',
    holPrice: '',
    exceptionPeriods: [], // 내부에 [{ startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', ... }] 구조로 가정

    // 4단계: 이미지
    images: [],
  });

  // 일반 인풋 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 편의시설 체크박스 배열 가공 핸들러
  const handleCheckChange = (facilityNo) => {
    setFormData((prev) => {
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

  // 체크인/체크아웃용 ("HH:mm" -> "기준날짜THH:mm:ss")
  const convertToLocalDateTime = (timeStr) => {
    if (!timeStr) return null;
    if (timeStr.includes('T')) return timeStr;

    const baseDate = '2000-01-01';
    const formattedTime = timeStr.length === 5 ? `${timeStr}:00` : timeStr;

    return `${baseDate}T${formattedTime}`;
  };

  // 💡 [추가] 예외 기간 날짜용 ("YYYY-MM-DD" -> "YYYY-MM-DDT00:00:00")
  const convertDateToLocalDateTime = (dateStr, isEndDate = false) => {
    if (!dateStr) return null;
    if (dateStr.includes('T')) return dateStr; // 이미 변환되어 있다면 pass

    // 시작일은 보통 00:00:00, 종료일은 하루의 끝인 23:59:59로 세팅해주면 백엔드 기간 연산 시 안전합니다.
    const timeSuffix = isEndDate ? 'T23:59:59' : 'T00:00:00';
    return `${dateStr}${timeSuffix}`;
  };

  // 최종 폼 제출 (백엔드 Axios API 호출부)
  const handleSubmit = async () => {
    try {
      // 1. 상태 분리 (exceptionPeriods도 구조분해로 따로 분리)
      const { images, facilities, exceptionPeriods, ...dto } = formData;

      // 2. 백엔드 DTO 규격에 맞추어 완벽 가공
      const formattedDto = {
        ...dto,
        checkIn: convertToLocalDateTime(dto.checkIn),
        checkOut: convertToLocalDateTime(dto.checkOut),

        facilityList: facilities,

        // 🛠️ [핵심 수정] exceptionPeriods 배열을 순회하며 startDate, endDate를 LocalDateTime 형태로 변환
        exceptionPeriods: exceptionPeriods.map((period) => ({
          ...period,
          startDate: convertDateToLocalDateTime(period.startDate, false),
          endDate: convertDateToLocalDateTime(period.endDate, true),
        })),

        // 가격 정보 형변환
        monPrice: Number(dto.monPrice) || 0,
        tuePrice: Number(dto.tuePrice) || 0,
        wedPrice: Number(dto.wedPrice) || 0,
        thuPrice: Number(dto.thuPrice) || 0,
        friPrice: Number(dto.friPrice) || 0,
        satPrice: Number(dto.satPrice) || 0,
        sunPrice: Number(dto.sunPrice) || 0,
        holPrice: Number(dto.holPrice) || 0,
      };

      const files = images.map((img) => img.file);
      const sortList = images.map((img) => ({ sort: img.sort + 1 }));

      const response = await registerStationInspection(
        formattedDto,
        files,
        sortList
      );

      if (response.status === 201) {
        alert('검수 신청이 완료되었습니다!');
        navigate('/host/space/list');
      }
    } catch (error) {
      console.error('숙소 등록 실패:', error);
      alert('등록 중 오류가 발생했습니다.');
    }
  };

  return {
    step,
    setStep,
    formData,
    setFormData,
    handleChange,
    handleCheckChange,
    handleSubmit,
  };
}
