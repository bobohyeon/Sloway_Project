import { useState, useEffect } from 'react';
import {
  getStationUpdateDetail,
  StationDetailUpdate,
} from '../../../api/host/station/stationApi';
import { useNavigate } from 'react-router-dom';
import { fetchTypeAmenityListApi } from '../../../api/host/amenity/hostAmenityApi';

export function useUpdateStation(stationNo) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const [facilityList, setFacilityList] = useState([]);
  const [formData, setFormData] = useState({
    placeNo: '',
    placeTitle: '',
    title: '',
    content: '',
    maxPeople: '',
    basePeople: '',
    rooms: '',
    checkIn: '',
    checkOut: '',
    facilityNames: [],
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
  });

  // 1. 전체 시설 목록 로드
  useEffect(() => {
    const loadAmenities = async () => {
      try {
        const resp = await fetchTypeAmenityListApi('station');
        if (resp?.data?.amenityList) {
          setFacilityList(resp.data.amenityList);
        }
      } catch (e) {
        console.error('어메니티 리스트 로드 실패', e);
      }
    };
    loadAmenities();
  }, []);

  // 2. 상세 데이터 로드 및 초기화
  useEffect(() => {
    if (!stationNo || facilityList.length === 0) return;

    const fetchDetailData = async () => {
      try {
        setIsLoading(true);
        const response = await getStationUpdateDetail(stationNo);
        const data = response.data;

        // 역매핑 사전 생성
        const reverseMap = facilityList.reduce((acc, item) => {
          acc[item.no] = item.name;
          return acc;
        }, {});

        // 데이터 추출
        const initialNos = data.facilityList
          ? data.facilityList.map((f) => f.amenityNo || f.no)
          : [];
        const initialNames = initialNos
          .map((no) => reverseMap[no])
          .filter(Boolean);

        setFormData({
          ...data,
          checkIn: data.checkIn
            ? data.checkIn.split('T')[1].substring(0, 5)
            : '',
          checkOut: data.checkOut
            ? data.checkOut.split('T')[1].substring(0, 5)
            : '',
          facilities: initialNos,
          facilityNames: initialNames,
          exceptionPeriods: (data.exceptionPeriods || []).map((p) => ({
            ...p,
            startDate: p.startDate ? p.startDate.split('T')[0] : '',
            endDate: p.endDate ? p.endDate.split('T')[0] : '',
          })),
        });
      } catch (error) {
        console.error('숙소 정보 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetailData();
  }, [stationNo, facilityList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckChange = (facilityNo, name) => {
    setFormData((prev) => {
      const currentNos = prev.facilities || [];
      const currentNames = prev.facilityNames || [];
      const isChecked = currentNos.includes(facilityNo);

      return {
        ...prev,
        facilities: isChecked
          ? currentNos.filter((no) => no !== facilityNo)
          : [...currentNos, facilityNo],
        facilityNames: isChecked
          ? currentNames.filter((n) => n !== name)
          : [...currentNames, name],
      };
    });
  };

  const handleSubmit = async () => {
    const formatToLocalDateTime = (timeStr) => {
      if (!timeStr) return null;
      if (timeStr.includes('T')) return timeStr;
      const absoluteTime = timeStr.length === 5 ? `${timeStr}:00` : timeStr;
      return `2000-01-01T${absoluteTime}`;
    };

    const formatPeriodToLocalDateTime = (dateStr) => {
      if (!dateStr) return null;
      if (dateStr.includes('T')) return dateStr;
      return `${dateStr}T00:00:00`;
    };

    const submitPayload = {
      ...formData,
      checkIn: formatToLocalDateTime(formData.checkIn),
      checkOut: formatToLocalDateTime(formData.checkOut),
      exceptionPeriods: (formData.exceptionPeriods || []).map((period) => ({
        ...period,
        startDate: formatPeriodToLocalDateTime(period.startDate),
        endDate: formatPeriodToLocalDateTime(period.endDate),
      })),
      holPrice: formData.holPrice,
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
      alert('수정 중 오류가 발생했습니다.');
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
