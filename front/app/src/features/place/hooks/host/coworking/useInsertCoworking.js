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
    placeNo: '',
    title: '',
    content: '',
    basePeople: '',
    facilities: [],
    hourlyPrices: {}, // { MON_00: 0, ... }
    holidayPrices: {}, // { HOL_00: 0, ... }
    exceptionPeriods: [],
    images: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      hourlyPrices: { ...prev.hourlyPrices, [name]: Number(value) || 0 },
    }));
  };

  const handleHolidayPriceChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      holidayPrices: { ...prev.holidayPrices, [name]: Number(value) || 0 },
    }));
  };

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

  const convertDateToLocalDateTime = (dateStr, isEndDate = false) => {
    if (!dateStr) return null;
    return isEndDate ? `${dateStr}T23:59:59` : `${dateStr}T00:00:00`;
  };

  const convertTimeToLocalDateTime = (hourStr) => {
    const formattedHour = String(hourStr).padStart(2, '0');
    return `2000-01-01T${formattedHour}:00:00`;
  };

  const formatDayOfWeek = (dayPrefix) => {
    if (!dayPrefix) return 'mon';
    return dayPrefix.toLowerCase();
  };

  const handleSubmit = async () => {
    try {
      // 1. 평상시 요금 데이터 변환 (officePeriods -> allOfficePeriods)
      // formData.officePeriods 구조: { '1': { '00:00': 10000, ... }, '2': ... }
      const finalOfficePeriods = [];
      Object.entries(formData.officePeriods || {}).forEach(
        ([dayKey, hours]) => {
          Object.entries(hours).forEach(([hour, price]) => {
            // dayKey '1'~'7'은 평일, '8'은 공휴일
            const dayPrefix =
              dayKey === '8'
                ? 'hol'
                : ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'][
                    Number(dayKey) - 1
                  ];

            finalOfficePeriods.push({
              startTime: convertTimeToLocalDateTime(hour.split(':')[0]), // "00:00" -> "00" -> 변환
              price: Number(price) || 0,
              dayOfWeek: dayPrefix,
            });
          });
        }
      );

      // 2. 예외 기간 요금 데이터 변환 (exceptionPeriods)
      const formattedExceptionPeriods = (formData.exceptionPeriods || [])
        .map((period) => {
          const exceptionList = [];
          Object.entries(period.prices || {}).forEach(([dayKey, hours]) => {
            Object.entries(hours).forEach(([hour, price]) => {
              const dayPrefix =
                dayKey === '8'
                  ? 'hol'
                  : ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'][
                      Number(dayKey) - 1
                    ];

              exceptionList.push({
                startTime: convertTimeToLocalDateTime(hour.split(':')[0]),
                price: Number(price) || 0,
                dayOfWeek: dayPrefix,
                startDate: convertDateToLocalDateTime(period.startDate, false),
                endDate: convertDateToLocalDateTime(period.endDate, true),
              });
            });
          });
          return exceptionList;
        })
        .flat(); // 중첩 배열을 평탄화

      // 3. 최종 DTO
      const formattedDto = {
        placeNo: Number(formData.placeNo),
        title: formData.title,
        content: formData.content,
        basePeople: Number(formData.basePeople) || 0,
        facilityList: formData.facilities,
        officePeriods: finalOfficePeriods,
        exceptionPeriods: formattedExceptionPeriods,
      };

      console.log('최종 전송 DTO:', JSON.stringify(formattedDto, null, 2));

      const files = formData.images.map((img) => img.file);
      const sortList = formData.images.map((_, index) => ({ sort: index + 1 }));

      const response = await registerOfficeInspection(
        formattedDto,
        files,
        sortList
      );

      if (response.status === 201) {
        alert('검수 신청이 완료되었습니다.');
        navigate(`/host/space/list`);
      }
    } catch (error) {
      console.error('등록 실패:', error);
      alert('등록 중 오류 발생.');
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
