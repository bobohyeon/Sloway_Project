import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 20px;
  background-color: #f4efe6;
  min-height: 95.2%;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
  margin-bottom: 20px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  border: ${(p) => (p.$active ? '2px solid #a8b89f' : '1px solid #eee')};
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  transition: all 200ms ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  }
`;

export const StatIcon = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: ${(p) => p.$bg};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
`;

export const StatBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const StatLabel = styled.span`
  font-size: 13px;
  color: #888;
`;

export const StatValue = styled.span`
  font-size: 22px;
  font-weight: 700;
  color: #333;
`;

export const FilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: white;
  padding: 14px 20px;
  border-radius: 12px;
  border: 1px solid #eee;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  gap: 16px;
  flex-wrap: wrap;
`;

export const SearchWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 240px;
  padding: 8px 14px;
  border: 1.5px solid #e8e6e0;
  border-radius: 8px;
  background: #fff;
  transition: all 200ms ease;

  &:focus-within {
    border-color: #a8b89f;
    box-shadow: 0 0 0 2px rgba(168, 184, 159, 0.2);
  }

  svg {
    color: #aaa;
    flex-shrink: 0;
  }
`;

export const SearchInput = styled.input`
  border: none;
  outline: none;
  font-size: 14px;
  width: 100%;
  background: transparent;
  color: #333;

  &::placeholder {
    color: #bbb;
  }
`;

export const FilterRight = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

export const StyledSelect = styled.select`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1.5px solid #a8b89f;
  background-color: #fff;
  color: #555;
  font-size: 14px;
  outline: none;
  cursor: pointer;
  transition: all 200ms ease;

  &:hover {
    border-color: #86927e;
    background-color: #f9faf8;
  }

  &:focus {
    box-shadow: 0 0 0 2px rgba(168, 184, 159, 0.2);
  }
`;

export const TableWrap = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #eee;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

export const Th = styled.th`
  background: #faf8f3;
  color: #555;
  font-weight: 600;
  text-align: left;
  padding: 14px 16px;
  border-bottom: 1px solid #eee;
  white-space: nowrap;
  width: ${(p) => p.$w || 'auto'};
`;

export const Td = styled.td`
  padding: 14px 16px;
  border-bottom: 1px solid #f4f1eb;
  color: #444;
  vertical-align: middle;
`;

export const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #aaa;
  font-size: 14px;
`;

export const Badge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  background: ${(p) => (p.$variant === 'host' ? '#FFE9C2' : '#E8F0DF')};
  color: ${(p) => (p.$variant === 'host' ? '#B07A19' : '#5A6B4F')};
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  background: ${({ $status }) =>
    $status === 'ACTIVE'
      ? '#E8F0DF'
      : $status === 'SUSPENDED'
        ? '#FBE4C2'
        : $status === 'BANNED'
          ? '#F7D4D1'
          : '#EEE'};
  color: ${({ $status }) =>
    $status === 'ACTIVE'
      ? '#5A6B4F'
      : $status === 'SUSPENDED'
        ? '#9B6A1F'
        : $status === 'BANNED'
          ? '#9B3A36'
          : '#888'};
`;

export const ActionGroup = styled.div`
  display: flex;
  gap: 6px;
`;

export const ActionBtn = styled.button`
  padding: 6px 12px;
  font-size: 13px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 150ms ease;
  font-family: inherit;

  ${(p) =>
    p.$danger
      ? `
      background: #fff;
      color: #C9433D;
      border: 1px solid #E8B5B2;
      &:hover { background: #FDF1F0; }
    `
      : p.$primary
        ? `
      background: #7A8B71;
      color: white;
      border: 1px solid #7A8B71;
      &:hover { background: #6B7A63; }
    `
        : `
      background: #fff;
      color: #555;
      border: 1px solid #ddd;
      &:hover { background: #f9faf8; border-color: #a8b89f; color: #333; }
    `}
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 24px;
`;

export const PageBtn = styled.button`
  min-width: 36px;
  height: 36px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid ${(p) => (p.$active ? '#a8b89f' : '#e0ddd5')};
  background: ${(p) => (p.$active ? '#a8b89f' : '#fff')};
  color: ${(p) => (p.$active ? '#fff' : '#555')};
  cursor: pointer;
  font-size: 13px;
  font-weight: ${(p) => (p.$active ? '600' : '400')};
  font-family: inherit;
  transition: all 150ms ease;

  &:hover:not(:disabled) {
    border-color: #a8b89f;
    color: ${(p) => (p.$active ? '#fff' : '#7A8B71')};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

// ─── 모달 ───
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
  padding: 28px 28px 24px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  animation: modalIn 200ms ease-out;

  @keyframes modalIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
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
  margin: 0 0 20px 0;

  strong {
    color: #333;
    font-weight: 600;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 16px;
`;

export const SuspendOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SuspendOptionCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1.5px solid
    ${(p) => (p.$active ? (p.$danger ? '#C9433D' : '#a8b89f') : '#e8e6e0')};
  background: ${(p) =>
    p.$active ? (p.$danger ? '#FDF1F0' : '#F5F8F1') : '#fff'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 150ms ease;

  &:hover {
    border-color: ${(p) => (p.$danger ? '#C9433D' : '#a8b89f')};
  }
`;

export const SuspendRadio = styled.span`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid
    ${(p) => (p.$active ? (p.$danger ? '#C9433D' : '#7A8B71') : '#cfcbc2')};
  flex-shrink: 0;
  position: relative;

  ${(p) =>
    p.$active &&
    `
    &::after {
      content: '';
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 7px; height: 7px;
      border-radius: 50%;
      background: ${p.$danger ? '#C9433D' : '#7A8B71'};
    }
  `}
`;

export const SuspendOptionLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${(p) => (p.$danger ? '#C9433D' : '#333')};
`;

export const SuspendOptionDesc = styled.div`
  font-size: 12px;
  color: #888;
  margin-top: 2px;
`;

export const FormLabel = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #555;
  margin-bottom: 6px;
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
  transition: border-color 200ms ease;

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
  margin-top: 8px;
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
