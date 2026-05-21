import { useState } from 'react';
import { insertPlace } from '../../../api/host/place/placeApi';
import { useNavigate } from 'react-router-dom';

export default function useInsertSpace() {
  const TYPE_MAPPING = {
    WORK_STAY: { text: '워크스테이 등록 신청으로', path: 'workstay' },
    STATION: { text: '숙소 등록 신청으로', path: 'lodging' },
    OFFICE: { text: '오피스 등록 신청으로', path: 'coworking' },
  };
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    type: '',
    title: '',
    address: '',
    detailAddress: '',
    content: '',
    latitude: null,
    longitude: null,
    images: [],
  });

  // 일반 입력 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- 핵심 데이터 가공 및 서버 제출 핸들러 ---

  async function handleSubmit() {
    // try {
    const { images, ...dto } = formData;

    const files = images.map((img) => img.file);
    console.log(12);

    // 3. images 배열에서 sort 정보만 추출하여 sortList 배열 생성
    const sortList = images.map((img) => ({
      sort: img.sort,
    }));
    console.log(123);
    console.log(sortList);

    // 4. 분리된 데이터를 파라미터로 주입하여 전송
    const resp = await insertPlace(dto, files, sortList);
    console.log(resp);

    const currentConfig = TYPE_MAPPING[formData.type];

    if (currentConfig) {
      navigate(`/host/${currentConfig.path}`);
    } else {
      console.warn('Unknown type received:', formData.type);
      alert('올바르지 않은 신청 타입입니다.');
    }
    // // } catch (error) {
    //   console.error('공간 등록 중 에러 발생:', error);
    //   alert('공간 등록에 실패했습니다. 데이터를 다시 확인해주세요.');
    // }
  }

  return {
    TYPE_MAPPING,
    step,
    setStep,
    formData,
    setFormData,
    handleChange,
    handleSubmit,
  };
}
