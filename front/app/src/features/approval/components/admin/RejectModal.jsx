import styled from 'styled-components';
import ReactDOM from 'react-dom';

const Overlay = styled.div`
  /* 브라우저 뷰포트 기준 절대 고정 */
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  /* Flexbox 정중앙 정렬 (필수) */
  display: flex;
  align-items: center;
  justify-content: center;

  /* 다른 요소보다 최상위 보장 */
  z-index: 99999;
`;
// 2. 보더와 그림자를 강조한 모달 스타일
const ModalContent = styled.div`
  background: white;
  padding: 32px;
  /* 블러 제거, 보더 강조 */
  border: 2px solid #768966;
  border-radius: 20px;
  /* 그림자는 아주 은은하게 */
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
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

  textarea {
    width: 100%;
    height: 120px;
    padding: 12px;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 10px;
    resize: none;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
    &:focus {
      border-color: #768966;
    }
  }

  .btn-group {
    display: flex;
    gap: 10px;
  }

  button {
    flex: 1;
    padding: 12px;
    border-radius: 10px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &.cancel {
      background: #fcfcfc;
      border: 1px solid #eee;
      color: #666;
    }
    &.confirm {
      background: #768966;
      color: white;
    }

    &:hover {
      filter: brightness(0.95);
    }
  }
`;

const RejectModal = ({ isOpen, onClose, reason, setReason, onConfirm }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <Overlay>
      <ModalContent>
        <div className="icon">⚠️</div>
        <h3>공간 반려 사유</h3>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="반려 사유를 입력해주세요."
        />
        <div className="btn-group">
          <button className="cancel" onClick={onClose}>
            취소
          </button>
          <button className="confirm" onClick={onConfirm}>
            반려 완료
          </button>
        </div>
      </ModalContent>
    </Overlay>,
    document.body
  );
};

export default RejectModal;
