import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import {
  findPointBalanceByMemberNo,
  findPointsByMemberNo,
} from '../../api/pointApi';
import { useAuth } from '../../../auth/hooks/useAuth';

const POLICIES = [
  { label: '적립률', value: '결제 금액의 1%' },
  { label: '적립 시점', value: '이용 완료 후 7일 뒤 확정' },
  { label: '유효 기간', value: '적립일로부터 1년' },
  { label: '최소 사용', value: '1,000P 이상' },
  { label: '최대 사용', value: '결제 금액의 30%까지' },
  { label: '환산 기준', value: '1P = 1원' },
];

const DEAL_LABEL = {
  EARN: '적립',
  USE: '사용',
};

const STATUS_LABEL = {
  WAIT: '적립 예정',
  SAVE: '적립 완료',
  USED: '사용 완료',
  EXPIRATION: '만료',
  CANCEL: '취소',
};

const formatDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
};

export default function PointHistory() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const memberNo = user?.memberNo;

  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!memberNo) {
      navigate('/login', { replace: true });
      return;
    }
    const load = async () => {
      setLoading(true);
      // 잔액·내역을 독립 처리 — 한쪽이 실패해도 다른 쪽은 표시 (allSettled)
      const [balanceR, historyR] = await Promise.allSettled([
        findPointBalanceByMemberNo(memberNo),
        findPointsByMemberNo(memberNo),
      ]);

      if (balanceR.status === 'fulfilled') {
        setBalance(balanceR.value?.balance ?? 0);
      }

      if (historyR.status === 'fulfilled') {
        setHistory(historyR.value ?? []);
        setError(null);
      } else {
        console.error('포인트 내역 조회 실패', historyR.reason);
        setError(
          historyR.reason?.response?.data?.msg ??
            '포인트 내역을 불러오지 못했습니다.'
        );
      }

      setLoading(false);
    };
    load();
  }, [memberNo, navigate]);

  return (
    <PageLayout
      title="포인트 내역"
      description="포인트 적립·사용 내역을 확인하세요"
    >
      <BalanceCard>
        <BalanceLabel>보유 포인트</BalanceLabel>
        <BalanceAmount>
          {loading ? '불러오는 중…' : `${Number(balance).toLocaleString()}P`}
        </BalanceAmount>
        {error && (
          <BalanceError>잔액을 불러오지 못했습니다 — {error}</BalanceError>
        )}
        <BalanceHint>1P = 1원으로 결제 시 사용할 수 있어요</BalanceHint>
      </BalanceCard>

      <Section>
        <SectionTitle>포인트 정책</SectionTitle>
        <PolicyTable>
          {POLICIES.map((policy) => (
            <PolicyRow key={policy.label}>
              <PolicyLabel>{policy.label}</PolicyLabel>
              <PolicyValue>{policy.value}</PolicyValue>
            </PolicyRow>
          ))}
        </PolicyTable>
      </Section>

      <Section>
        <SectionTitle>적립·사용 내역</SectionTitle>
        {history.length === 0 ? (
          <EmptyBox>
            <EmptyIcon>📋</EmptyIcon>
            <EmptyTitle>아직 표시할 내역이 없어요</EmptyTitle>
            <EmptyDesc>
              결제 후 적립이 시작되면 이 영역에서 적립·사용·만료 내역을 확인할
              수 있어요.
            </EmptyDesc>
          </EmptyBox>
        ) : (
          <HistoryList>
            {history.map((item) => (
              <HistoryRow key={item.no}>
                <HistoryLeft>
                  <DealBadge $deal={item.dealType}>
                    {DEAL_LABEL[item.dealType] ?? item.dealType}
                  </DealBadge>
                  <HistoryMeta>
                    <HistoryStatus>
                      {STATUS_LABEL[item.status] ?? item.status}
                    </HistoryStatus>
                    <HistoryDate>{formatDate(item.createdAt)}</HistoryDate>
                  </HistoryMeta>
                </HistoryLeft>
                <HistoryAmount $positive={item.amount > 0}>
                  {item.amount > 0 ? '+' : ''}
                  {Number(item.amount).toLocaleString()}P
                </HistoryAmount>
              </HistoryRow>
            ))}
          </HistoryList>
        )}
      </Section>
    </PageLayout>
  );
}

const BalanceCard = styled.div`
  background: var(--sage);
  color: var(--white);
  border-radius: var(--radius-lg);
  padding: var(--space-8) var(--space-6);
  text-align: center;
  margin-bottom: var(--space-6);
`;

const BalanceLabel = styled.div`
  font-size: 14px;
  opacity: 0.85;
  margin-bottom: var(--space-2);
`;

const BalanceAmount = styled.div`
  font-size: 36px;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-bottom: var(--space-2);
`;

const BalanceError = styled.div`
  font-size: 13px;
  background: rgba(255, 255, 255, 0.18);
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-3);
  margin: var(--space-3) auto 0;
  display: inline-block;
`;

const BalanceHint = styled.div`
  font-size: 13px;
  opacity: 0.8;
  margin-top: var(--space-2);
`;

const Section = styled.section`
  margin-bottom: var(--space-6);
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: var(--gray800);
  margin: 0 0 var(--space-3);
`;

const PolicyTable = styled.div`
  background: var(--white);
  border: 1px solid var(--gray200);
  border-radius: var(--radius-md);
  overflow: hidden;
`;

const PolicyRow = styled.div`
  display: flex;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--gray100);
  font-size: 14px;

  &:last-child {
    border-bottom: none;
  }
`;

const PolicyLabel = styled.div`
  flex: 0 0 120px;
  color: var(--gray600);
  font-weight: 500;
`;

const PolicyValue = styled.div`
  flex: 1;
  color: var(--gray800);
`;

const EmptyBox = styled.div`
  background: var(--gray100);
  border-radius: var(--radius-md);
  padding: var(--space-10) var(--space-6);
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 40px;
  margin-bottom: var(--space-3);
`;

const EmptyTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: var(--gray800);
  margin-bottom: var(--space-2);
`;

const EmptyDesc = styled.div`
  font-size: 13px;
  color: var(--gray600);
  line-height: 1.5;
`;

const HistoryList = styled.div`
  background: var(--white);
  border: 1px solid var(--gray200);
  border-radius: var(--radius-md);
  overflow: hidden;
`;

const HistoryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--gray100);

  &:last-child {
    border-bottom: none;
  }
`;

const HistoryLeft = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
`;

const DealBadge = styled.span`
  flex: 0 0 auto;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 600;
  color: var(--white);
  background: ${({ $deal }) =>
    $deal === 'EARN' ? 'var(--sage)' : 'var(--gray600)'};
`;

const HistoryMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const HistoryStatus = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--gray800);
`;

const HistoryDate = styled.span`
  font-size: 12px;
  color: var(--gray600);
`;

const HistoryAmount = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: ${({ $positive }) => ($positive ? 'var(--sage)' : 'var(--gray800)')};
`;
