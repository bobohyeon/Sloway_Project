import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  FaCalendarAlt,
  FaIdCard,
  FaUniversity,
  FaBuilding,
  FaCalendarCheck,
  FaCoins,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaStar,
  FaChartLine,
  FaHome,
  FaBriefcase,
  FaLaptop,
  FaUser,
} from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';

// ─────────────────────────────────────────────
// 더미 데이터 — 백엔드 연동 시 GET /api/admin/hosts/{id} 로 교체
// ─────────────────────────────────────────────
const HOST_DETAILS = {
  1: {
    hostId: 1,
    memberId: 10101,
    email: 'seoyeon.lee@example.com',
    name: '이서연',
    phone: '010-2345-6789',
    profileImgUrl: null,
    // 사업자 정보
    businessNumber: '123-45-67890',
    businessName: '제주살이 게스트하우스',
    representative: '이서연',
    businessCategory: '숙박업 / 펜션',
    businessAddress: '제주특별자치도 제주시 한림읍 협재로 ...',
    businessContact: '064-1234-5678',
    // 호스트 상태
    status: 'ACTIVE',
    approvedAt: '2025-04-20',
    approvedBy: '관리자 A',
    revokedAt: null,
    revokeReason: null,
    // 정산 계좌
    bankAccount: {
      bankName: '신한은행',
      accountNumber: '110-***-***876',
      accountHolder: '이서연',
      verified: true,
    },
    // 운영 통계
    stats: {
      spaceCount: 3,
      ongoingReservationCount: 5,
      completedReservationCount: 27,
      totalRevenue: 12_500_000,
      unsettledAmount: 1_250_000,
      averageRating: 4.7,
      reviewCount: 18,
    },
    // 운영 공간 목록
    spaces: [
      {
        id: 'S-001',
        name: '제주 협재 오션뷰',
        type: 'STATION',
        basePrice: 180_000,
        status: 'ACTIVE',
        reservationCount: 12,
      },
      {
        id: 'S-002',
        name: '제주 한림 코지룸',
        type: 'STATION',
        basePrice: 120_000,
        status: 'ACTIVE',
        reservationCount: 8,
      },
      {
        id: 'S-003',
        name: '협재 라운지 오피스',
        type: 'OFFICE',
        basePrice: 15_000,
        status: 'ACTIVE',
        reservationCount: 7,
      },
    ],
    // 월별 매출
    monthlyRevenue: [
      { month: '2025-02', revenue: 1_200_000 },
      { month: '2025-03', revenue: 2_800_000 },
      { month: '2025-04', revenue: 3_700_000 },
      { month: '2025-05', revenue: 4_800_000 },
    ],
  },
  4: {
    hostId: 4,
    memberId: 10109,
    email: 'taeho.song@example.com',
    name: '송태호',
    phone: '010-0123-4567',
    profileImgUrl: null,
    businessNumber: '901-23-45678',
    businessName: '여수 밤바다 스테이',
    representative: '송태호',
    businessCategory: '숙박업·임대업',
    businessAddress: '전라남도 여수시 ...',
    businessContact: '061-555-1234',
    status: 'ACTIVE',
    approvedAt: '2025-05-08',
    approvedBy: '관리자 B',
    revokedAt: null,
    revokeReason: null,
    bankAccount: {
      bankName: '카카오뱅크',
      accountNumber: '3333-**-*****56',
      accountHolder: '송태호',
      verified: true,
    },
    stats: {
      spaceCount: 4,
      ongoingReservationCount: 8,
      completedReservationCount: 42,
      totalRevenue: 18_700_000,
      unsettledAmount: 2_300_000,
      averageRating: 4.9,
      reviewCount: 31,
    },
    spaces: [
      {
        id: 'S-101',
        name: '여수 밤바다뷰 펜션',
        type: 'STATION',
        basePrice: 220_000,
        status: 'ACTIVE',
        reservationCount: 18,
      },
      {
        id: 'S-102',
        name: '돌산 워크앤스테이',
        type: 'WORK_STAY',
        basePrice: 280_000,
        status: 'ACTIVE',
        reservationCount: 12,
      },
      {
        id: 'S-103',
        name: '여수 시티뷰 코워킹',
        type: 'OFFICE',
        basePrice: 12_000,
        status: 'ACTIVE',
        reservationCount: 8,
      },
      {
        id: 'S-104',
        name: '돌산 마운틴 게스트룸',
        type: 'STATION',
        basePrice: 150_000,
        status: 'SUSPENDED',
        reservationCount: 4,
      },
    ],
    monthlyRevenue: [
      { month: '2025-02', revenue: 2_500_000 },
      { month: '2025-03', revenue: 4_100_000 },
      { month: '2025-04', revenue: 5_600_000 },
      { month: '2025-05', revenue: 6_500_000 },
    ],
  },
  10: {
    hostId: 10,
    memberId: 10140,
    email: 'bad.host@example.com',
    name: '나불량',
    phone: '010-7777-8888',
    profileImgUrl: null,
    businessNumber: '789-01-23456',
    businessName: '신뢰불가 호스트',
    representative: '나불량',
    businessCategory: '숙박업',
    businessAddress: '경기도 ...',
    businessContact: '031-000-0000',
    status: 'REVOKED',
    approvedAt: '2025-04-10',
    approvedBy: '관리자 B',
    revokedAt: '2025-05-08',
    revokeReason: '게스트 환불 거부 분쟁 3건 누적 — 호스트 약관 위반',
    bankAccount: {
      bankName: '농협은행',
      accountNumber: '301-***-***123',
      accountHolder: '나불량',
      verified: true,
    },
    stats: {
      spaceCount: 0,
      ongoingReservationCount: 0,
      completedReservationCount: 14,
      totalRevenue: 5_400_000,
      unsettledAmount: 0,
      averageRating: 2.8,
      reviewCount: 9,
    },
    spaces: [], // 자격 취소되어 운영 공간 비공개
    monthlyRevenue: [
      { month: '2025-02', revenue: 1_800_000 },
      { month: '2025-03', revenue: 2_200_000 },
      { month: '2025-04', revenue: 1_400_000 },
      { month: '2025-05', revenue: 0 },
    ],
  },
};

