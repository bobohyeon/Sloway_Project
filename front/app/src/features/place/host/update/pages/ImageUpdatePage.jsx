import React, { useState } from "react";
import styled from "styled-components";
import ImageUploadGuide from "../components/ImageUploadGuide";
import ImageGrid from "../components/ImageGrid";

const PageWrapper = styled.div`
  background-color: #f8f9f6;
  min-height: 100vh;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1100px;
`;

const Header = styled.div`
  margin-bottom: 30px;
  h1 {
    font-size: 28px;
    color: #333;
    margin-bottom: 8px;
  }
  p {
    color: #888;
    font-size: 14px;
  }
`;

const BackLink = styled.div`
  color: #888;
  font-size: 14px;
  margin-bottom: 20px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

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
  return (
    <PageWrapper>
      <Container>
        <Header>
          <h1>공간 이미지 관리</h1>
          <p>대표 이미지와 추가 이미지를 관리하세요</p>
        </Header>

        <BackLink>← 내 공간 목록</BackLink>

        {/* 2. 이미지 업로드 가이드 */}
        <ImageUploadGuide />

        {/* 3. 이미지 그리드 영역 */}
        <ImageGrid />

        <FooterAction>
          <SaveButton>변경 검수 요청</SaveButton>
        </FooterAction>
      </Container>
    </PageWrapper>
  );
}

export default ImageUpdatePage;
