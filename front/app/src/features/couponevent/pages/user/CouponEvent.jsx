import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { Button, EmptyState } from '../../../pay_shared/components';
import { useAuth } from '../../../auth/hooks/useAuth';

import { downloadCoupon, findEventAll } from '../../api/couponEventApi';

const STATUS_INFO = {
  OPEN: { label: '게시중', color: 'var(--sage)' },
  CLOSED: { label: '종료됨', color: 'var(--gray-500)' },
  SOLDOUT: { label: '소진됨', color: 'var(--coral-500)' },
};

const formatDate = (iso) => {
  if (!iso) return '-';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
};

const formatDcValue = (dcType, dcValue) => {
  if (dcType === 'FIXED') return `${Number(dcValue).toLocaleString()}원`;
  if (dcType === 'RATE') return `${dcValue}%`;
  return `${dcValue}`;
};

export default function CouponEvent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const memberNo = user?.memberNo;

  const [events, setEvents] = useState([]);
  const [downloading, setDownloading] = useState(null); // 다운로드 처리 중인 게시 PK

  // handleDownload(발급 후 갱신)에서도 재사용 → useCallback으로 참조 고정
  const loadEvents = useCallback(async () => {
    try {
      const list = await findEventAll();
      setEvents(list);
    } catch (err) {
      console.error('쿠폰 게시 조회 실패', err);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await loadEvents();
    })();
  }, [loadEvents]);

  const handleDownload = async (no, couponName) => {
    if (downloading) return;
    // 게시 목록은 공개 — 발급(다운로드) 시점에만 로그인 요구
    if (!memberNo) {
      alert('쿠폰 발급은 로그인 후 이용할 수 있어요.');
      navigate('/login');
      return;
    }
    if (!window.confirm(`'${couponName}' 쿠폰을 발급받으시겠어요?`)) return;

    setDownloading(no);
    try {
      await downloadCoupon(no, memberNo);
      await loadEvents(); // 발급 현황 갱신
      alert('쿠폰이 발급됐어요. 쿠폰함에서 확인하세요.');
    } catch (err) {
      console.error('쿠폰 다운로드 실패', err);
      const msg = err?.response?.data?.msg ?? err.message;
      alert(`쿠폰 발급에 실패했어요.\n${msg}`);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <PageLayout
      title="쿠폰 발급"
      description="관리자가 게시한 쿠폰을 받아보세요"
      maxWidth={1000}
    >
      {events.length === 0 ? (
        <EmptyState
          icon="🎁"
          title="진행 중인 쿠폰 발급이 없어요"
          description="잠시 후 다시 확인해주세요"
        />
      ) : (
        <EventGrid>
          {events.map((ev) => {
            const statusInfo = STATUS_INFO[ev.status] ?? {
              label: ev.status,
              color: 'var(--gray-500)',
            };
            const remaining = Math.max(ev.totalCount - ev.issuedCount, 0);
            const progress =
              ev.totalCount > 0
                ? Math.round((ev.issuedCount / ev.totalCount) * 100)
                : 0;
            const canDownload =
              ev.status === 'OPEN' && downloading !== ev.no && remaining > 0;

            return (
              <EventCard key={ev.no}>
                <CardHeader>
                  <CardTitle>{ev.couponName}</CardTitle>
                  <StatusBadge $color={statusInfo.color}>
                    {statusInfo.label}
                  </StatusBadge>
                </CardHeader>

                <Discount>{formatDcValue(ev.dcType, ev.dcValue)}</Discount>

                <CardBody>
                  <InfoRow>
                    <InfoLabel>유효기간</InfoLabel>
                    <InfoValue>받은 날부터 {ev.validDays}일</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>게시 기간</InfoLabel>
                    <InfoValue>
                      {formatDate(ev.startAt)} ~ {formatDate(ev.endAt)}
                    </InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>남은 수량</InfoLabel>
                    <InfoValue>
                      {remaining} / {ev.totalCount}장
                    </InfoValue>
                  </InfoRow>
                  <ProgressBar>
                    <ProgressFill $width={progress} />
                  </ProgressBar>
                </CardBody>

                <CardFooter>
                  <Button
                    variant="primary"
                    onClick={() => handleDownload(ev.no, ev.couponName)}
                    disabled={!canDownload}
                    style={{ width: '100%' }}
                  >
                    {downloading === ev.no
                      ? '발급 중...'
                      : ev.status === 'OPEN'
                        ? '쿠폰 받기'
                        : statusInfo.label}
                  </Button>
                </CardFooter>
              </EventCard>
            );
          })}
        </EventGrid>
      )}

      <Notice>
        ⓘ 쿠폰은 1인 1장만 발급됩니다. 받은 쿠폰은 '쿠폰함'에서 확인하세요.
      </Notice>
    </PageLayout>
  );
}

const EventGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-4);
`;

const EventCard = styled.div`
  display: flex;
  flex-direction: column;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  gap: var(--space-3);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-2);
`;

const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--gray-900);
  margin: 0;
`;

const StatusBadge = styled.span`
  padding: 4px 10px;
  border-radius: 999px;
  background: ${({ $color }) => $color};
  color: var(--white);
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
`;

const Discount = styled.div`
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--sage);
  text-align: center;
  padding: var(--space-2) 0;
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
`;

const InfoLabel = styled.span`
  color: var(--gray-500);
`;

const InfoValue = styled.span`
  color: var(--gray-800);
  font-weight: 500;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: var(--gray-100);
  border-radius: 999px;
  overflow: hidden;
  margin-top: var(--space-1);
`;

const ProgressFill = styled.div`
  width: ${({ $width }) => $width}%;
  height: 100%;
  background: var(--sage);
  transition: width 200ms ease;
`;

const CardFooter = styled.div`
  padding-top: var(--space-2);
  border-top: 1px solid var(--gray-100);
`;

const Notice = styled.div`
  margin-top: var(--space-5);
  padding: var(--space-3) var(--space-4);
  background: var(--gray-100);
  border-radius: var(--radius-md);
  font-size: 0.82rem;
  color: var(--gray-600);
  line-height: 1.5;
`;
