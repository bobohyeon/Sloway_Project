import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getWorkStayUpdateDetail,
  workStayDetailUpdate,
} from '../../../api/host/workStay/wortStayApi';

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const createInitialHours = () => Array(24).fill(0);

export function useUpdateWorkStay(workStayNo) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // 통합 단일 상태 트리
  const [formData, setFormData] = useState({
    placeNo: '',
    placeTitle: '',
    title: '',
    content: '',
    basePeople: '',
    facilities: [],
    facilityNames: [],

    // 💡 요일별 24시간 가격 상태 관리 트리
    periods: {
      MON: createInitialHours(),
      TUE: createInitialHours(),
      WED: createInitialHours(),
      THU: createInitialHours(),
      FRI: createInitialHours(),
      SAT: createInitialHours(),
      SUN: createInitialHours(),
    },

    // 💡 오피스 예외 기간 리스트 상태 관리 트리
    exceptionPeriods: [],
  });

  // 🔄 백엔드 상세 데이터를 프론트 구조에 맞게 완벽 역바인딩 (방어 코드 추가)
  useEffect(() => {
    if (!workStayNo) return;

    const fetchDetailData = async () => {
      try {
        setIsLoading(true);
        const response = await getWorkStayUpdateDetail(workStayNo);
        const data = response.data;

        if (!data) return;

        const officeReverseMap = {
          1: '주방',
          2: '세탁기',
          3: '건조기',
          4: 'WiFi',
          5: '주차',
          6: '어메니티',
          7: 'TV',
          8: '에어컨',
          9: '난방',
          10: '금연',
          11: '반려동물',
          12: '바베큐',
        };

        // 1. 편의시설 데이터 파싱
        const officeNos = data.facilityList
          ? data.facilityList.map((f) => f.amenityNo)
          : [];
        const officeNames = officeNos
          .map((no) => officeReverseMap[no])
          .filter(Boolean);

        // 2. 기본 요일별 24시간 가격 데이터 파싱 안전장치
        const initialPeriods = {
          MON: createInitialHours(),
          TUE: createInitialHours(),
          WED: createInitialHours(),
          THU: createInitialHours(),
          FRI: createInitialHours(),
          SAT: createInitialHours(),
          SUN: createInitialHours(),
        };

        // 💡 백엔드에서 주는 배열 필드명이 officePeriods 혹은 officePeriodList 둘 다 호환되도록 바인딩
        const backendPeriods =
          data.officePeriods || data.officePeriodList || [];
        if (backendPeriods && backendPeriods.length > 0) {
          backendPeriods.forEach((p) => {
            const day = p.dayOfWeek;
            if (initialPeriods[day] && p.startTime) {
              // "2000-01-01T15:00:00" 포맷에서 시간 인덱스("15")만 정수로 안전하게 추출
              const hourIndex = parseInt(
                p.startTime.split('T')[1].substring(0, 2),
                10
              );
              if (hourIndex >= 0 && hourIndex < 24) {
                initialPeriods[day][hourIndex] = p.price || 0;
              }
            }
          });
        }

        // 3. 예외 기간 요금 리스트 데이터 파싱 안전장치
        // 💡 백엔드에서 주는 배열 필드명이 exceptionPeriods 혹은 exceptionPeriodList 둘 다 호환
        const backendExceptions =
          data.exceptionPeriods || data.exceptionPeriodList || [];
        const mappedExceptions = backendExceptions.map((period) => ({
          dayOfWeek: period.dayOfWeek || 'MON',
          price: period.price || 0,
          // UI input[type="time"] 바인딩용 (15:00:00 -> 15:00)
          startTime: period.startTime
            ? period.startTime.split('T')[1].substring(0, 5)
            : '00:00',
          // UI input[type="date"] 바인딩용 (2026-05-26T00:00:00 -> 2026-05-26)
          startDate: period.startDate
            ? period.startDate.split('T')[0]
            : period.exceptionStartDate
              ? period.exceptionStartDate.split('T')[0]
              : '',
          endDate: period.endDate
            ? period.endDate.split('T')[0]
            : period.exceptionEndDate
              ? period.exceptionEndDate.split('T')[0]
              : '',
        }));

        setFormData({
          placeNo: data.placeNo || '',
          placeTitle: data.placeTitle || '',
          title: data.title || '',
          content: data.content || '',
          basePeople: data.basePeople || data.cnt || '', // DTO의 basePeople과 엔티티의 cnt 모두 방어형 매핑
          facilities: officeNos,
          facilityNames: officeNames,
          periods: initialPeriods,
          exceptionPeriods: mappedExceptions,
        });
      } catch (error) {
        console.error('오피스 정보 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetailData();
  }, [workStayNo]);

  // 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 오피스 24시간 가격 변동 핸들러
  const handleOfficePriceChange = (day, hour, value) => {
    setFormData((prev) => {
      const updatedDayHours = [...prev.periods[day]];
      updatedDayHours[hour] = value === '' ? 0 : Number(value);

      return {
        ...prev,
        periods: {
          ...prev.periods,
          [day]: updatedDayHours,
        },
      };
    });
  };

  // 체크박스 변경 핸들러
  const handleCheckChange = (facilityNo, name) => {
    setFormData((prev) => {
      const currentNos = prev.facilities || [];
      const currentNames = prev.facilityNames || [];
      const isChecked = currentNos.includes(facilityNo);

      return {
        ...prev,
        facilities: isChecked
          ? currentNos.filter((item) => item !== facilityNo)
          : [...currentNos, facilityNo],
        facilityNames: isChecked
          ? currentNames.filter((item) => item !== name)
          : [...currentNames, name],
      };
    });
  };

  // 🔄 최종 전송 메서드 (데이터 누락 부위 원천 차단)
  const handleSubmit = async () => {
    const makeFullTimestamp = (hourInt) => {
      const pad = String(hourInt).padStart(2, '0');
      return `2000-01-01T${pad}:00:00`;
    };

    const formatPeriodToLocalDateTime = (dateStr) => {
      if (!dateStr) return null;
      if (dateStr.includes('T')) return dateStr;
      return `${dateStr}T00:00:00`;
    };

    // 1️⃣ 기본 요일별/시간별 가격 리스트 추출 및 생성 (officePeriods 꽂아넣기)
    const officePeriodsPayload = [];
    DAYS.forEach((day) => {
      // 명확하게 formData.periods에 접근하여 24개 데이터 파싱 확인
      const hoursArray = formData.periods[day] || createInitialHours();
      hoursArray.forEach((priceValue, hour) => {
        officePeriodsPayload.push({
          dayOfWeek: day,
          startTime: makeFullTimestamp(hour),
          price: Number(priceValue) || 0, // 강제 숫자 가공
        });
      });
    });

    // 2️⃣ 예외 기간 요금 리스트 추출 및 생성 (exceptionPeriods 꽂아넣기)
    const exceptionPeriodsPayload = (formData.exceptionPeriods || []).map(
      (ep) => {
        const hourInt = ep.startTime
          ? parseInt(ep.startTime.split(':')[0], 10)
          : 0;
        return {
          dayOfWeek: ep.dayOfWeek || 'MON',
          startTime: makeFullTimestamp(hourInt),
          price: Number(ep.price) || 0,
          startDate: formatPeriodToLocalDateTime(ep.startDate),
          endDate: formatPeriodToLocalDateTime(ep.endDate),
        };
      }
    );

    // 💡 백엔드 OfficeReqDto와 단 1글자도 틀리지 않게 랩핑 구조 없이 단일 객체 직렬화
    const submitPayload = {
      placeNo: formData.placeNo ? Number(formData.placeNo) : null,
      title: formData.title,
      content: formData.content,
      basePeople: Number(formData.basePeople) || 0,
      facilityList: (formData.facilities || []).map((no) => ({
        amenityNo: no,
      })),
      officePeriods: officePeriodsPayload, // 💥 값이 정상적으로 담김!
      exceptionPeriods: exceptionPeriodsPayload, // 💥 값이 정상적으로 담김!
    };

    console.log(
      'OfficeReqDto 최종 전송 JSON 데이터:',
      JSON.stringify(submitPayload, null, 2)
    );

    try {
      const resp = await workStayDetailUpdate(workStayNo, submitPayload);
      if (resp.status === 200) {
        alert('오피스 정보 수정이 완료되었습니다!');
        navigate(`/host/space/list`);
      }
    } catch (error) {
      console.error('오피스 수정 요청 실패:', error);
      alert(
        '수정 중 오류가 발생했습니다. 전송 필드 데이터 형식을 다시 확인해 주세요.'
      );
    }
  };

  return {
    step,
    setStep,
    formData,
    setFormData,
    isLoading,
    handleChange,
    handleOfficePriceChange,
    handleCheckChange,
    handleSubmit,
  };
}
