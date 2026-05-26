import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getOfficeDetail,
  updateOfficeApi,
} from '../../../api/host/coworking/officeApi';

export default function useUpdateCoworking(officeNo) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    placeNo: '',
    placeTitle: '',
    title: '',
    content: '',
    basePeople: '',
    facilities: [],
    officePeriods: {}, // { '1': { '00:00': 10000 } } 구조
    exceptionPeriods: [],
  });

  // 1. 데이터 가져오기 (Fetch)
  useEffect(() => {
    console.log('DEBUG - officeNo 확인:', officeNo); // 👈 로그 확인!
    if (!officeNo) return;
    const fetchData = async () => {
      try {
        console.log('API 요청 시작...');
        const resp = await getOfficeDetail(officeNo);
        console.log('API 응답 데이터:', resp);
        setFormData({
          placeNo: resp.data.placeNo,
          title: resp.data.title,
          content: resp.data.content,
          basePeople: resp.data.basePeople || '',
          facilities: resp.data.facilityList || [],
          officePeriods: resp.data.officePeriods || {},
          exceptionPeriods: resp.data.exceptionPeriods || [],
        });
      } catch (error) {
        console.error('데이터 조회 실패:', error);
      }
    };
    fetchData();
  }, [officeNo]);

  // 2. 입력 핸들러
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

  // 3. 제출 (Submit)
  const handleSubmit = async () => {
    try {
      // 요금 변환 로직 (기존과 동일)
      const finalOfficePeriods = [];
      Object.entries(formData.officePeriods).forEach(([dayKey, hours]) => {
        Object.entries(hours).forEach(([hour, price]) => {
          const dayPrefix =
            dayKey === '8'
              ? 'hol'
              : ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'][
                  Number(dayKey) - 1
                ];
          finalOfficePeriods.push({
            startTime: `2000-01-01T${hour.split(':')[0].padStart(2, '0')}:00:00`,
            price: Number(price),
            dayOfWeek: dayPrefix,
          });
        });
      });

      const formattedDto = {
        placeNo: Number(formData.placeNo),
        title: formData.title,
        content: formData.content,
        basePeople: Number(formData.basePeople), // 서버 요구 필드명 cnt
        facilityList: formData.facilities,
        officePeriods: finalOfficePeriods,
        exceptionPeriods: [], // 필요 시 확장
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
    setFormData,
    handleChange,
    handlePriceChange,
    handleCheckChange,
    handleSubmit,
  };
}
