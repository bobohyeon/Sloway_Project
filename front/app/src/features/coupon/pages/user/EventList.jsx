import { useState } from 'react';
import styled from 'styled-components';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { createCoupon } from '../../api/couponApi';

const MEMBER_NO = 1;

const ISSUABLE_COUPONS = [
  {
    id: 'welcome',
    icon: '🎉',
    couponName: '신규가입 환영 쿠폰',
    dcType: 'FIXED',
    dcValue: 10000,
    validDays: 30,
    badge: 'NEW',
  },
  {
    id: 'first_pay',
    icon: '🎁',
    couponName: '첫 결제 5% 할인',
    dcType: 'RATE',
    dcValue: 5,
    validDays: 60,
    badge: 'HOT',
  },
  {
    id: 'workation',
    icon: '💻',
    couponName: '워케이션 응원 쿠폰',
    dcType: 'FIXED',
    dcValue: 5000,
    validDays: 14,
  },
  {
    id: 'weekend',
    icon: '🏖️',
    couponName: '주말 특가 10% 할인',
    dcType: 'RATE',
    dcValue: 10,
    validDays: 30,
  },
  {
    id: 'long_stay',
    icon: '🌙',
    couponName: '장기 이용 15,000원 할인',
    dcType: 'FIXED',
    dcValue: 15000,
    validDays: 90,
  },
  {
    id: 'referral',
    icon: '🤝',
    couponName: '친구 추천 7% 할인',
    dcType: 'RATE',
    dcValue: 7,
    validDays: 60,
  },
];

const formatDcLabel = (dcType, dcValue) =>
  dcType === 'RATE' ? `${dcValue}% 할인` : `${dcValue.toLocaleString()}원 할인`;

export default function EventList() {
  // 새로고침 시 리셋 — 중복 발급 차단은 백엔드 영역 X, 클라 세션 한정
  const [issuedIds, setIssuedIds] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const handleIssue = async (coupon) => {
    if (issuedIds.includes(coupon.id)) return;
    setLoadingId(coupon.id);
    try {
      const expiredAt = new Date();
      expiredAt.setDate(expiredAt.getDate() + coupon.validDays);
      await createCoupon({
        couponName: coupon.couponName,
        dcType: coupon.dcType,
        dcValue: coupon.dcValue,
        memberNo: MEMBER_NO,
        expiredAt: expiredAt.toISOString(),
      });
      setIssuedIds((prev) => [...prev, coupon.id]);
      alert(`'${coupon.couponName}' 발급 완료!\n내 쿠폰 페이지에서 확인하세요.`);
    } catch (err) {
      console.error('쿠폰 발급 실패', err);
      const msg = err?.response?.data?.msg ?? err.message;
      alert(`쿠폰 발급에 실패했습니다.\n${msg}`);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <PageLayout
      title="쿠폰 발급"
      description="진행 중인 이벤트 쿠폰을 발급받아보세요"
    >
      <Notice>
        💡 발급받은 쿠폰은 <strong>내 쿠폰</strong> 페이지에서 확인할 수 있고,
        결제 시 자동으로 적용됩니다.
      </Notice>

      <Grid>
        {ISSUABLE_COUPONS.map((coupon) => {
          const issued = issuedIds.includes(coupon.id);
          const loading = loadingId === coupon.id;
          return (
            <Card key={coupon.id} $issued={issued}>
              {coupon.badge && <Badge>{coupon.badge}</Badge>}
              <Icon>{coupon.icon}</Icon>
              <Name>{coupon.couponName}</Name>
              <Discount>{formatDcLabel(coupon.dcType, coupon.dcValue)}</Discount>
              <Period>{coupon.validDays}일 이내 사용</Period>
              <IssueButton
                type="button"
                onClick={() => handleIssue(coupon)}
                disabled={issued || loading}
              >
                {issued ? '✓ 발급 완료' : loading ? '발급 중…' : '발급받기'}
              </IssueButton>
            </Card>
          );
        })}
      </Grid>
    </PageLayout>
  );
}

const Notice = styled.div`
  background: var(--cream);
  border-radius: var(--radius-md);
  padding: var(--space-4) var(--space-5);
  margin-bottom: var(--space-6);
  color: var(--gray800);
  font-size: 14px;
  line-height: 1.5;

  strong {
    color: var(--sage);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--space-4);
`;

const Card = styled.div`
  position: relative;
  background: var(--white);
  border: 1px solid var(--gray200);
  border-radius: var(--radius-lg);
  padding: var(--space-6) var(--space-5);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: border-color 0.15s, transform 0.15s;
  opacity: ${({ $issued }) => ($issued ? 0.6 : 1)};

  &:hover {
    border-color: ${({ $issued }) => ($issued ? 'var(--gray200)' : 'var(--sage)')};
    transform: ${({ $issued }) => ($issued ? 'none' : 'translateY(-2px)')};
  }
`;

const Badge = styled.span`
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  background: var(--sage);
  color: var(--white);
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  letter-spacing: 0.5px;
`;

const Icon = styled.div`
  font-size: 40px;
  margin-bottom: var(--space-3);
`;

const Name = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: var(--gray800);
  margin-bottom: var(--space-2);
  min-height: 40px;
  display: flex;
  align-items: center;
`;

const Discount = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: var(--sage);
  margin-bottom: var(--space-1);
`;

const Period = styled.div`
  font-size: 13px;
  color: var(--gray600);
  margin-bottom: var(--space-5);
`;

const IssueButton = styled.button`
  width: 100%;
  background: var(--sage);
  color: var(--white);
  border: none;
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;

  &:hover:not(:disabled) {
    background: #8fa386;
  }

  &:disabled {
    background: var(--gray400);
    cursor: not-allowed;
  }
`;
