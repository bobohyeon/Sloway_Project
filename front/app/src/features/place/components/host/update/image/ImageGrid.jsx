import React, { useRef, useState } from "react";
import styled from "styled-components";

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
  border: 1px solid ${(props) => (props.isMain ? "#d46a4f" : "#eee")};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: grab;
  overflow: hidden;
  position: relative;
  background-color: ${(props) => (props.isMain ? "#fff9f7" : "#f1f4ee")};
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

function ImageGrid() {
  const fileInputRef = useRef(null);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // 초기 더미 데이터 (실제 환경에서는 props나 state로 관리)
  const [imageList, setImageList] = useState([
    { id: 1, preview: "🌲", isIcon: true },
    { id: 2, preview: "🛋️", isIcon: true },
    { id: 3, preview: "🛏️", isIcon: true },
  ]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (imageList.length + files.length > 10) {
      alert("최대 10장까지 업로드 가능합니다.");
      return;
    }

    const newImages = files.map((file, index) => ({
      id: Date.now() + index,
      preview: URL.createObjectURL(file),
      isIcon: false,
    }));

    setImageList((prev) => [...prev, ...newImages]);
    e.target.value = "";
  };

  const onDragStart = (index) => setDraggedIndex(index);

  const onDragEnter = (index) => {
    if (draggedIndex === index) return;
    const newList = [...imageList];
    const draggedItem = newList[draggedIndex];
    newList.splice(draggedIndex, 1);
    newList.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    setImageList(newList);
  };

  const removeImage = (index) => {
    setImageList((prev) => prev.filter((_, i) => i !== index));
  };

  const setAsMain = (index) => {
    const newList = [...imageList];
    const selected = newList.splice(index, 1)[0];
    newList.unshift(selected);
    setImageList(newList);
  };

  return (
    <GridWrapper>
      <GridHeader>
        <h3>업로드된 이미지 ({imageList.length}/10)</h3>
        <span>드래그하여 순서를 변경하실 수 있어요</span>
      </GridHeader>

      <input
        type="file"
        multiple
        accept=".jpg, .jpeg, .png"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleImageUpload}
      />

      <ListGrid>
        {imageList.map((img, index) => (
          <ImageBox
            key={img.id}
            isMain={index === 0}
            draggable
            onDragStart={() => onDragStart(index)}
            onDragEnter={() => onDragEnter(index)}
            onDragEnd={() => setDraggedIndex(null)}
            onDragOver={(e) => e.preventDefault()}
            className={draggedIndex === index ? "dragging" : ""}
          >
            <OrderBadge>{index + 1}</OrderBadge>
            {img.isIcon ? (
              <div style={{ fontSize: "40px" }}>{img.preview}</div>
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

        {imageList.length < 10 && (
          <AddCard onClick={() => fileInputRef.current.click()}>
            <div className="plus">+</div>
            <span>이미지 추가</span>
            <div style={{ fontSize: "11px" }}>{imageList.length}/10</div>
          </AddCard>
        )}
      </ListGrid>
    </GridWrapper>
  );
}

export default ImageGrid;
