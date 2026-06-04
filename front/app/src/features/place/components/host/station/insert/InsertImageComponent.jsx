import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import imageCompression from 'browser-image-compression';

const FormCard = styled.div`
  background: white;
  border-radius: 15px;
  border: 1px solid #e0e0e0;
  padding: 40px;
  width: 100%;
  box-sizing: border-box;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
`;

const SubText = styled.p`
  font-size: 13px;
  color: #888;
  margin-bottom: 30px;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
`;

const ImageBox = styled.div`
  aspect-ratio: 4 / 3;
  border: 2px dashed ${(props) => (props.$isMain ? '#d46a4f' : '#e0e0e0')};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: grab;
  overflow: hidden;
  position: relative;
  background-color: ${(props) => (props.$isMain ? '#fff9f7' : '#fff')};
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:active {
    cursor: grabbing;
  }
  &.dragging {
    opacity: 0.5;
    transform: scale(0.95);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
    display: block;
  }
`;

const LabelWrap = styled.div`
  text-align: center;
  font-size: 13px;
  color: #aaa;
  pointer-events: none;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  z-index: 10;
  &:hover {
    background: #000;
  }
`;

const InfoBar = styled.div`
  background-color: #f1f4ee;
  padding: 15px;
  border-radius: 8px;
  font-size: 13px;
  color: #666;
  margin-bottom: 30px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 40px;
`;

const PrevButton = styled.button`
  flex: 1;
  padding: 18px;
  background: #f1f1f1;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
`;

const NextButton = styled.button`
  flex: 5;
  padding: 18px;
  background-color: #768966;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
`;

function InsertImageComponent({ formData, setFormData, prev, next }) {
  const fileInputRef = useRef(null);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
    };

    const newImages = await Promise.all(
      files.map(async (file, index) => {
        // 1. 실제 파일 타입 체크 (확장자 대신 MIME 타입 확인)
        if (!file.type.startsWith('image/')) {
          console.error('이미지 파일이 아님:', file.name);
          return null;
        }

        try {
          const compressedFile = await imageCompression(file, options);

          // 2. Base64로 변환 시 오류 방지를 위한 정밀한 FileReader 사용
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              // 결과물이 정상적인 데이터인지 확인
              if (reader.result && reader.result.startsWith('data:image/')) {
                resolve({
                  id: crypto.randomUUID(),
                  file: new File(
                    [compressedFile],
                    `img_${Date.now()}_${index}.jpg`,
                    { type: 'image/jpeg' }
                  ),
                  preview: reader.result,
                });
              } else {
                resolve(null);
              }
            };
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(compressedFile);
          });
        } catch (err) {
          console.error('처리 에러:', err);
          return null;
        }
      })
    );

    const validImages = newImages.filter((img) => img !== null);

    if (validImages.length === 0) {
      alert('이미지 처리 실패: 올바른 이미지 파일을 선택해주세요.');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...validImages],
    }));
    e.target.value = '';
  };
  const onDragStart = (index) => setDraggedIndex(index);

  const onDragEnter = (index) => {
    if (draggedIndex === index) return;
    const newImages = [...formData.images];
    const draggedItem = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  return (
    <FormCard>
      <SectionTitle>공간 이미지</SectionTitle>
      <SubText>
        드래그하여 순서를 변경할 수 있습니다. (첫 번째 사진이 대표 이미지)
      </SubText>

      <input
        type="file"
        multiple
        accept=".jpg, .jpeg, .png"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleImageUpload}
      />

      <ImageGrid>
        {formData.images.map((img, index) => (
          <ImageBox
            key={img.id}
            $isMain={index === 0}
            draggable
            onDragStart={() => onDragStart(index)}
            onDragEnter={() => onDragEnter(index)}
            onDragEnd={() => setDraggedIndex(null)}
            onDragOver={(e) => e.preventDefault()}
            className={draggedIndex === index ? 'dragging' : ''}
          >
            <img src={img.preview} alt={`upload-${index}`} />
            <RemoveButton
              onClick={(e) => {
                e.stopPropagation();
                setFormData((p) => ({
                  ...p,
                  images: p.images.filter((_, i) => i !== index),
                }));
              }}
            >
              ×
            </RemoveButton>
            {index === 0 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  background: '#d46a4f',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  zIndex: 5,
                }}
              >
                대표
              </div>
            )}
          </ImageBox>
        ))}

        {formData.images.length < 10 && (
          <ImageBox onClick={() => fileInputRef.current.click()}>
            <LabelWrap>
              <span style={{ fontSize: '24px' }}>+</span>
              <div style={{ marginTop: '5px' }}>
                {formData.images.length === 0
                  ? '대표 이미지 등록'
                  : formData.images.length + 1}
              </div>
            </LabelWrap>
          </ImageBox>
        )}
      </ImageGrid>

      <InfoBar>💡 JPG/JPEG 형식의 고해상도 사진을 추천해요 (최대 10장)</InfoBar>

      <ButtonGroup>
        <PrevButton onClick={prev}>이전</PrevButton>
        <NextButton onClick={next}>다음</NextButton>
      </ButtonGroup>
    </FormCard>
  );
}

export default InsertImageComponent;
