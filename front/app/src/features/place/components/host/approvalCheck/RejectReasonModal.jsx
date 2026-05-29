import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { FaExclamationCircle } from 'react-icons/fa';

// 1. 화면 전체를 덮는 Overlay (fixed로 뷰포트 기준 고정)
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
`;

// 2. 모달 컨텐츠 스타일
const ModalContent = styled.div`
  background: white;
  padding: 32px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border-radius: 20px;
  width: 500px;
  text-align: center;

  .icon {
    font-size: 40px;
    color: #e57373;
    margin-bottom: 16px;
  }
  h3 {
    margin: 0 0 12px 0;
    color: #333;
  }
  p {
    color: #666;
    line-height: 1.6;
    margin-bottom: 24px;
    white-space: pre-wrap;
  }

  button {
    width: 100%;
    padding: 12px;
    border-radius: 10px;
    border: none;
    background: #768966;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: #647755;
    }
  }
`;

function RejectReasonModal({ isOpen, reason, onClose }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <Overlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <FaExclamationCircle className="icon" />
        <h3>반려 사유</h3>
        <p>
          {reason || (
            <>
              반려 사유가 입력되지 않았습니다.
              <br />
              자세한 내용은 고객센터로 문의 부탁드립니다.
            </>
          )}
        </p>
        <button onClick={onClose}>확인</button>
      </ModalContent>
    </Overlay>,
    document.body // document.body에 붙임
  );
}

export default RejectReasonModal;
