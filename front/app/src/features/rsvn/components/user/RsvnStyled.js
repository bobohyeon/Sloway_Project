import styled from 'styled-components';

// ── 공통 색상 ──────────────────────────────────
export const COLOR = {
  green: '#2D6A4F',
  greenLight: '#EEF5EE',
  sage: '#A8B89F',
  cream: '#F4EFE6',
  terra: '#C97D4C',
  orange: '#E65100',
  red: '#C0392B',
  gray100: '#F7F7F7',
  gray200: '#E5E5E5',
  gray400: '#A0A0A0',
  gray600: '#666',
  black: '#1A1A1A',
};

// ── 탭 (팀 확정 스타일) ───────────────────────
export const TabBar = styled.div`
  display: flex;
  border-bottom: 1px solid ${COLOR.gray200};
  margin-bottom: 20px;
`;

export const TabBtn = styled.button`
  padding: 10px 16px;
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  color: ${({ $active }) => ($active ? COLOR.black : '#AAAAAA')};
  background: none;
  border: none;
  border-bottom: 2.5px solid
    ${({ $active }) => ($active ? COLOR.green : 'transparent')};
  margin-bottom: -1px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
`;

export const TabCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 700;
  background: ${({ $active }) => ($active ? COLOR.green : '#DDDDDD')};
  color: ${({ $active }) => ($active ? '#fff' : '#999')};
`;

// ── 페이지 공통 ───────────────────────────────
export const PageTitle = styled.h2`
  font-size: 26px;
  font-weight: 700;
  color: ${COLOR.black};
  margin-bottom: 4px;
`;

export const PageSub = styled.p`
  font-size: 13px;
  color: ${COLOR.gray400};
  margin-bottom: 28px;
`;

export const BackLink = styled.button`
  font-size: 13px;
  color: ${COLOR.gray400};
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  &:hover {
    color: ${COLOR.black};
  }
`;

// ── 버튼 ─────────────────────────────────────
export const BtnPrimary = styled.button`
  padding: 8px 18px;
  border-radius: 8px;
  background: ${COLOR.green};
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  &:hover {
    background: #1a3a2a;
  }
`;

export const BtnOutline = styled.button`
  padding: 8px 18px;
  border-radius: 8px;
  background: #fff;
  color: ${COLOR.black};
  font-size: 13px;
  border: 1px solid ${COLOR.gray200};
  cursor: pointer;
  &:hover {
    border-color: ${COLOR.sage};
  }
`;

export const BtnSm = styled.button`
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid ${COLOR.gray200};
  background: #fff;
  cursor: pointer;
  &:hover {
    border-color: ${COLOR.sage};
  }
`;

// ── 카드 ─────────────────────────────────────
export const Card = styled.div`
  background: #fff;
  border: 1px solid ${COLOR.gray200};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }
`;

export const CardRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const Thumb = styled.div`
  width: 56px;
  height: 56px;
  background: ${COLOR.cream};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  flex-shrink: 0;
`;

export const CardBody = styled.div`
  flex: 1;
  min-width: 0;
`;

export const TagRow = styled.div`
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-bottom: 5px;
`;

export const Tag = styled.span`
  font-size: 11px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 4px;
`;

export const CardTitle = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: ${COLOR.black};
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CardMeta = styled.div`
  font-size: 12px;
  color: ${COLOR.gray400};
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

export const CardRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  flex-shrink: 0;
`;

export const Price = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: ${COLOR.black};
`;

// ── 섹션 박스 ─────────────────────────────────
export const SectionBox = styled.div`
  background: #fff;
  border: 1px solid ${COLOR.gray200};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
`;

export const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: ${COLOR.black};
  margin-bottom: 16px;
`;

// ── 스탯 카드 ─────────────────────────────────
export const StatCards = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 24px;
`;

export const StatCard = styled.div`
  background: #fff;
  border: 1px solid ${({ $accent }) => $accent || COLOR.gray200};
  border-radius: 12px;
  padding: 18px 20px;
`;

export const StatLabel = styled.div`
  font-size: 12px;
  color: ${COLOR.gray400};
  margin-bottom: 8px;
`;

export const StatValue = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: ${({ $color }) => $color || COLOR.black};
`;

// ── 인포 그리드 ───────────────────────────────
export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 40px;
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const InfoLabel = styled.span`
  font-size: 11px;
  color: ${COLOR.gray400};
`;

export const InfoValue = styled.span`
  font-size: 14px;
  color: ${COLOR.black};
`;

// ── 페이지네이션 ──────────────────────────────
export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 20px;
`;

export const PageBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid ${({ $active }) => ($active ? COLOR.green : COLOR.gray200)};
  background: ${({ $active }) => ($active ? COLOR.green : '#fff')};
  color: ${({ $active }) => ($active ? '#fff' : '#555')};
  font-size: 13px;
  cursor: pointer;
`;
