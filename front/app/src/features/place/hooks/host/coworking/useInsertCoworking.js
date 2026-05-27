import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerOfficeInspection } from '../../../api/host/place/placeApi';
import { fetchTypeAmenityListApi } from '../../../api/host/amenity/hostAmenityApi';

export default function useInsertCoworking() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [facilityList, setFacilityList] = useState([]); // 동적 데이터를 위한 state

  const type = 'office';
  useEffect(() => {
    const loadAmenities = async () => {
      console.log('API 호출 시작 전...'); // 1. 함수 진입 확인
      try {
        const resp = await fetchTypeAmenityListApi(type);
        console.log('API 응답 확인:', resp); // 2. 응답 내용 확인

        if (resp && resp.data) {
          setFacilityList(resp.data.amenityList);
          console.log('리스트 설정 완료:', resp.data.amenityList);
        } else {
          console.warn('응답은 왔으나 data 구조가 이상함:', resp);
        }
      } catch (e) {
        console.error('API 호출 중 에러 발생!!!:', e); // 3. 에러 발생 시 확실히 출력
      }
    };

    loadAmenities();
  }, [type]);

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
    facilityList,
    setFormData,
    handleChange,
    handlePriceChange,
    handleHolidayPriceChange,
    handleCheckChange,
    handleSubmit,
  };
}