const STATUS_LABEL = {
  ACTIVE: '정상',
  REVOKED: '자격 취소',
};

const SPACE_TYPE_LABEL = {
  STATION: '숙소',
  OFFICE: '코워킹오피스',
  WORK_STAY: '워크앤스테이',
};

const SPACE_STATUS_LABEL = {
  ACTIVE: '운영중',
  SUSPENDED: '운영 중지',
};

const SpaceTypeIcon = ({ type }) => {
  if (type === 'STATION') return <FaHome />;
  if (type === 'OFFICE') return <FaBriefcase />;
  if (type === 'WORK_STAY') return <FaLaptop />;
  return <FaHome />;
};

const formatMoney = (n) => (n ?? 0).toLocaleString() + '원';
const maskPhone = (phone) => {
  if (!phone) return '-';
  return phone.replace(/(\d{3})-(\d{4})-(\d{4})/, '$1-****-$3');
};

function HostDetailPage() {
  const { hostId } = useParams();
  const navigate = useNavigate();

  const initial = HOST_DETAILS[hostId] || HOST_DETAILS[1];
  const [host, setHost] = useState(initial);

  // 자격 취소 모달
  const [revokeOpen, setRevokeOpen] = useState(false);
  const [revokeReason, setRevokeReason] = useState('');
  const [revokeConfirmText, setRevokeConfirmText] = useState('');
  const [revokeAgreed, setRevokeAgreed] = useState(false);

  const isActive = host.status === 'ACTIVE';
  const isRevoked = host.status === 'REVOKED';

  const revokeConfirmReady =
    revokeConfirmText === '자격을 취소합니다' &&
    revokeAgreed &&
    revokeReason.trim().length > 0;

  // 월별 매출 — 최대값 기준 막대 너비 계산
  const maxRevenue = useMemo(
    () => Math.max(...host.monthlyRevenue.map((m) => m.revenue), 1),
    [host.monthlyRevenue]
  );

  // ─── 핸들러 ──────────────────────────
  const openRevokeModal = () => {
    setRevokeReason('');
    setRevokeConfirmText('');
    setRevokeAgreed(false);
    setRevokeOpen(true);
  };

  const confirmRevoke = () => {
    if (!revokeConfirmReady) return;
    // TODO: PATCH /api/admin/hosts/{id}/revoke { reason }
    setHost((prev) => ({
      ...prev,
      status: 'REVOKED',
      revokedAt: new Date().toISOString().slice(0, 10),
      revokeReason: revokeReason,
      stats: {
        ...prev.stats,
        spaceCount: 0,
        ongoingReservationCount: 0,
      },
      spaces: [],
    }));
    setRevokeOpen(false);
    alert('호스트 자격이 취소되었습니다.');
  };

  const handleRestore = () => {
    if (
      !window.confirm(
        `${host.name} (${host.businessName})의 호스트 자격을 복원하시겠습니까?`
      )
    )
      return;
    // TODO: PATCH /api/admin/hosts/{id}/restore
    setHost((prev) => ({
      ...prev,
      status: 'ACTIVE',
      revokedAt: null,
      revokeReason: null,
    }));
  };

  return (
    <PageContainer>
      <PageLayout
        title="호스트 상세"
        description={`호스트 #${host.hostId}`}
        backTo="/admin/host/list"
        backLabel="호스트 목록"
      >
        {/* 헤더 카드 */}
        <HeaderCard>
          <HeaderTop>
            <StatusBadge $status={host.status}>
              {STATUS_LABEL[host.status]}
            </StatusBadge>
            <SubText>
              승인일 {host.approvedAt} · 처리: {host.approvedBy}
            </SubText>
          </HeaderTop>
          <BusinessName>{host.businessName}</BusinessName>
          <HostRow>
            <span>
              <FaUser /> {host.name}
            </span>
            <Dot>·</Dot>
            <span>{maskPhone(host.phone)}</span>
            <Dot>·</Dot>
            <span>{host.email}</span>
          </HostRow>

          {/* 평점 */}
          <RatingRow>
            <Stars>
              <FaStar />
              <strong>{host.stats.averageRating.toFixed(1)}</strong>
            </Stars>
            <span>리뷰 {host.stats.reviewCount}개</span>
          </RatingRow>

          {/* 자격 취소된 경우 사유 표시 */}
          {isRevoked && (
            <RevokedNotice>
              <FaTimesCircle />
              <div>
                <strong>자격 취소</strong>
                <span>
                  {host.revokedAt} — {host.revokeReason}
                </span>
              </div>
            </RevokedNotice>
          )}

          {/* 회원 정보 바로가기 */}
          <MemberLink
            onClick={() => navigate(`/admin/members/${host.memberId}`)}
          >
            회원 상세 페이지에서 일반회원 정보·활동 이력 보기 →
          </MemberLink>
        </HeaderCard>

        {/* 운영 통계 4개 */}
        <StatsGrid>
          <StatBox>
            <StatIcon $bg="#7A8B71">
              <FaBuilding />
            </StatIcon>
            <StatBody>
              <StatLabel>운영 공간</StatLabel>
              <StatValue>{host.stats.spaceCount}개</StatValue>
            </StatBody>
          </StatBox>
          <StatBox>
            <StatIcon $bg="#a8b89f">
              <FaCalendarCheck />
            </StatIcon>
            <StatBody>
              <StatLabel>진행중 예약</StatLabel>
              <StatValue>{host.stats.ongoingReservationCount}건</StatValue>
              <StatSub>완료 {host.stats.completedReservationCount}건</StatSub>
            </StatBody>
          </StatBox>
          <StatBox>
            <StatIcon $bg="#D9A441">
              <FaCoins />
            </StatIcon>
            <StatBody>
              <StatLabel>누적 매출</StatLabel>
              <StatValue>{formatMoney(host.stats.totalRevenue)}</StatValue>
            </StatBody>
          </StatBox>
          <StatBox>
            <StatIcon
              $bg={host.stats.unsettledAmount > 0 ? '#C9433D' : '#B0B0B0'}
            >
              <FaCoins />
            </StatIcon>
            <StatBody>
              <StatLabel>미정산</StatLabel>
              <StatValue $warn={host.stats.unsettledAmount > 0}>
                {formatMoney(host.stats.unsettledAmount)}
              </StatValue>
              {host.stats.unsettledAmount > 0 && (
                <StatSub>정산 처리 필요</StatSub>
              )}
            </StatBody>
          </StatBox>
        </StatsGrid>

        {/* 사업자 정보 + 정산 계좌 */}
        <TwoCol>
          <InfoCard>
            <CardTitle>
              <FaIdCard /> 사업자 정보
            </CardTitle>
            <InfoRow>
              <Label>상호명</Label>
              <Value>{host.businessName}</Value>
            </InfoRow>
            <InfoRow>
              <Label>대표자</Label>
              <Value>{host.representative}</Value>
            </InfoRow>
            <InfoRow>
              <Label>사업자번호</Label>
              <Value>{host.businessNumber}</Value>
            </InfoRow>
            <InfoRow>
              <Label>업태/종목</Label>
              <Value>{host.businessCategory}</Value>
            </InfoRow>
            <InfoRow>
              <Label>사업장 주소</Label>
              <Value>{host.businessAddress}</Value>
            </InfoRow>
            <InfoRow>
              <Label>연락처</Label>
              <Value>{host.businessContact}</Value>
            </InfoRow>
          </InfoCard>

          <InfoCard>
            <CardTitle>
              <FaUniversity /> 정산 계좌
            </CardTitle>
            <InfoRow>
              <Label>은행</Label>
              <Value>{host.bankAccount.bankName}</Value>
            </InfoRow>
            <InfoRow>
              <Label>계좌번호</Label>
              <Value>{host.bankAccount.accountNumber}</Value>
            </InfoRow>
            <InfoRow>
              <Label>예금주</Label>
              <Value>{host.bankAccount.accountHolder}</Value>
            </InfoRow>
            <VerifyBox $verified={host.bankAccount.verified}>
              {host.bankAccount.verified ? (
                <>
                  <FaCheckCircle />
                  <div>
                    <strong>계좌 실명 일치 확인됨</strong>
                  </div>
                </>
              ) : (
                <>
                  <FaExclamationTriangle />
                  <div>
                    <strong>계좌 실명 확인 필요</strong>
                  </div>
                </>
              )}
            </VerifyBox>
          </InfoCard>
        </TwoCol>

        {/* 월별 매출 추이 */}
        <InfoCard>
          <CardTitle>
            <FaChartLine /> 월별 매출 추이
          </CardTitle>
          <RevenueChart>
            {host.monthlyRevenue.map((m) => (
              <RevenueBar key={m.month}>
                <RevenueMonth>{m.month}</RevenueMonth>
                <RevenueBarTrack>
                  <RevenueBarFill $width={(m.revenue / maxRevenue) * 100} />
                </RevenueBarTrack>
                <RevenueAmount>{formatMoney(m.revenue)}</RevenueAmount>
              </RevenueBar>
            ))}
          </RevenueChart>
        </InfoCard>

        {/* 운영 공간 목록 */}
        <InfoCard>
          <CardTitleRow>
            <CardTitle>
              <FaBuilding /> 운영 공간 ({host.spaces.length}개)
            </CardTitle>
          </CardTitleRow>

          {host.spaces.length === 0 ? (
            <EmptySpace>
              {isRevoked
                ? '자격이 취소되어 운영 공간이 모두 비공개 처리되었습니다.'
                : '운영 중인 공간이 없습니다.'}
            </EmptySpace>
          ) : (
            <SpaceList>
              {host.spaces.map((s) => (
                <SpaceCard key={s.id}>
                  <SpaceLeft>
                    <SpaceIconWrap>
                      <SpaceTypeIcon type={s.type} />
                    </SpaceIconWrap>
                    <SpaceInfo>
                      <SpaceName>
                        {s.name}
                        <SpaceTypeBadge>
                          {SPACE_TYPE_LABEL[s.type]}
                        </SpaceTypeBadge>
                      </SpaceName>
                      <SpaceMeta>
                        예약 {s.reservationCount}건 · 기본가{' '}
                        {formatMoney(s.basePrice)}
                      </SpaceMeta>
                    </SpaceInfo>
                  </SpaceLeft>
                  <SpaceStatus $active={s.status === 'ACTIVE'}>
                    {SPACE_STATUS_LABEL[s.status]}
                  </SpaceStatus>
                </SpaceCard>
              ))}
            </SpaceList>
          )}
        </InfoCard>

        {/* 자격 관리 액션 */}
        {isActive && (
          <DangerZone>
            <DangerHeader>
              <FaExclamationTriangle />
              <div>
                <DangerTitle>호스트 자격 관리</DangerTitle>
                <DangerDesc>
                  자격 취소는 운영 공간·예약·정산에 영향을 줍니다.
                </DangerDesc>
              </div>
            </DangerHeader>
            <DangerBody>
              <DangerItem>
                <div>
                  <DangerItemTitle>호스트 자격 취소</DangerItemTitle>
                  <DangerItemDesc>
                    호스트 권한을 회수하며, 일반회원으로는 유지됩니다. 운영 중인
                    공간은 즉시 비공개되고, 진행 중인 예약은 자동 환불
                    처리됩니다.
                  </DangerItemDesc>
                </div>
                <DangerBtn onClick={openRevokeModal}>자격 취소</DangerBtn>
              </DangerItem>
            </DangerBody>
          </DangerZone>
        )}

        {isRevoked && (
          <ActionCard>
            <ActionInfo>
              이 호스트는 자격이 취소된 상태입니다. 복원 시 호스트 권한이
              회복되며, 운영 공간 재공개는 호스트가 직접 처리해야 합니다.
            </ActionInfo>
            <RestoreBtn onClick={handleRestore}>자격 복원</RestoreBtn>
          </ActionCard>
        )}
      </PageLayout>

      {/* 자격 취소 모달 */}
      {revokeOpen && (
        <ModalOverlay onClick={() => setRevokeOpen(false)}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalTitle $danger>호스트 자격 취소</ModalTitle>
            <ModalDesc>
              <strong>{host.name}</strong> ({host.businessName})의 호스트 자격을
              취소합니다. 호스트 권한만 회수되며, 일반회원으로는 유지됩니다.
            </ModalDesc>

            <ImpactBox>
              <ImpactTitle>
                <FaExclamationTriangle /> 이 작업의 영향
              </ImpactTitle>
              <ImpactItem>
                <ImpactLabel>운영 공간</ImpactLabel>
                <ImpactValue>
                  <strong>{host.stats.spaceCount}개</strong> → 즉시 비공개 처리
                </ImpactValue>
              </ImpactItem>
              <ImpactItem>
                <ImpactLabel>진행 중 예약</ImpactLabel>
                <ImpactValue>
                  {host.stats.ongoingReservationCount > 0 ? (
                    <ImpactWarn>
                      <strong>{host.stats.ongoingReservationCount}건</strong> →
                      게스트들에게 자동 환불 처리
                    </ImpactWarn>
                  ) : (
                    <span>없음</span>
                  )}
                </ImpactValue>
              </ImpactItem>
              <ImpactItem>
                <ImpactLabel>미정산 금액</ImpactLabel>
                <ImpactValue>
                  {host.stats.unsettledAmount > 0 ? (
                    <ImpactWarn>
                      <strong>{formatMoney(host.stats.unsettledAmount)}</strong>{' '}
                      → 별도 정산 처리 필요
                    </ImpactWarn>
                  ) : (
                    <span>없음</span>
                  )}
                </ImpactValue>
              </ImpactItem>
            </ImpactBox>

            <FormGroup>
              <FormLabel>취소 사유 *</FormLabel>
              <FormTextarea
                rows="3"
                placeholder="자격 취소 사유를 입력하세요 (감사 로그에 기록되고 호스트에게 알림으로 전달됩니다)"
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                maxLength={300}
              />
              <HelpText>{revokeReason.length} / 300</HelpText>
            </FormGroup>

            <FormGroup>
              <FormLabel>확인 문구 입력 *</FormLabel>
              <FormInput
                placeholder="자격을 취소합니다"
                value={revokeConfirmText}
                onChange={(e) => setRevokeConfirmText(e.target.value)}
              />
              <HelpText>
                정확히 "<strong>자격을 취소합니다</strong>"라고 입력해주세요.
              </HelpText>
            </FormGroup>

            <FormGroup>
              <CheckRow>
                <input
                  type="checkbox"
                  id="revoke-agree-detail"
                  checked={revokeAgreed}
                  onChange={(e) => setRevokeAgreed(e.target.checked)}
                />
                <label htmlFor="revoke-agree-detail">
                  위 영향 사항을 모두 확인했으며, 자격 취소에 동의합니다.
                </label>
              </CheckRow>
            </FormGroup>

            <ModalActions>
              <ModalBtn onClick={() => setRevokeOpen(false)}>취소</ModalBtn>
              <ModalBtn
                $danger
                disabled={!revokeConfirmReady}
                onClick={confirmRevoke}
              >
                자격 취소 처리
              </ModalBtn>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}
    </PageContainer>
  );
}

export default HostDetailPage;

// ─────────────────────────────────────────────
// Styled Components
// ─────────────────────────────────────────────
const PageContainer = styled.div`
  padding: 20px;
  background-color: #f4efe6;
  min-height: 95.2%;
`;

const HeaderCard = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #eee;
  padding: 24px 28px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  margin-bottom: 20px;
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  flex-wrap: wrap;
`;

const SubText = styled.span`
  font-size: 13px;
  color: #888;
`;

const StatusBadge = styled.span`
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

const BusinessName = styled.h2`
  font-size: 26px;
  font-weight: 700;
  color: #333;
  margin: 0 0 10px 0;
`;

const HostRow = styled.div`
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

const Dot = styled.span`
  color: #ccc;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  font-size: 13px;
  color: #888;
`;

const Stars = styled.div`
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

const RevokedNotice = styled.div`
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

const MemberLink = styled.div`
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
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatBox = styled.div`
  background: white;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
`;

const StatIcon = styled.div`
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

const StatBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
`;

const StatLabel = styled.span`
  font-size: 13px;
  color: #888;
`;

const StatValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${(p) => (p.$warn ? '#C9433D' : '#333')};
`;

const StatSub = styled.span`
  font-size: 12px;
  color: #888;
  margin-top: 2px;
`;

// 2컬럼 카드
const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #eee;
  padding: 22px 26px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  margin-bottom: 20px;
`;

const CardTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  gap: 16px;
  flex-wrap: wrap;
`;

const CardTitle = styled.h3`
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

const InfoRow = styled.div`
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #f4f1eb;
  font-size: 14px;

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.span`
  width: 110px;
  color: #888;
  flex-shrink: 0;
`;

const Value = styled.span`
  color: #333;
  flex: 1;
  word-break: break-all;
`;

const VerifyBox = styled.div`
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
const RevenueChart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RevenueBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
`;

const RevenueMonth = styled.span`
  width: 70px;
  color: #888;
  flex-shrink: 0;
`;

const RevenueBarTrack = styled.div`
  flex: 1;
  height: 22px;
  background: #faf8f3;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;

const RevenueBarFill = styled.div`
  width: ${(p) => p.$width}%;
  height: 100%;
  background: linear-gradient(90deg, #a8b89f 0%, #7a8b71 100%);
  border-radius: 4px;
  transition: width 400ms ease;
`;

const RevenueAmount = styled.span`
  width: 130px;
  text-align: right;
  color: #333;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
`;

// 운영 공간
const EmptySpace = styled.div`
  text-align: center;
  padding: 30px 20px;
  color: #aaa;
  font-size: 14px;
  background: #faf8f3;
  border-radius: 8px;
`;

const SpaceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SpaceCard = styled.div`
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

const SpaceLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
  min-width: 0;
`;

const SpaceIconWrap = styled.div`
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

const SpaceInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const SpaceName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const SpaceTypeBadge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  background: #e8f0df;
  color: #5a6b4f;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
`;

const SpaceMeta = styled.div`
  font-size: 12px;
  color: #888;
  margin-top: 2px;
`;

const SpaceStatus = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${(p) => (p.$active ? '#5A6B4F' : '#888')};
  white-space: nowrap;
  flex-shrink: 0;
`;

// 위험 작업 영역
const DangerZone = styled.div`
  background: white;
  border: 1.5px solid #f4c5c2;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
`;

const DangerHeader = styled.div`
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

const DangerTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #c9433d;
`;

const DangerDesc = styled.div`
  font-size: 12px;
  color: #888;
  margin-top: 2px;
`;

const DangerBody = styled.div`
  padding: 20px 24px;
`;

const DangerItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const DangerItemTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const DangerItemDesc = styled.div`
  font-size: 13px;
  color: #888;
  margin-top: 4px;
  line-height: 1.5;
`;

const DangerBtn = styled.button`
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
const ActionCard = styled.div`
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

const ActionInfo = styled.div`
  flex: 1;
  min-width: 220px;
  font-size: 14px;
  color: #555;
  line-height: 1.5;
`;

const RestoreBtn = styled.button`
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
const ModalOverlay = styled.div`
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

const ModalCard = styled.div`
  background: white;
  border-radius: 14px;
  padding: 28px 28px 24px;
  width: 100%;
  max-width: 500px;
  max-height: 92vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${(p) => (p.$danger ? '#C9433D' : '#333')};
  margin: 0 0 8px 0;
`;

const ModalDesc = styled.div`
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 20px 0;

  strong {
    color: #333;
    font-weight: 600;
  }
`;

const ImpactBox = styled.div`
  background: #fef6e8;
  border-left: 3px solid #d9a441;
  border-radius: 6px;
  padding: 14px 16px;
  margin-bottom: 18px;
`;

const ImpactTitle = styled.div`
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

const ImpactItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  font-size: 13px;

  &:not(:last-child) {
    border-bottom: 1px dashed #f0e3c8;
  }
`;

const ImpactLabel = styled.span`
  color: #666;
`;

const ImpactValue = styled.span`
  color: #333;
  strong {
    font-weight: 600;
  }
`;

const ImpactWarn = styled.span`
  color: #c9433d;
  strong {
    color: #c9433d;
    font-weight: 700;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #555;
  margin-bottom: 6px;
`;

const FormInput = styled.input`
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

const FormTextarea = styled.textarea`
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

const HelpText = styled.div`
  font-size: 12px;
  color: #aaa;
  margin-top: 4px;

  strong {
    color: #c9433d;
    font-weight: 600;
  }
`;

const CheckRow = styled.div`
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

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
`;

const ModalBtn = styled.button`
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
