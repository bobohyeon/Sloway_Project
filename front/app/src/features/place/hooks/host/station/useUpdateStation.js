import { useState, useEffect } from 'react';
import {
  getStationUpdateDetail,
  StationDetailUpdate,
} from '../../../api/host/station/stationApi';
import { useNavigate } from 'react-router-dom';
import { fetchTypeAmenityListApi } from '../../../api/host/amenity/hostAmenityApi';

// API 호출 함수 예시 (실제 프로젝트 구조에 맞게 변경하여 사용하세요)

export function useUpdateStation(stationNo) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const [facilityList, setFacilityList] = useState([]); // 동적 데이터를 위한 state

  const type = 'station';
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
    // 1단계
    placeNo: '',
    placeTitle: '',
    title: '',
    content: '',
    // 2단계
    maxPeople: '',
    basePeople: '',
    rooms: '',
    checkIn: '',
    checkOut: '',
    facilityNames: [],
    facilities: [],
    // 3단계
    monPrice: '',
    tuePrice: '',
    wedPrice: '',
    thuPrice: '',
    friPrice: '',
    satPrice: '',
    sunPrice: '',
    holPrice: '', // 백엔드 holPrice와 매핑
    exceptionPeriods: [],
  });

  // 🔄 백엔드에서 받아온 대시보드/상세 데이터를 프론트 구조에 맞게 바인딩
  useEffect(() => {
    if (!stationNo) return;

    const fetchDetailData = async () => {
      try {
        setIsLoading(true);
        const response = await getStationUpdateDetail(stationNo);
        const data = response.data;

        // 💡 1. 번호(no)를 한글 이름(name)으로 바꿔줄 역매핑 사전 정의
        const reverseMap = facilityList;

        // 💡 2. 백엔드에서 내려온 [{amenityNo: 1}, {amenityNo: 4}] 구조에서 번호만 추출
        const initialNos = data.facilityList
          ? data.facilityList.map((f) => f.no)
          : [];

        // 💡 3. 추출한 번호를 바탕으로 한글 이름 배열 동시 생성 -> ['주방', 'WiFi']
        const initialNames = initialNos
          ? initialNos.map((no) => reverseMap[no]).filter(Boolean)
          : [];

        setFormData({
          placeNo: data.placeNo || '',
          placeTitle: data.placeTitle || '',
          title: data.title || '',
          content: data.content || '',
          maxPeople: data.maxPeople || '',
          basePeople: data.basePeople || '',
          rooms: data.rooms || '',
          checkIn: data.checkIn
            ? data.checkIn.split('T')[1].substring(0, 5)
            : '', // LocalDateTime에서 시간만 필요한 경우 추출
          checkOut: data.checkOut
            ? data.checkOut.split('T')[1].substring(0, 5)
            : '',
          facilities: initialNos,
          facilityNames: initialNames,
          monPrice: data.monPrice || '',
          tuePrice: data.tuePrice || '',
          wedPrice: data.wedPrice || '',
          thuPrice: data.thuPrice || '',
          friPrice: data.friPrice || '',
          satPrice: data.satPrice || '',
          sunPrice: data.sunPrice || '',
          holPrice: data.holPrice || '', // holPrice -> holidayPrice 매핑
          exceptionPeriods: data.exceptionPeriods
            ? data.exceptionPeriods.map((period) => ({
                ...period,
                // "2026-05-08T00:00:00" -> "2026-05-08"로 컷!
                startDate: period.startDate
                  ? period.startDate.split('T')[0]
                  : '',
                endDate: period.endDate ? period.endDate.split('T')[0] : '',
              }))
            : [],
        });
      } catch (error) {
        console.error('숙소 정보 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetailData();
  }, [stationNo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckChange = (facilityNo, name) => {
    setFormData((prev) => {
      // 💡 안전장치: 혹시라도 기존 값이 깨져있으면 빈 배열([])로 대체하여 에러 방지
      const currentNos = prev.facilities || [];
      const currentNames = prev.facilityNames || [];

      const isChecked = currentNos.includes(facilityNo);

      return {
        ...prev,
        // 번호 배열 업데이트
        facilities: isChecked
          ? currentNos.filter((item) => item !== facilityNo)
          : [...currentNos, facilityNo],

        // 이름 배열 업데이트 (이제 에러가 절대 나지 않습니다)
        facilityNames: isChecked
          ? currentNames.filter((item) => item !== name)
          : [...currentNames, name],
      };
    });
  };

  const handleSubmit = async () => {
    // 🕒 시간 정보 포맷 변환 헬퍼 (15:00 -> 2000-01-01T15:00:00)
    const formatToLocalDateTime = (timeStr) => {
      if (!timeStr) return null;
      if (timeStr.includes('T')) return timeStr;
      const absoluteTime = timeStr.length === 5 ? `${timeStr}:00` : timeStr;
      return `2000-01-01T${absoluteTime}`;
    };

    // 📅 예외 기간 날짜 포맷 변환 헬퍼 (2026-05-26 -> 2026-05-26T00:00:00)
    const formatPeriodToLocalDateTime = (dateStr) => {
      if (!dateStr) return null;
      if (dateStr.includes('T')) return dateStr;
      return `${dateStr}T00:00:00`;
    };

    const submitPayload = {
      ...formData,

      // 1. 체크인/체크아웃 시간 변환
      checkIn: formatToLocalDateTime(formData.checkIn),
      checkOut: formatToLocalDateTime(formData.checkOut),

      exceptionPeriods: (formData.exceptionPeriods || []).map((period) => ({
        ...period,
        startDate: formatPeriodToLocalDateTime(period.startDate),
        endDate: formatPeriodToLocalDateTime(period.endDate),
      })),

      holPrice: formData.holPrice, // holidayPrice -> holPrice 매핑
      facilityList: formData.facilities.map((no) => ({ amenityNo: no })),
    };

    delete submitPayload.facilityNames;

    try {
      const resp = await StationDetailUpdate(stationNo, submitPayload);
      if (resp.status === 200) {
        alert('검수 신청이 완료되었습니다!');
        navigate(`/host/space/list`);
      }
    } catch (error) {
      console.error('숙소 수정 요청 실패:', error);
      alert('수정 중 오류가 발생했습니다. 입력 형식을 확인해 주세요.');
    }
  };

  return {
    step,
    setStep,
    formData,
    facilityList,
    setFormData,
    isLoading,
    handleChange,
    handleCheckChange,
    handleSubmit,
  };
}
