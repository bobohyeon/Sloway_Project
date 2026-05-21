import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerOfficeInspection } from '../../../api/host/place/placeApi';

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

export default function useInsertCoworking() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    // 1단계: 마스터 공간 선택 및 기본 정보
    placeNo: '',
    title: '',
    content: '',

    // 2단계: 상세 정보
    basePeople: '',
    facilities: [],

    // 3단계: 시간별 요금 & 예외 기간 요금
    // 기본 요금 구조: { MON_00: 0, SUN_23: 0 ... }
    hourlyPrices: {},

    // 공휴일 요금 구조: { HOL_00: 0, HOL_01: 0 ... }
    holidayPrices: {},

    // 예외 기간 목록 구조:
    // [{ startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', dayOfWeek: 'mon', startTime: '00', price: 10000 }]
    exceptionPeriods: [],

    // 4단계: 이미지
    images: [],
  });

  // 일반 입력 필드 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 평일/주말 시간별 요금 인풋 핸들러 (name="MON_00", name="SUN_23")
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      hourlyPrices: {
        ...prev.hourlyPrices,
        [name]: Number(value) || 0,
      },
    }));
  };

  // 공휴일 전용 시간별 요금 인풋 핸들러 (name="HOL_00", name="HOL_01")
  const handleHolidayPriceChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      holidayPrices: {
        ...prev.holidayPrices,
        [name]: Number(value) || 0,
      },
    }));
  };

  // 편의시설 체크박스 핸들러
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

  // 날짜 가공 헬퍼: "YYYY-MM-DD" -> "YYYY-MM-DDT00:00:00"
  const convertDateToLocalDateTime = (dateStr, isEndDate = false) => {
    if (!dateStr) return null;
    if (dateStr.includes('T')) return dateStr;
    return isEndDate ? `${dateStr}T23:59:59` : `${dateStr}T00:00:00`;
  };

  // 시간 가공 헬퍼: "00" -> "2000-01-01T00:00:00"
  const convertTimeToLocalDateTime = (hourStr) => {
    const formattedHour = String(hourStr).padStart(2, '0');
    return `2000-01-01T${formattedHour}:00:00`;
  };

  // 🛠️ 요일 문자열 포맷터: "MON" -> "mon", "HOL" -> "hol"로 바로 변환
  const formatDayOfWeek = (dayPrefix) => {
    if (!dayPrefix) return 'mon';
    return dayPrefix.toLowerCase(); // 소문자 3자리 규격화
  };

  // --- 핵심 데이터 가공 및 서버 제출 핸들러 ---
  const handleSubmit = async () => {
    try {
      const currentImages = Array.isArray(formData.images)
        ? formData.images
        : [];
      const {
        images,
        facilities,
        hourlyPrices,
        holidayPrices,
        exceptionPeriods,
        ...dto
      } = formData;

      // 1. 기본 요일별 요금 리스트 생성 (officePeriods)
      const basePeriods = Object.entries(hourlyPrices).map(([key, price]) => {
        const [dayPrefix, hour] = key.split('_');
        return {
          startTime: convertTimeToLocalDateTime(hour),
          price: Number(price) || 0,
          dayOfWeek: formatDayOfWeek(dayPrefix), // 예: "mon", "tue"
        };
      });

      // 2. 공휴일 요일별 요금 리스트 생성 후 officePeriods에 합산 (officePeriods)
      const holidayPeriods = Object.entries(holidayPrices).map(
        ([key, price]) => {
          const [dayPrefix, hour] = key.split('_');
          return {
            startTime: convertTimeToLocalDateTime(hour),
            price: Number(price) || 0,
            dayOfWeek: formatDayOfWeek(dayPrefix), // 예: "hol"
          };
        }
      );

      const finalOfficePeriods = [...basePeriods, ...holidayPeriods];

      // 3. 예외 기간 스펙 가공
      const formattedExceptionPeriods = exceptionPeriods.map((period) => ({
        startTime: convertTimeToLocalDateTime(period.startTime || '00'),
        price: Number(period.price) || 0,
        dayOfWeek: formatDayOfWeek(period.dayOfWeek || 'mon'),
        startDate: convertDateToLocalDateTime(period.startDate, false),
        endDate: convertDateToLocalDateTime(period.endDate, true),
      }));

      // 4. 최종 통합 Request DTO 빌드 (OfficeReqDto 스펙 일치)
      const formattedDto = {
        placeNo: Number(dto.placeNo),
        title: dto.title,
        content: dto.content,
        basePeople: Number(dto.basePeople) || 0,
        facilityList: facilities,
        officePeriods: finalOfficePeriods,
        exceptionPeriods: formattedExceptionPeriods,
      };

      // 5. 멀티파트 파일 및 순서 리스트 생성
      const files = currentImages.map((img) => img.file);
      const sortList = currentImages.map((_, index) => ({
        sort: index + 1,
      }));

      // 최종 정제 데이터 확인용 디버깅 콘솔
      console.log('📦 요일명 소문자 전환 완료 DTO:', formattedDto);

      const response = await registerOfficeInspection(
        formattedDto,
        files,
        sortList
      );

      if (
        response &&
        (response.status === 201 || response.status === 200 || response.data)
      ) {
        alert('검수 신청이 완료되었습니다!');
        navigate('/host/space/list');
      }
    } catch (error) {
      console.error('오피스 등록 실패:', error);
      alert('등록 중 오류가 발생했습니다. 입력 정보를 다시 확인해주세요.');
    }
  };

  return {
    step,
    setStep,
    formData,
    setFormData,
    handleChange,
    handlePriceChange,
    handleHolidayPriceChange,
    handleCheckChange,
    handleSubmit,
  };
}
