import React from "react";
import styled from "styled-components";

const SubmitButton = styled.button`
  width: 100%;
  padding: 18px;
  background-color: #768966; // 사진 속 차분한 카키/올리브 색상
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 20px;
  transition: background 0.2s;
  &:hover {
    background-color: #627254;
  }
`;

function InsertButton() {
  return (
    <SubmitButton onClick={() => console.log(formData)}>
      다음 · 공간 상세
    </SubmitButton>
  );
}

export default InsertButton;
