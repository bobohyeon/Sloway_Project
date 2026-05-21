import React from 'react';
import styled from 'styled-components';
import ImageUpdateLayout from '../../../../layouts/host/update/image/ImageUpdateLayout';
import ImageUploadGuide from './../../../../components/host/update/image/ImageUploadGuide';
import ImageGrid from './../../../../components/host/update/image/ImageGrid';
import useImageUpdate from '../../../../hooks/host/useImageUpdate';

const FooterAction = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
`;

const SaveButton = styled.button`
  padding: 12px 40px;
  background-color: #eee;
  border: 1px solid #ddd;
  border-radius: 8px;
  color: #666;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background-color: #e0e0e0;
  }
`;

function ImageUpdatePage() {
  const {
    isWorkStay,
    images,
    setImages,
    officeImages,
    setOfficeImages,
    handleSaveSubmit,
  } = useImageUpdate();

  return (
    <ImageUpdateLayout
      title="공간 이미지 관리"
      subtitle="대표 이미지와 추가 이미지를 관리하세요"
      onBack={`/host/space/list`}
    >
      {/* 2. 이미지 업로드 가이드 */}
      <ImageUploadGuide />

      {/* 3. 이미지 그리드 영역 */}
      <ImageGrid images={images} setImages={setImages} />

      {isWorkStay && (
        <ImageGrid
          images={officeImages}
          setImages={setOfficeImages}
          title={'워크앤스테이 내 오피스의 '}
        />
      )}

      <FooterAction>
        <SaveButton onClick={handleSaveSubmit}>변경 검수 요청</SaveButton>
      </FooterAction>
    </ImageUpdateLayout>
  );
}

export default ImageUpdatePage;
