import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 20px;
  background-color: #f4efe6;
  min-height: 95.2%;
`;

export const Loading = styled.div`
  padding: 60px 20px;
  text-align: center;
  color: #999;
  font-size: 14px;
`;

export const BackBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  margin-bottom: 16px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  color: #555;
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  transition: all 150ms ease;

  &:hover {
    border-color: #a8b89f;
    color: #333;
    background: #f9faf8;
  }
`;

export const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  border: 1px solid #eee;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
`;

export const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const PageTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

export const StateBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  background: ${({ $state }) =>
    $state === 'PENDING'
      ? '#FBE4C2'
      : $state === 'APPROVED'
        ? '#E8F0DF'
        : $state === 'REJECTED'
          ? '#F7D4D1'
          : '#EEE'};
  color: ${({ $state }) =>
    $state === 'PENDING'
      ? '#9B6A1F'
      : $state === 'APPROVED'
        ? '#5A6B4F'
        : $state === 'REJECTED'
          ? '#9B3A36'
          : '#888'};
`;

export const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f4f1eb;

  &:last-child {
    border-bottom: none;
  }
`;

export const InfoLabel = styled.div`
  width: 130px;
  font-size: 13px;
  color: #999;
  flex-shrink: 0;
`;

export const InfoValue = styled.div`
  flex: 1;
  font-size: 14px;
  color: #444;
`;

export const DocBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #f5f8f1;
  border: 1.5px solid #a8b89f;
  border-radius: 8px;
  color: #5a6b4f;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 150ms ease;

  &:hover {
    background: #ebf0e4;
  }
`;

export const NoDoc = styled.div`
  padding: 12px;
  color: #aaa;
  font-size: 14px;
`;

export const CheckItem = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  border: 1.5px solid ${(p) => (p.$checked ? '#a8b89f' : '#e8e6e0')};
  background: ${(p) => (p.$checked ? '#f5f8f1' : '#fff')};
  border-radius: 8px;
  cursor: pointer;
  transition: all 150ms ease;

  &:hover {
    border-color: #a8b89f;
  }
`;

export const CheckBox = styled.input`
  width: 18px;
  height: 18px;
  margin-top: 2px;
  accent-color: #7a8b71;
  cursor: pointer;
  flex-shrink: 0;
`;

export const CheckText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const CheckLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

export const CheckDesc = styled.span`
  font-size: 12px;
  color: #999;
`;

export const ProcessedNotice = styled.div`
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
  background: ${(p) => (p.$variant === 'approved' ? '#E8F0DF' : '#F7D4D1')};
  color: ${(p) => (p.$variant === 'approved' ? '#5A6B4F' : '#9B3A36')};

  strong {
    display: block;
    margin-bottom: 4px;
    font-size: 15px;
  }
`;

export const ActionBar = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
`;

export const ActionBtn = styled.button`
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  transition: all 150ms ease;

  ${(p) =>
    p.$approve
      ? `
      background: #7A8B71;
      color: white;
      border: 1px solid #7A8B71;
      &:hover:not(:disabled) { background: #6B7A63; }
      &:disabled { opacity: 0.4; cursor: not-allowed; }
    `
      : `
      background: #fff;
      color: #C9433D;
      border: 1px solid #E8B5B2;
      &:hover { background: #FDF1F0; }
    `}
`;

// 반려 모달
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

export const ModalCard = styled.div`
  background: white;
  border-radius: 14px;
  padding: 28px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
`;

export const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
`;

export const ModalDesc = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 16px 0;

  strong {
    color: #333;
  }
`;

export const FormTextarea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid #e8e6e0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  font-family: inherit;
  resize: vertical;

  &:focus {
    border-color: #a8b89f;
    box-shadow: 0 0 0 2px rgba(168, 184, 159, 0.2);
  }
`;

export const HelpText = styled.div`
  font-size: 12px;
  color: #aaa;
  margin-top: 4px;
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
`;

export const ModalBtn = styled.button`
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 150ms ease;

  ${(p) =>
    p.$danger
      ? `
    background: #C9433D;
    color: white;
    border: 1px solid #C9433D;
    &:hover { background: #B33A35; }
  `
      : `
    background: #fff;
    color: #666;
    border: 1px solid #ddd;
    &:hover { background: #f9faf8; }
  `}
`;
