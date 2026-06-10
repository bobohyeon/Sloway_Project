import styled from 'styled-components';

export const CardStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 560px;
`;

export const Card = styled.section`
  background: #fff;
  border: 1px solid #e8e4dc;
  border-radius: 16px;
  padding: 28px;
`;

/* 이전 반려 사유 안내 박스 (HostStatusPage의 RejectBox 톤) */
export const RejectBox = styled.div`
  padding: 16px 18px;
  background: rgba(226, 75, 74, 0.06);
  border: 1px solid rgba(226, 75, 74, 0.2);
  border-radius: 10px;
`;

export const RejectTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #e24b4a;
  margin-bottom: 6px;
`;

export const RejectText = styled.p`
  font-size: 13px;
  color: var(--gray-800);
  line-height: 1.6;
  white-space: pre-wrap;
`;

export const SectionTitle = styled.h3`
  font-size: 11px;
  font-weight: 600;
  color: #a8b89f;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e8efe5;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 18px;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

export const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-800);
`;

export const Input = styled.input`
  height: 44px;
  padding: 0 14px;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  font-size: 14px;
  color: var(--gray-800);

  &:focus {
    outline: none;
    border-color: var(--sage);
  }
`;

/* 파일 첨부 — HostApplyPage 패턴 (숨은 input + label 버튼) */
export const FileBox = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const FileName = styled.div`
  flex: 1;
  height: 44px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  font-size: 13px;
  color: var(--gray-400);
  background: #fff;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const FileBtn = styled.label`
  height: 44px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  background: var(--sage);
  color: #fff;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  flex-shrink: 0;
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const Hint = styled.p`
  font-size: 12px;
  color: var(--gray-400);
  line-height: 1.6;
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
`;

export const PrimaryBtn = styled.button`
  height: 44px;
  padding: 0 28px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: var(--sage);
  color: #fff;

  &:hover {
    opacity: 0.9;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const GhostBtn = styled.button`
  height: 44px;
  padding: 0 28px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--gray-200);
  background: #fff;
  color: var(--gray-800);

  &:hover {
    border-color: var(--gray-400);
  }
`;

export const Loading = styled.div`
  padding: 60px 20px;
  text-align: center;
  color: var(--gray-400);
  font-size: 14px;
`;
