import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  fetchSpaceImages,
  updateSpaceImages,
  fetchLodgingImages,
  updateLodgingImages,
  fetchCoworkingImages,
  updateCoworkingImages,
  fetchWorkStayImages,
  updateWorkStayImages,
} from '../../api/host/place/imageApi';

export default function useImageUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // 1. URL 기반 공간 유형 판단
  const getSpaceType = () => {
    if (pathname.includes('/space/')) return 'space';
    if (pathname.includes('/lodging/')) return 'lodging';
    if (pathname.includes('/coworking/')) return 'coworking';
    if (pathname.includes('/workstay/')) return 'workstay';
    return 'space';
  };

  const spaceType = getSpaceType();
  const isWorkStay = spaceType === 'workstay';

  // 2. 이미지 상태 관리 (일반용 / 오피스 전용 복수화)
  const [images, setImages] = useState([]);
  const [officeImages, setOfficeImages] = useState([]);

  // 3. 유형별 API 매핑 맵
  const apiMap = {
    space: { fetch: fetchSpaceImages, update: updateSpaceImages },
    lodging: { fetch: fetchLodgingImages, update: updateLodgingImages },
    coworking: { fetch: fetchCoworkingImages, update: updateCoworkingImages },
    workstay: { fetch: fetchWorkStayImages, update: updateWorkStayImages },
  };

  useEffect(() => {
    const loadImages = async () => {
      try {
        if (!id || !apiMap[spaceType]) return;
        const resp = await apiMap[spaceType].fetch(id);
        console.log('백엔드 응답 데이터:', resp);

        if (resp && resp.data) {
          if (isWorkStay) {
            // 1. 워크앤스테이일 때 (숙소 / 오피스 찢어서 매핑)
            const stayImagesRaw = resp.data.workStayImages || [];
            const officeImagesRaw = resp.data.officeImages || [];

            setImages(
              stayImagesRaw.map((img) => ({
                id: img.imageNo,
                imageNo: img.imageNo,
                preview: img.preview,
                file: null,
              }))
            );

            setOfficeImages(
              officeImagesRaw.map((img) => ({
                id: img.imageNo,
                imageNo: img.imageNo,
                preview: img.preview,
                file: null,
              }))
            );
          } else {
            // 2. 일반 단독 공간일 때
            const normalImagesRaw = Array.isArray(resp.data.placeImages)
              ? resp.data.placeImages
              : [];

            setImages(
              normalImagesRaw.map((img) => ({
                id: img.imageNo,
                imageNo: img.imageNo,
                preview: img.preview,
                file: null,
              }))
            );
            setOfficeImages([]);
            console.log(images);
          }
        }
      } catch (error) {
        console.error('이미지 로드 실패:', error);
      }
    };
    loadImages();
  }, [id, spaceType]);

  const handleSaveSubmit = async () => {
    try {
      const formDataToSend = new FormData();

      if (isWorkStay) {
        // 1. 워크앤스테이 숙소 이미지 패킹
        images.forEach((img) => {
          if (img.file) formDataToSend.append('files', img.file);
        });

        const sortList = images.map((img, i) => ({
          imageNo: img.file ? null : img.imageNo, // 새 파일이면 null, 기존 파일이면 고유 ID 유지
          sort: i + 1,
        }));
        formDataToSend.append(
          'sortList',
          new Blob([JSON.stringify(sortList)], { type: 'application/json' })
        );

        // 워크 오피스 이미지 패킹
        officeImages.forEach((img) => {
          if (img.file) formDataToSend.append('officeFiles', img.file);
        });

        const officeSortList = officeImages.map((img, i) => ({
          imageNo: img.file ? null : img.imageNo,
          sort: i + 1,
        }));
        formDataToSend.append(
          'officeSortList',
          new Blob([JSON.stringify(officeSortList)], {
            type: 'application/json',
          })
        );
      } else {
        // 일반 단독 공간 패킹 (기존 로직 확장)
        images.forEach((img) => {
          if (img.file) formDataToSend.append('files', img.file);
        });

        const sortList = images.map((img, i) => ({
          imageNo: img.file ? null : img.imageNo,
          sort: i + 1,
        }));
        formDataToSend.append(
          'sortList',
          new Blob([JSON.stringify(sortList)], { type: 'application/json' })
        );
      }

      await apiMap[spaceType].update(id, formDataToSend);
      alert('변경 검수 요청이 완료되었습니다.');
      navigate('/host/space/list');
    } catch (error) {
      console.error('이미지 업데이트 실패:', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  return {
    isWorkStay,
    images,
    setImages,
    officeImages,
    setOfficeImages,
    handleSaveSubmit,
  };
}
