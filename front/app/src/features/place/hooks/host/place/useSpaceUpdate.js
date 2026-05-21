import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchPlaceDetail,
  updatePlaceInfo,
} from '../../../api/host/place/placeApi';

export default function useSpaceUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 편의시설 없이 기본 정보만 깔끔하게 초기화
  const [formData, setFormData] = useState({
    no: '',
    title: '',
    content: '',
  });

  useEffect(() => {
    const loadPlaceDetail = async () => {
      try {
        if (!id) return;
        const resp = await fetchPlaceDetail(id);
        if (resp && resp.data) {
          setFormData({
            no: resp.data.no || '',
            title: resp.data.title || '',
            content: resp.data.content || '',
          });
        }
      } catch (error) {
        console.error('공간 기본 정보 로드 실패:', error);
        alert('데이터를 불러오는 중 오류가 발생했습니다.');
      }
    };

    loadPlaceDetail();
  }, [id]);

  // 텍스트 인풋 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 서버 수정 요청 제출 핸들러
  const handleSaveSubmit = async () => {
    try {
      console.log('수정 요청 데이터:', formData);

      const resp = await updatePlaceInfo(id, formData);
      console.log(resp);

      if (resp.status === 200) {
        alert('공간 정보 수정이 완료되었습니다.');
        navigate('/host/space/list');
      }
    } catch (error) {
      console.error('공간 수정 저장 실패:', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  return {
    formData,
    handleChange,
    handleSaveSubmit,
    navigate,
  };
}
