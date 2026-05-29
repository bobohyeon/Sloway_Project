import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import { Tabs, EmptyState } from '../../../pay_shared/components';
import { CouponTicket } from '../../components/user/CouponTicket';
import { findCouponsByMemberNo } from '../../api/couponApi';

const emptyTitleByFilter = (filter) => {
  if (filter === 'available') return '사용 가능한 쿠폰이 없어요';
  if (filter === 'used') return '사용한 쿠폰이 없어요';
  return '만료된 쿠폰이 없어요';
};

const emptyDescByFilter = (filter) => {
  if (filter === 'available') return '이벤트에 참여해보세요';
  return '';
};

const TabsRow = styled.div`
  margin-bottom: var(--space-5);
`;

const CouponList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
`;

const MEMBER_NO = 1;
const STATUS_TO_UI = {
  AVAILABLE: 'available',
  USED: 'used',
  EXPIRED: 'expired',
  RETURNED: 'expired',
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

export default function MyCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [filter, setFilter] = useState('available');

  useEffect(() => {
    const load = async () => {
      try {
        const list = await findCouponsByMemberNo(MEMBER_NO);
        setCoupons(list);
      } catch (err) {
        console.error('보유 쿠폰 조회 실패', err);
      }
    };
    load();
  }, []);

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
        <Tabs items={tabItems} value={filter} onChange={setFilter} />
      </TabsRow>

      {filteredCoupons.length === 0 ? (
        <EmptyState
          icon="🎫"
          title={emptyTitleByFilter(filter)}
          description={emptyDescByFilter(filter)}
        />
      ) : (
        <CouponList>
          {filteredCoupons.map((coupon) => (
            <CouponTicket key={coupon.no} coupon={coupon} status={filter} />
          ))}
        </CouponList>
      )}
    </PageLayout>
  );
}
