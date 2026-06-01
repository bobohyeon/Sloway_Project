import styled from 'styled-components';

export const CardStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Card = styled.section`
  background: #fff;
  border: 1px solid #e8e4dc;
  border-radius: 16px;
  padding: 28px;
`;

export const StatusCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 28px;
`;

export const StatusIconWrap = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: ${(p) => p.$bg};
  color: ${(p) => p.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  margin-bottom: 16px;
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 600;
  background: ${(p) => p.$bg};
  color: ${(p) => p.$color};
  margin-bottom: 12px;
`;

export const StatusTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 8px;
`;

export const StatusDesc = styled.p`
  font-size: 13px;
  color: var(--gray-400);
  line-height: 1.7;
`;

export const RejectBox = styled.div`
  width: 100%;
  margin-top: 24px;
  padding: 16px 18px;
  background: rgba(226, 75, 74, 0.06);
  border: 1px solid rgba(226, 75, 74, 0.2);
  border-radius: 10px;
  text-align: left;
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
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e8efe5;
`;

export const InfoRow = styled.div`
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f5f3ef;
  font-size: 13px;
  &:last-child {
    border-bottom: none;
  }
`;

export const InfoLabel = styled.span`
  width: 130px;
  flex-shrink: 0;
  color: var(--gray-400);
`;

export const InfoValue = styled.span`
  flex: 1;
  color: var(--gray-800);
  font-weight: 500;
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
