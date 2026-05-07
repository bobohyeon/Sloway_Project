import React, { useRef, useState } from "react";
import styled from "styled-components";

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
  border: 2px dashed ${(props) => (props.isMain ? "#d46a4f" : "#e0e0e0")};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: grab; /* 드래그 가능 표시 */
  overflow: hidden;
  position: relative;
  background-color: ${(props) => (props.isMain ? "#fff9f7" : "#fff")};
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:active {
    cursor: grabbing;
  }

  /* 드래그 중인 아이템 효과 */
  &.dragging {
    opacity: 0.5;
    transform: scale(0.95);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none; /* 이미지 클릭 방해 금지 */
  }
`;

const LabelWrap = styled.div`
  text-align: center;
  font-size: 13px;
  color: #aaa;
  pointer-events: none;

  .main-text {
    color: #d46a4f;
    font-weight: 600;
    margin-top: 5px;
  }
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

  // 이미지 업로드 로직 (JPG/JPEG 제한 포함)
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const allowedExtensions = ["jpg", "jpeg"];
    const filteredFiles = files.filter((file) => {
      const extension = file.name.split(".").pop().toLowerCase();
      return allowedExtensions.includes(extension);
    });

    if (filteredFiles.length !== files.length)
      alert("JPG, JPEG 파일만 업로드 가능합니다.");
    if (filteredFiles.length === 0) return;
    if (formData.images.length + filteredFiles.length > 10) {
      alert("최대 10장까지 가능합니다.");
      return;
    }

    const newImages = filteredFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
    e.target.value = "";
  };

  // --- 드래그 앤 드롭 핸들러 ---

  const onDragStart = (index) => {
    setDraggedIndex(index);
  };

  const onDragEnter = (index) => {
    if (draggedIndex === index) return;

    const newImages = [...formData.images];
    const draggedItem = newImages[draggedIndex];

    // 배열에서 삭제 후 새로운 위치에 삽입
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const onDragEnd = () => {
    setDraggedIndex(null);
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
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
        accept=".jpg, .jpeg"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleImageUpload}
      />

      <ImageGrid>
        {formData.images.map((img, index) => (
          <ImageBox
            key={img.preview} // 인덱스 대신 고유값 사용 권장
            isMain={index === 0}
            draggable
            onDragStart={() => onDragStart(index)}
            onDragEnter={() => onDragEnter(index)}
            onDragEnd={onDragEnd}
            onDragOver={(e) => e.preventDefault()} // 드롭 허용
            className={draggedIndex === index ? "dragging" : ""}
          >
            <img src={img.preview} alt={`upload-${index}`} />
            <RemoveButton
              onClick={(e) => {
                e.stopPropagation();
                removeImage(index);
              }}
            >
              ×
            </RemoveButton>
            {index === 0 && (
              <div
                style={{
                  position: "absolute",
                  bottom: "10px",
                  background: "#d46a4f",
                  color: "white",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontSize: "10px",
                  zIndex: 5,
                }}
              >
                대표
              </div>
            )}
          </ImageBox>
        ))}

        {formData.images.length < 10 && (
          <ImageBox
            isMain={formData.images.length === 0}
            onClick={() => fileInputRef.current.click()}
          >
            <LabelWrap>
              <span style={{ fontSize: "24px" }}>+</span>
              <div style={{ marginTop: "5px" }}>
                {formData.images.length === 0
                  ? "대표 이미지 등록"
                  : formData.images.length + 1}
              </div>
            </LabelWrap>
          </ImageBox>
        )}
      </ImageGrid>

      <InfoBar>💡 JPG/JPEG 형식의 고해상도 사진을 추천해요 (최대 10장)</InfoBar>

      <ButtonGroup>
        <PrevButton onClick={prev}>이전</PrevButton>
        <NextButton onClick={next}>다음 · 공개 설정</NextButton>
      </ButtonGroup>
    </FormCard>
  );
}

export default InsertImageComponent;
