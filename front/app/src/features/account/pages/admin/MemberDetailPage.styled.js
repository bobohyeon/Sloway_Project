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

export const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

export const Avatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #a8b89f;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: 700;
  flex-shrink: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ProfileMeta = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const UserName = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: #333;
`;

export const SubText = styled.span`
  font-size: 14px;
  color: #888;
`;

export const RoleBadge = styled.span`
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
  gap: 8px;
  flex-shrink: 0;
`;

export const ActionBtn = styled.button`
  padding: 8px 16px;
  font-size: 13px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-family: inherit;
  transition: all 150ms ease;

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
      &:hover { background: #f9faf8; }
    `}
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
  width: 120px;
  font-size: 13px;
  color: #999;
  flex-shrink: 0;
`;

export const InfoValue = styled.div`
  flex: 1;
  font-size: 14px;
  color: #444;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const VerifyTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  background: ${(p) => (p.$ok ? '#E8F0DF' : '#F0EEE9')};
  color: ${(p) => (p.$ok ? '#5A6B4F' : '#999')};
`;
