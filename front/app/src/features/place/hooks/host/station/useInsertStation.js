import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerStationInspection } from '../../../api/host/place/placeApi';
import { fetchTypeAmenityListApi } from '../../../api/host/amenity/hostAmenityApi';

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
    exceptionPeriods: [],

    // 4단계: 이미지
    images: [],
  });

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
      // images가 비어있을 경우를 대비한 안전 가드
      const currentImages = Array.isArray(formData.images)
        ? formData.images
        : [];

      // 1. 상태 분리 (exceptionPeriods도 구조분해로 따로 분리)
      const { images, facilities, exceptionPeriods, ...dto } = formData;

      // 2. 백엔드 DTO 규격에 맞추어 완벽 가공
      const formattedDto = {
        ...dto,
        placeNo: Number(dto.placeNo), // 🛠️ placeNo가 간혹 String으로 넘어올 수 있으므로 숫자로 확실히 변환
        checkIn: convertToLocalDateTime(dto.checkIn),
        checkOut: convertToLocalDateTime(dto.checkOut),

        facilityList: facilities,

        // exceptionPeriods 배열을 순회하며 startDate, endDate를 LocalDateTime 형태로 변환
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

      // 🛠️ [핵심 수정] 파일 객체만 안전하게 매핑
      const files = currentImages.map((img) => img.file);

      // 🛠️ [핵심 수정] 이미지 객체 내부에 없는 img.sort 대신 배열의 index를 기반으로 sortList 자동 생성
      const sortList = currentImages.map((_, index) => ({
        sort: index + 1, // 첫 번째 이미지는 1, 두 번째는 2... 순서 보장
      }));

      // 디버깅용 콘솔 (전송 데이터 최종 확인용)
      console.log('전송할 DTO:', formattedDto);
      console.log(' 전송할 파일배열:', files);
      console.log(' 생성된 순서배열:', sortList);

      const response = await registerStationInspection(
        formattedDto,
        files,
        sortList
      );

      // response나 response.status 검증 후 이동
      if (
        response &&
        (response.status === 201 || response.status === 200 || response.data)
      ) {
        alert('검수 신청이 완료되었습니다!');
        navigate('/host/space/list');
      }
    } catch (error) {
      console.error('숙소 등록 실패:', error);
      alert('등록 중 오류가 발생했습니다. 입력 정보를 다시 확인해주세요.');
    }
  };
  return {
    step,
    setStep,
    formData,
    facilityList,
    setFormData,
    handleChange,
    handleCheckChange,
    handleSubmit,
  };
}
