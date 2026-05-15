import React from 'react';
import styled from 'styled-components';
import ImageUpdateLayout from '../../../../layouts/host/update/image/ImageUpdateLayout';
import ImageUploadGuide from './../../../../components/host/update/image/ImageUploadGuide';
import ImageGrid from './../../../../components/host/update/image/ImageGrid';
import { useNavigate } from 'react-router-dom';

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
  const handleSave = () => {
    alert('변경 검수 요청이 완료되었습니다.');
  };

  return (
    <ImageUpdateLayout
      title="공간 이미지 관리"
      subtitle="대표 이미지와 추가 이미지를 관리하세요"
      onBack={`/host/space/list`}
    >
      {/* 2. 이미지 업로드 가이드 */}
      <ImageUploadGuide />

      {/* 3. 이미지 그리드 영역 */}
      <ImageGrid />

      <FooterAction>
        <SaveButton onClick={handleSave}>변경 검수 요청</SaveButton>
      </FooterAction>
    </ImageUpdateLayout>
  );
}

export default ImageUpdatePage;
