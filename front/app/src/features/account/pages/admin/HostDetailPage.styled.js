import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 20px;
  background-color: #f4efe6;
  min-height: 95.2%;
`;

export const HeaderCard = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #eee;
  padding: 24px 28px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  margin-bottom: 20px;
`;

export const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  flex-wrap: wrap;
`;

export const SubText = styled.span`
  font-size: 13px;
  color: #888;
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  background: ${({ $status }) =>
    $status === 'ACTIVE'
      ? '#E8F0DF'
      : $status === 'REVOKED'
        ? '#F7D4D1'
        : '#EEE'};
  color: ${({ $status }) =>
    $status === 'ACTIVE'
      ? '#5A6B4F'
      : $status === 'REVOKED'
        ? '#9B3A36'
        : '#888'};
`;

export const BusinessName = styled.h2`
  font-size: 26px;
  font-weight: 700;
  color: #333;
  margin: 0 0 10px 0;
`;

export const HostRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #555;
  flex-wrap: wrap;

  svg {
    font-size: 12px;
    color: #888;
  }
`;

export const Dot = styled.span`
  color: #ccc;
`;

export const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  font-size: 13px;
  color: #888;
`;

export const Stars = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #d9a441;
  font-size: 14px;

  strong {
    color: #333;
    font-weight: 700;
    font-size: 15px;
  }
`;

export const RevokedNotice = styled.div`
  margin-top: 16px;
  padding: 12px 16px;
  background: #fdf1f0;
  border-left: 3px solid #c9433d;
  border-radius: 4px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 13px;

  svg {
    color: #c9433d;
    margin-top: 3px;
    font-size: 16px;
    flex-shrink: 0;
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  strong {
    color: #9b3a36;
    font-weight: 600;
  }

  span {
    color: #666;
  }
`;

export const MemberLink = styled.div`
  margin-top: 16px;
  padding: 10px 14px;
  background: #faf8f3;
  border-radius: 6px;
  font-size: 13px;
  color: #7a8b71;
  cursor: pointer;
  transition: all 150ms ease;
  text-align: right;

  &:hover {
    background: #f1ede4;
    color: #5a6b4f;
  }
`;

// 통계 카드
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const StatBox = styled.div`
  background: white;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
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
  gap: 2px;
  min-width: 0;
  flex: 1;
`;

export const StatLabel = styled.span`
  font-size: 13px;
  color: #888;
`;

export const StatValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${(p) => (p.$warn ? '#C9433D' : '#333')};
`;

export const StatSub = styled.span`
  font-size: 12px;
  color: #888;
  margin-top: 2px;
`;

// 2컬럼 카드
export const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoCard = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #eee;
  padding: 22px 26px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  margin-bottom: 20px;
`;

export const CardTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  gap: 16px;
  flex-wrap: wrap;
`;

export const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    color: #7a8b71;
    font-size: 15px;
  }

  ${CardTitleRow} & {
    margin-bottom: 0;
  }
`;

export const InfoRow = styled.div`
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #f4f1eb;
  font-size: 14px;

  &:last-child {
    border-bottom: none;
  }
`;

export const Label = styled.span`
  width: 110px;
  color: #888;
  flex-shrink: 0;
`;

export const Value = styled.span`
  color: #333;
  flex: 1;
  word-break: break-all;
`;

export const VerifyBox = styled.div`
  margin-top: 14px;
  padding: 12px 14px;
  background: ${(p) => (p.$verified ? '#F0F6EA' : '#FEF6E8')};
  border-left: 3px solid ${(p) => (p.$verified ? '#7A8B71' : '#D9A441')};
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    color: ${(p) => (p.$verified ? '#7A8B71' : '#D9A441')};
    font-size: 16px;
    flex-shrink: 0;
  }

  strong {
    color: ${(p) => (p.$verified ? '#5A6B4F' : '#9B6A1F')};
    font-weight: 600;
    font-size: 13px;
  }
`;

// 매출 차트
export const RevenueChart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const RevenueBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
`;

export const RevenueMonth = styled.span`
  width: 70px;
  color: #888;
  flex-shrink: 0;
`;

export const RevenueBarTrack = styled.div`
  flex: 1;
  height: 22px;
  background: #faf8f3;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;

export const RevenueBarFill = styled.div`
  width: ${(p) => p.$width}%;
  height: 100%;
  background: linear-gradient(90deg, #a8b89f 0%, #7a8b71 100%);
  border-radius: 4px;
  transition: width 400ms ease;
`;

export const RevenueAmount = styled.span`
  width: 130px;
  text-align: right;
  color: #333;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
`;

