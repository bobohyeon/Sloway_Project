import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getWorkStayUpdateDetail,
  workStayDetailUpdate,
} from '../../../api/host/workStay/wortStayApi';
import { fetchTypeAmenityListApi } from '../../../api/host/amenity/hostAmenityApi';

export function useUpdateWorkStay(workStayNo) {
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const [facilityList, setFacilityList] = useState([]);
  const [officeFacilityList, setOfficeFacilityList] = useState([]);

  const [formData, setFormData] = useState({
    stay: {
      placeNo: '',
      placeTitle: '',
      workNo: '',
      title: '',
      content: '',
      basePeople: 0,
      maxPeople: 0,
      rooms: 0,
      checkIn: '',
      checkOut: '',
      chargeAdd: 0,
      monPrice: 0,
      tuePrice: 0,
      wedPrice: 0,
      thuPrice: 0,
      friPrice: 0,
      satPrice: 0,
      sunPrice: 0,
      holPrice: 0,
      facilities: [],
      facilityNames: [],
      exceptionPeriods: [],
    },
    office: {
      officeNo: '',
      cnt: 0,
      facilities: [],
      facilityNames: [],
    },
  });

  // 1. 어메니티 리스트 로드
  useEffect(() => {
    const loadAmenities = async () => {
      try {
        const [resp, officeresp] = await Promise.all([
          fetchTypeAmenityListApi('workStay'),
          fetchTypeAmenityListApi('office'),
        ]);
        if (resp?.data?.amenityList) setFacilityList(resp.data.amenityList);
        if (officeresp?.data?.amenityList)
          setOfficeFacilityList(officeresp.data.amenityList);
      } catch (e) {
        console.error('어메니티 로드 실패', e);
      }
    };
    loadAmenities();
  }, []);

  // 2. 상세 데이터 로드 및 초기화
  useEffect(() => {
    if (
      !workStayNo ||
      facilityList.length === 0 ||
      officeFacilityList.length === 0
    )
      return;

    const fetchDetailData = async () => {
      try {
        setIsLoading(true);
        const response = await getWorkStayUpdateDetail(workStayNo);
        console.log(response.data);

        const data = response?.data;

        if (!data) return;

        const getMappedNames = (nos, list) =>
          nos.map((no) => list.find((l) => l.no === no)?.name).filter(Boolean);

        setFormData({
          stay: {
            ...data,
            checkIn: data.checkIn?.split('T')[1]?.substring(0, 5) || '',
            checkOut: data.checkOut?.split('T')[1]?.substring(0, 5) || '',
            facilities: data.facilityList?.map((f) => f.amenityNo) || [],
            facilityNames: getMappedNames(
              data.facilityList?.map((f) => f.amenityNo) || [],
              facilityList
            ),
            exceptionPeriods:
              data.exceptionPeriods?.map((p) => ({
                ...p,
                startDate: p.startDate?.split('T')[0] || '',
                endDate: p.endDate?.split('T')[0] || '',
              })) || [],
          },
          office: {
            workNo: data.office?.officeNo || '',
            cnt: data.office?.cnt || 0,
            facilities: data.office?.amenityNoList || [],
            facilityNames: getMappedNames(
              data.office?.amenityNoList || [],
              officeFacilityList
            ),
          },
        });
      } catch (e) {
        console.error('데이터 로드 실패', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetailData();
  }, [workStayNo, facilityList, officeFacilityList]);

  // 핸들러 (원래 쓰시던 방식 그대로 분리)
  const handleStayChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, stay: { ...prev.stay, [name]: value } }));
  };

  const handleOfficeChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      office: { ...prev.office, [name]: value },
    }));
  };

  const handleCheckChange = (no, name, type) => {
    setFormData((prev) => {
      const target = type === 'stay' ? 'stay' : 'office';
      const isChecked = prev[target].facilities.includes(no);
      return {
        ...prev,
        [target]: {
          ...prev[target],
          facilities: isChecked
            ? prev[target].facilities.filter((i) => i !== no)
            : [...prev[target].facilities, no],
          facilityNames: isChecked
            ? prev[target].facilityNames.filter((i) => i !== name)
            : [...prev[target].facilityNames, name],
        },
      };
    });
  };

  const handleSubmit = async () => {
    const formatToLocalDateTime = (timeStr) =>
      !timeStr
        ? null
        : timeStr.includes('T')
          ? timeStr
          : `2000-01-01T${timeStr.length === 5 ? timeStr + ':00' : timeStr}`;
    const formatDateToLocalDateTime = (dateStr) =>
      !dateStr ? null : dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`;

    const submitPayload = {
      stay: {
        ...formData.stay,
        checkIn: formatToLocalDateTime(formData.stay.checkIn),
        checkOut: formatToLocalDateTime(formData.stay.checkOut),
        facilityList: formData.stay.facilities.map((no) => ({ amenityNo: no })),
        exceptionPeriods: (formData.stay.exceptionPeriods || []).map((ep) => ({
          ...ep,
          startDate: formatDateToLocalDateTime(ep.startDate),
          endDate: formatDateToLocalDateTime(ep.endDate),
        })),
      },
      office: {
        ...formData.office,
        facilityList: formData.office.facilities.map((no) => ({
          amenityNo: no,
        })),
      },
    };

    try {
      const resp = await workStayDetailUpdate(workStayNo, submitPayload);
      if (resp.status === 200) {
        alert('수정 완료!');
        navigate(`/host/space/list`);
      }
    } catch (e) {
      console.error('수정 실패:', e);
      alert('입력 정보를 다시 확인해주세요.');
    }
  };

  return {
    step,
    setStep,
    formData,
    setFormData,
    isLoading,
    handleStayChange,
    handleOfficeChange,
    handleCheckChange,
    handleOfficeCheckChange: (no, name) =>
      handleCheckChange(no, name, 'office'),
    handleSubmit,
    officeFacilityList,
    facilityList,
  };
}
