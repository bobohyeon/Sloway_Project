import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import { Tabs, EmptyState } from '../../../pay_shared/components';
import { findCouponsByMemberNo } from '../../api/couponApi';
import { useAuth } from '../../../auth/hooks/useAuth';
import { Pagination } from '../../../pay_shared/components/Pagination';

const PAGE_SIZE = 12; // 카드 그리드라 한 페이지 12장

const emptyTitleByFilter = (filter) => {
  if (filter === 'available') return '사용 가능한 쿠폰이 없어요';
  if (filter === 'used') return '사용한 쿠폰이 없어요';
  return '만료된 쿠폰이 없어요';
};

const emptyDescByFilter = (filter) => {
  if (filter === 'available') return '이벤트에 참여해보세요';
  return '';
};

const STATUS_TO_UI = {
  AVAILABLE: 'available',
  USED: 'used',
  EXPIRED: 'expired',
  RETURNED: 'expired',
};

const STATUS_META = {
  available: { label: '사용 가능', color: 'var(--sage)' },
  used: { label: '사용 완료', color: 'var(--gray-400)' },
  expired: { label: '만료', color: 'var(--gray-400)' },
};

const formatDate = (date) =>
  `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(
    date.getDate()
  ).padStart(2, '0')}`;

const toCouponForUI = (resDto) => {
  const expiredAt = resDto.expiredAt ? new Date(resDto.expiredAt) : null;
  const usedAt = resDto.usedAt ? new Date(resDto.usedAt) : null;
  const daysLeft = expiredAt
    ? Math.ceil((expiredAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return {
    no: resDto.no,
    title: resDto.couponName,
    discountType: resDto.dcType === 'RATE' ? 'percent' : 'amount',
    discountValue: resDto.dcValue,
    expireDate: expiredAt ? formatDate(expiredAt) : '',
    usedAt: usedAt ? formatDate(usedAt) : '',
    daysLeft,
  };
};

// 할인값 표기 — 정률은 %, 정액은 천단위 콤마 + 원 (10,000원)
const formatDiscount = (c) =>
  c.discountType === 'percent'
    ? `${c.discountValue}%`
    : `${Number(c.discountValue ?? 0).toLocaleString()}원`;

export default function MyCoupons() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const memberNo = user?.memberNo;

  const [coupons, setCoupons] = useState([]);
  const [filter, setFilter] = useState('available');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!memberNo) {
      navigate('/login', { replace: true });
      return;
    }
    const load = async () => {
      try {
        const list = await findCouponsByMemberNo(memberNo);
        setCoupons(list);
      } catch (err) {
        console.error('보유 쿠폰 조회 실패', err);
      }
    };
    load();
  }, [memberNo, navigate]);

  const counts = useMemo(() => {
    const c = { available: 0, used: 0, expired: 0 };
    coupons.forEach((coupon) => {
      const key = STATUS_TO_UI[coupon.status];
      if (key) c[key] += 1;
    });
    return c;
  }, [coupons]);

  const filteredCoupons = useMemo(
    () =>
      coupons
        .filter((coupon) => STATUS_TO_UI[coupon.status] === filter)
        .map(toCouponForUI),
    [coupons, filter]
  );

  const totalPages = Math.ceil(filteredCoupons.length / PAGE_SIZE);
  const pagedCoupons = filteredCoupons.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const tabItems = [
    { value: 'available', label: '사용 가능', count: counts.available },
    { value: 'used', label: '사용 완료', count: counts.used },
    { value: 'expired', label: '만료', count: counts.expired },
  ];

  return (
    <PageLayout
      title="내 쿠폰"
      description="보유 중인 쿠폰을 확인하세요"
      backTo="/user/mypage"
      backLabel="마이페이지"
    >
      <TabsRow>
        <Tabs
          items={tabItems}
          value={filter}
          onChange={(v) => {
            setFilter(v);
            setPage(1);
          }}
        />
      </TabsRow>

      {filteredCoupons.length === 0 ? (
        <EmptyState
          icon="🎫"
          title={emptyTitleByFilter(filter)}
          description={emptyDescByFilter(filter)}
        />
      ) : (
        <>
          <CouponGrid>
            {pagedCoupons.map((coupon) => {
              const meta = STATUS_META[filter] ?? STATUS_META.expired;
              const isAvailable = filter === 'available';
              return (
                <CouponCard key={coupon.no} $dim={!isAvailable}>
                  <CardHeader>
                    <CardTitle>{coupon.title}</CardTitle>
                    <StatusBadge $color={meta.color}>{meta.label}</StatusBadge>
                  </CardHeader>

                  <Discount $dim={!isAvailable}>{formatDiscount(coupon)}</Discount>
                  <DiscountLabel>
                    {coupon.discountType === 'percent' ? '할인' : '즉시 할인'}
                  </DiscountLabel>

                  <CardBody>
                    <InfoRow>
                      <InfoLabel>유효기간</InfoLabel>
                      <InfoValue>{coupon.expireDate}까지</InfoValue>
                    </InfoRow>
                    {filter === 'used' && coupon.usedAt && (
                      <InfoRow>
                        <InfoLabel>사용일</InfoLabel>
                        <InfoValue>{coupon.usedAt}</InfoValue>
                      </InfoRow>
                    )}
                  </CardBody>

                  {isAvailable &&
                    coupon.daysLeft <= 7 &&
                    coupon.daysLeft > 0 && (
                      <FootTag>⏰ D-{coupon.daysLeft} 만료 임박</FootTag>
                    )}
                  {filter === 'expired' && <FootText>만료된 쿠폰이에요</FootText>}
                </CouponCard>
              );
            })}
          </CouponGrid>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onChange={(p) => {
              setPage(p);
              window.scrollTo(0, 0);
            }}
          />
        </>
      )}
    </PageLayout>
  );
}

