import React, { useRef, useState } from 'react';
import styled from 'styled-components';

const GridWrapper = styled.div`
  background: white;
  border: 1px solid #eee;
  border-radius: 15px;
  padding: 30px;
`;

const GridHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  h3 {
    font-size: 16px;
    color: #333;
  }
  span {
    font-size: 12px;
    color: #aaa;
  }
`;

const ListGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
`;

const ImageBox = styled.div`
  aspect-ratio: 4 / 3;
  border: 1px solid ${(props) => (props.isMain ? '#d46a4f' : '#eee')};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: grab;
  overflow: hidden;
  position: relative;
  background-color: ${(props) => (props.isMain ? '#fff9f7' : '#f1f4ee')};
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
  }
`;

const OrderBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const MainBadge = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: #d46a4f;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  z-index: 5;
`;

const ActionOverlay = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 8px;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: flex-end;
  gap: 4px;
  border-top: 1px solid #eee;
`;

const ToolBtn = styled.button`
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: #e0e0e0;
  }
`;

const AddCard = styled.div`
  aspect-ratio: 4 / 3;
  border: 2px dashed #ddd;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #aaa;
  cursor: pointer;
  background: #fff;
  &:hover {
    background: #f9f9f9;
  }
  .plus {
    font-size: 30px;
  }
  span {
    font-size: 12px;
    margin-top: 5px;
  }
`;

// 💡 부모 페이지와 부모 훅에서 이미지를 완전히 제어할 수 있도록 Props 수신 구조로 변경
function ImageGrid({ images = [], setImages, title, namespace = 'grid' }) {
  const fileInputRef = useRef(null);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 10) {
      alert('최대 10장까지 업로드 가능합니다.');
      return;
    }

    const newImages = files.map((file, index) => ({
      id: Date.now() + index + Math.random(), // 중복 키 보장 분기 가드
      preview: URL.createObjectURL(file),
      file: file, // 👈 FormData.append 할 때 꺼내 쓸 실제 바이너리 파일
      isIcon: false,
    }));

    setImages((prev) => [...prev, ...newImages]);
    e.target.value = '';
  };

  const onDragStart = (index) => setDraggedIndex(index);

  const onDragEnter = (index) => {
    if (draggedIndex === index) return;
    const newList = [...images];
    const draggedItem = newList[draggedIndex];
    newList.splice(draggedIndex, 1);
    newList.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    setImages(newList);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const setAsMain = (index) => {
    const newList = [...images];
    const selected = newList.splice(index, 1)[0];
    newList.unshift(selected);
    setImages(newList);
  };

  return (
    <GridWrapper>
      <GridHeader>
        <h3>
          {title ? title : ''}업로드 된 이미지 ({images.length}/10)
        </h3>
        <span>드래그하여 순서를 변경하실 수 있어요</span>
      </GridHeader>

      <input
        type="file"
        multiple
        accept=".jpg, .jpeg, .png"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleImageUpload}
      />

      <ListGrid>
        {images.map((img, index) => (
          <ImageBox
            key={`${namespace}-${img.id}`}
            $isMain={index === 0}
            draggable
            onDragStart={() => onDragStart(index)}
            onDragEnter={() => onDragEnter(index)}
            onDragEnd={() => setDraggedIndex(null)}
            onDragOver={(e) => e.preventDefault()}
            className={draggedIndex === index ? 'dragging' : ''}
          >
            <OrderBadge>{index + 1}</OrderBadge>
            {img.isIcon ? (
              <div style={{ fontSize: '40px' }}>{img.preview}</div>
            ) : (
              <img src={img.preview} alt={`space-${index}`} />
            )}

            {index === 0 && <MainBadge>대표</MainBadge>}

            <ActionOverlay>
              <ToolBtn title="대표 설정" onClick={() => setAsMain(index)}>
                ⭐
              </ToolBtn>
              <ToolBtn title="삭제" onClick={() => removeImage(index)}>
                🗑️
              </ToolBtn>
            </ActionOverlay>
          </ImageBox>
        ))}

        {images.length < 10 && (
          <AddCard onClick={() => fileInputRef.current.click()}>
            <div className="plus">+</div>
            <span>이미지 추가</span>
            <div style={{ fontSize: '11px' }}>{images.length}/10</div>
          </AddCard>
        )}
      </ListGrid>
    </GridWrapper>
  );
}

export default ImageGrid;