// 운영 공간
export const EmptySpace = styled.div`
  text-align: center;
  padding: 30px 20px;
  color: #aaa;
  font-size: 14px;
  background: #faf8f3;
  border-radius: 8px;
`;

export const SpaceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const SpaceCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: #faf8f3;
  border: 1px solid #f0ece2;
  border-radius: 8px;
  gap: 14px;

  @media (max-width: 700px) {
    flex-wrap: wrap;
  }
`;

export const SpaceLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
  min-width: 0;
`;

export const SpaceIconWrap = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7a8b71;
  font-size: 16px;
  flex-shrink: 0;
`;

export const SpaceInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const SpaceName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const SpaceTypeBadge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  background: #e8f0df;
  color: #5a6b4f;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
`;

export const SpaceMeta = styled.div`
  font-size: 12px;
  color: #888;
  margin-top: 2px;
`;

export const SpaceStatus = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${(p) => (p.$active ? '#5A6B4F' : '#888')};
  white-space: nowrap;
  flex-shrink: 0;
`;

// 위험 작업 영역
export const DangerZone = styled.div`
  background: white;
  border: 1.5px solid #f4c5c2;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
`;

export const DangerHeader = styled.div`
  padding: 16px 24px;
  background: #fdf1f0;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #f4c5c2;

  svg {
    font-size: 18px;
    color: #c9433d;
  }
`;

export const DangerTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #c9433d;
`;

export const DangerDesc = styled.div`
  font-size: 12px;
  color: #888;
  margin-top: 2px;
`;

export const DangerBody = styled.div`
  padding: 20px 24px;
`;

export const DangerItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const DangerItemTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

export const DangerItemDesc = styled.div`
  font-size: 13px;
  color: #888;
  margin-top: 4px;
  line-height: 1.5;
`;

export const DangerBtn = styled.button`
  padding: 10px 18px;
  background: #fff;
  color: #c9433d;
  border: 1.5px solid #c9433d;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 150ms ease;
  flex-shrink: 0;

  &:hover {
    background: #c9433d;
    color: white;
  }
`;

// 자격 복원 액션 카드
export const ActionCard = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #eee;
  padding: 18px 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

export const ActionInfo = styled.div`
  flex: 1;
  min-width: 220px;
  font-size: 14px;
  color: #555;
  line-height: 1.5;
`;

export const RestoreBtn = styled.button`
  padding: 10px 18px;
  background: #7a8b71;
  color: white;
  border: 1.5px solid #7a8b71;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 150ms ease;
  flex-shrink: 0;

  &:hover {
    background: #6b7a63;
  }
`;

// 모달 — 자격 취소
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
  max-width: 500px;
  max-height: 92vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
`;

export const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${(p) => (p.$danger ? '#C9433D' : '#333')};
  margin: 0 0 8px 0;
`;

export const ModalDesc = styled.div`
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 20px 0;

  strong {
    color: #333;
    font-weight: 600;
  }
`;

export const ImpactBox = styled.div`
  background: #fef6e8;
  border-left: 3px solid #d9a441;
  border-radius: 6px;
  padding: 14px 16px;
  margin-bottom: 18px;
`;

export const ImpactTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #9b6a1f;
  margin-bottom: 10px;
  svg {
    font-size: 12px;
  }
`;

export const ImpactItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  font-size: 13px;

  &:not(:last-child) {
    border-bottom: 1px dashed #f0e3c8;
  }
`;

export const ImpactLabel = styled.span`
  color: #666;
`;

export const ImpactValue = styled.span`
  color: #333;
  strong {
    font-weight: 600;
  }
`;

export const ImpactWarn = styled.span`
  color: #c9433d;
  strong {
    color: #c9433d;
    font-weight: 700;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 16px;
`;

export const FormLabel = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #555;
  margin-bottom: 6px;
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid #e8e6e0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  font-family: inherit;
  transition: border-color 200ms ease;

  &:focus {
    border-color: #a8b89f;
    box-shadow: 0 0 0 2px rgba(168, 184, 159, 0.2);
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

  strong {
    color: #c9433d;
    font-weight: 600;
  }
`;

export const CheckRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  input {
    cursor: pointer;
  }
  label {
    font-size: 13px;
    color: #555;
    cursor: pointer;
  }
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
    background: ${p.disabled ? '#E8B5B2' : '#C9433D'};
    color: white;
    border: 1px solid ${p.disabled ? '#E8B5B2' : '#C9433D'};
    ${p.disabled ? 'cursor: not-allowed;' : ''}
    &:hover:not(:disabled) { background: #B33A35; }
  `
      : `
    background: #fff;
    color: #666;
    border: 1px solid #ddd;
    &:hover { background: #f9faf8; }
  `}
`;