const TabsRow = styled.div`
  margin-bottom: var(--space-5);
`;

const CouponGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-6);
`;

const CouponCard = styled.div`
  display: flex;
  flex-direction: column;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  gap: var(--space-2);
  transition: all 200ms ease;
  opacity: ${({ $dim }) => ($dim ? 0.7 : 1)};

  &:hover {
    border-color: ${({ $dim }) => ($dim ? 'var(--gray-200)' : 'var(--sage)')};
    transform: ${({ $dim }) => ($dim ? 'none' : 'translateY(-1px)')};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-2);
`;

const CardTitle = styled.h3`
  font-size: 0.98rem;
  font-weight: 600;
  color: var(--gray-900);
  margin: 0;
  flex: 1;
  word-break: keep-all;
`;

const StatusBadge = styled.span`
  padding: 3px 10px;
  border-radius: 999px;
  background: ${({ $color }) => $color};
  color: var(--white);
  font-size: 0.72rem;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
`;

const Discount = styled.div`
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 600;
  color: ${({ $dim }) => ($dim ? 'var(--gray-500)' : 'var(--sage)')};
  padding-top: var(--space-2);
`;

const DiscountLabel = styled.div`
  font-size: 0.76rem;
  color: var(--gray-400);
  margin-top: -4px;
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: var(--space-2);
  padding-top: var(--space-2);
  border-top: 1px solid var(--gray-100);
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.82rem;
`;

const InfoLabel = styled.span`
  color: var(--gray-500);
`;

const InfoValue = styled.span`
  color: var(--gray-800);
  font-weight: 500;
`;

const FootTag = styled.div`
  margin-top: var(--space-2);
  align-self: flex-start;
  padding: 3px 10px;
  background: rgba(184, 90, 78, 0.1);
  color: #a04c42;
  border-radius: var(--radius-full);
  font-size: 0.74rem;
  font-weight: 600;
  font-family: var(--font-mono);
`;

const FootText = styled.div`
  margin-top: var(--space-2);
  font-size: 0.78rem;
  color: var(--gray-400);
`;
