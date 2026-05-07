import React from "react";
import styled from "styled-components";

const GuideBox = styled.div`
  background-color: #fcfcf9;
  border: 1px solid #f0f0e0;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;

  .title {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const GuideGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

const GuideItem = styled.div`
  display: flex;
  gap: 12px;
  .icon {
    font-size: 24px;
  }
  .text h4 {
    font-size: 14px;
    margin-bottom: 4px;
    color: #333;
  }
  .text p {
    font-size: 12px;
    color: #888;
    line-height: 1.4;
  }
`;

function ImageUploadGuide() {
  return (
    <GuideBox>
      <div className="title">📷 이미지 업로드 가이드</div>
      <GuideGrid>
        <GuideItem>
          <div className="icon">⚠️</div>
          <div className="text">
            <h4>JPG, JPEG파일</h4>
            <p>파일 형식에 맞게 업로드 해 주세요</p>
          </div>
        </GuideItem>
        <GuideItem>
          <div className="icon">💡</div>
          <div className="text">
            <h4>밝은 자연광</h4>
            <p>낮 시간대에 촬영된 사진이 좋아요</p>
          </div>
        </GuideItem>
        <GuideItem>
          <div className="icon">🎨</div>
          <div className="text">
            <h4>정돈된 공간</h4>
            <p>실제 체크인 시 모습을 보여주세요</p>
          </div>
        </GuideItem>
      </GuideGrid>
    </GuideBox>
  );
}

export default ImageUploadGuide;
