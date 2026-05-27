import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getOfficeDetail,
  updateOfficeApi,
} from '../../../api/host/coworking/officeApi';
import { fetchTypeAmenityListApi } from '../../../api/host/amenity/hostAmenityApi';

export default function useUpdateCoworking(officeNo) {
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
    officePeriods: {},
    exceptionPeriods: [],
  });

  useEffect(() => {
    if (!officeNo) return;

    const fetchData = async () => {
      try {
        const resp = await getOfficeDetail(officeNo);
        const data = resp.data;
        console.log(data);

        // 1. 요금 데이터 변환: 배열 -> { day: { hour: price } } 객체로 구조화
        const dayMap = {
          mon: '1',
          tue: '2',
          wed: '3',
          thu: '4',
          fri: '5',
          sat: '6',
          sun: '7',
          hol: '8',
        };

        // fetchData 내부의 파싱 로직 수정
        const parsedPeriods = {};
        if (Array.isArray(data.officePeriods)) {
          data.officePeriods.forEach((p) => {
            const dayKey = dayMap[p.dayOfWeek] || p.dayOfWeek; // 'mon' -> '1'로 변환
            const hour = p.startTime.split('T')[1].substring(0, 5);

            if (!parsedPeriods[dayKey]) parsedPeriods[dayKey] = {};
            parsedPeriods[dayKey][hour] = p.price;
          });
        }

        // 2. 상태 업데이트
        setFormData({
          placeNo: data.placeNo || '',
          placeTitle: data.placeTitle || '',
          title: data.title || '',
          content: data.content || '',
          basePeople: data.basePeople || '',
          facilities: data.facilityList || [], // 서버에서 받는 그대로 저장
          officePeriods: parsedPeriods,
          exceptionPeriods: data.exceptionPeriods || [],
        });
      } catch (error) {
        console.error('데이터 조회 실패:', error);
      }
    };
    fetchData();
  }, [officeNo]);
  useEffect(() => {
    console.log('최신 formData 상태:', formData);
  }, [formData]);
  // 입력 핸들러 (그대로 유지)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (e, dayKey, hour) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      officePeriods: {
        ...prev.officePeriods,
        [dayKey]: { ...prev.officePeriods[dayKey], [hour]: Number(value) || 0 },
      },
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

  const handleSubmit = async () => {
    try {
      // 서버 전송 전 다시 배열 구조로 변환
      const finalOfficePeriods = [];
      Object.entries(formData.officePeriods).forEach(([day, hoursObj]) => {
        Object.entries(hoursObj).forEach(([hour, price]) => {
          finalOfficePeriods.push({
            dayOfWeek: day,
            startTime: `2000-01-01T${hour}:00`,
            price: Number(price),
          });
        });
      });

      const formattedDto = {
        placeNo: Number(formData.placeNo),
        title: formData.title,
        content: formData.content,
        basePeople: Number(formData.basePeople),
        facilityList: formData.facilities,
        officePeriods: finalOfficePeriods,
        exceptionPeriods: formData.exceptionPeriods,
      };

      const response = await updateOfficeApi(officeNo, formattedDto);
      if (response.status === 200) {
        alert('수정이 완료되었습니다.');
        navigate(`/host/space/list`);
      }
    } catch (error) {
      console.error(error);
      alert('수정 중 오류 발생.');
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
    handleCheckChange,
    handleSubmit,
  };
}
