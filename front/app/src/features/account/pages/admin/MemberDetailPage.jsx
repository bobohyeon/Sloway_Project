import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaSignInAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaBuilding,
  FaFileAlt,
  FaExclamationTriangle,
  FaHistory,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';

// ─────────────────────────────────────────────
// 더미 데이터 — 백엔드 연동 시 GET /api/admin/users/{id} 로 교체
// 시연용으로 4가지 시나리오 (활성/호스트/정지/탈퇴)
// ─────────────────────────────────────────────
const MEMBER_DETAILS = {
  10001: {
    memberId: 10001,
    email: 'minjun.kim@example.com',
    name: '김민준',
    phone: '010-1234-5678',
    profileImgUrl: null,
    role: 'USER',
    provider: 'LOCAL',
    status: 'ACTIVE',
    emailVerified: true,
    createdAt: '2025-04-15',
    lastLoginAt: '2025-05-13 14:22',
    suspendedUntil: null,
    suspendReason: null,
    stats: {
      reservationCount: 8,
      ongoingReservationCount: 2,
      reviewCount: 5,
      point: 12500,
      couponCount: 2,
    },
    hostProfile: null,
    sanctionHistory: [],
  },
  10002: {
    memberId: 10002,
    email: 'seoyeon.lee@example.com',
    name: '이서연',
    phone: '010-2345-6789',
    profileImgUrl: null,
    role: 'HOST',
    provider: 'KAKAO',
    status: 'ACTIVE',
    emailVerified: true,
    createdAt: '2025-04-16',
    lastLoginAt: '2025-05-12 09:15',
    suspendedUntil: null,
    suspendReason: null,
    stats: {
      reservationCount: 3,
      ongoingReservationCount: 0,
      reviewCount: 1,
      point: 5000,
      couponCount: 1,
    },
    hostProfile: {
      businessNumber: '123-45-67890',
      businessName: '제주살이 게스트하우스',
      businessDocUrl: '/uploads/business/seoyeon_biz.pdf',
      applyStatus: 'APPROVED',
      approvedAt: '2025-04-20',
      approvedBy: '관리자 A',
      spaceCount: 3,
      unsettledAmount: 1_250_000,
    },
    sanctionHistory: [],
  },
  10003: {
    memberId: 10003,
    email: 'doyun.park@example.com',
    name: '박도윤',
    phone: '010-3456-7890',
    profileImgUrl: null,
    role: 'USER',
    provider: 'GOOGLE',
    status: 'SUSPENDED',
    emailVerified: true,
    createdAt: '2025-04-17',
    lastLoginAt: '2025-05-01 18:42',
    suspendedUntil: '2025-05-20',
    suspendReason: '리뷰 신고 3건 누적으로 인한 7일 정지',
    stats: {
      reservationCount: 12,
      ongoingReservationCount: 0,
      reviewCount: 15,
      point: 800,
      couponCount: 0,
    },
    hostProfile: null,
    sanctionHistory: [
      {
        sanctionId: 1,
        type: 'SUSPENSION',
        reason: '리뷰 신고 3건 누적으로 인한 7일 정지',
        createdAt: '2025-05-13',
        endedAt: '2025-05-20',
        status: 'ACTIVE',
        adminName: '관리자 A',
      },
      {
        sanctionId: 2,
        type: 'SUSPENSION',
        reason: '욕설 사용으로 3일 정지',
        createdAt: '2025-04-25',
        endedAt: '2025-04-28',
        status: 'EXPIRED',
        adminName: '관리자 B',
      },
    ],
  },
  10005: {
    memberId: 10005,
    email: 'haeun.jung@example.com',
    name: '정하은',
    phone: '010-5678-9012',
    profileImgUrl: null,
    role: 'HOST',
    provider: 'LOCAL',
    status: 'WITHDRAWN',
    emailVerified: true,
    createdAt: '2025-04-19',
    lastLoginAt: '2025-04-30 11:00',
    suspendedUntil: null,
    suspendReason: null,
    stats: {
      reservationCount: 6,
      ongoingReservationCount: 0,
      reviewCount: 3,
      point: 0,
      couponCount: 0,
    },
    hostProfile: {
      businessNumber: '987-65-43210',
      businessName: '강릉 워케이션 하우스',
      businessDocUrl: '/uploads/business/haeun_biz.pdf',
      applyStatus: 'APPROVED',
      approvedAt: '2025-04-22',
      approvedBy: '관리자 A',
      spaceCount: 0,
      unsettledAmount: 0,
    },
    sanctionHistory: [],
  },
  10006: {
    memberId: 10006,
    email: 'banned.user@example.com',
    name: '강시우',
    phone: '010-6789-0123',
    profileImgUrl: null,
    role: 'USER',
    provider: 'KAKAO',
    status: 'BANNED',
    emailVerified: true,
    createdAt: '2025-04-20',
    lastLoginAt: '2025-05-10 02:18',
    suspendedUntil: null,
    suspendReason: '리뷰 신고 10건 누적 + 욕설 반복',
    stats: {
      reservationCount: 4,
      ongoingReservationCount: 0,
      reviewCount: 25,
      point: 0,
      couponCount: 0,
    },
    hostProfile: null,
    sanctionHistory: [
      {
        sanctionId: 10,
        type: 'BAN',
        reason: '리뷰 신고 10건 누적 + 욕설 반복',
        createdAt: '2025-05-12',
        endedAt: null,
        status: 'ACTIVE',
        adminName: '관리자 A',
      },
      {
        sanctionId: 11,
        type: 'SUSPENSION',
        reason: '리뷰 신고 5건 누적',
        createdAt: '2025-05-01',
        endedAt: '2025-05-08',
        status: 'EXPIRED',
        adminName: '관리자 B',
      },
      {
        sanctionId: 12,
        type: 'SUSPENSION',
        reason: '리뷰 욕설',
        createdAt: '2025-04-25',
        endedAt: '2025-04-28',
        status: 'EXPIRED',
        adminName: '관리자 B',
      },
    ],
  },
};

const STATUS_LABEL = {
  ACTIVE: '활성',
  SUSPENDED: '정지',
  BANNED: '영구정지',
  WITHDRAWN: '탈퇴',
};

// 정지 옵션 — 7일 / 30일 / 영구
const SUSPEND_OPTIONS = [
  { value: 'DAYS_7', label: '7일 정지', days: 7, isPermanent: false },
  { value: 'DAYS_30', label: '30일 정지', days: 30, isPermanent: false },
  { value: 'PERMANENT', label: '영구 정지', days: null, isPermanent: true },
];

const PROVIDER_LABEL = {
  LOCAL: '일반 가입',
  KAKAO: '카카오',
  GOOGLE: '구글',
};

const ROLE_LABEL = {
  USER: '일반회원',
  HOST: '호스트',
};

const SANCTION_STATUS_LABEL = {
  ACTIVE: '진행중',
  EXPIRED: '종료',
  RELEASED: '조기 해제',
};

const maskPhone = (phone) => {
  if (!phone) return '-';
  return phone.replace(/(\d{3})-(\d{4})-(\d{4})/, '$1-****-$3');
};

const formatMoney = (n) => (n ?? 0).toLocaleString() + '원';

function MemberDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const initialMember = MEMBER_DETAILS[id] || MEMBER_DETAILS[10001];
  const [member, setMember] = useState(initialMember);
  const [phoneVisible, setPhoneVisible] = useState(false);

  // 정지 모달
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [suspendOption, setSuspendOption] = useState('DAYS_7');
  const [suspendReason, setSuspendReason] = useState('');

  // 강제 탈퇴 모달
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState('');
  const [withdrawConfirmText, setWithdrawConfirmText] = useState('');
  const [withdrawAgreed, setWithdrawAgreed] = useState(false);

  const isWithdrawn = member.status === 'WITHDRAWN';
  const isSuspended = member.status === 'SUSPENDED';
  const isBanned = member.status === 'BANNED';
  const isActive = member.status === 'ACTIVE';
  // 정지/영구정지 통합 — 해제 버튼 등 공통 처리용
  const isRestricted = isSuspended || isBanned;

  // 강제 탈퇴 가능 여부
  const canWithdraw = useMemo(() => {
    if (isWithdrawn) return false;
    if (member.stats.ongoingReservationCount > 0) return false;
    if (member.hostProfile && member.hostProfile.unsettledAmount > 0)
      return false;
    return true;
  }, [member, isWithdrawn]);

  const withdrawConfirmReady =
    withdrawConfirmText === '탈퇴 처리합니다' &&
    withdrawAgreed &&
    withdrawReason.trim().length > 0;

  // ─── 액션 핸들러 ───────────────────────────
  const handleSuspendOpen = () => {
    setSuspendOption('DAYS_7');
    setSuspendReason('');
    setSuspendOpen(true);
  };

  const handleSuspendConfirm = () => {
    if (!suspendReason.trim()) {
      alert('정지 사유를 입력해주세요.');
      return;
    }

    const option = SUSPEND_OPTIONS.find((o) => o.value === suspendOption);
    if (!option) return;

    // 영구정지 한번 더 확인
    if (option.isPermanent) {
      const confirmed = window.confirm(
        `${member.name} 회원을 영구 정지하시겠습니까?\n관리자가 직접 해제하지 않는 한 영원히 서비스를 이용할 수 없습니다.`
      );
      if (!confirmed) return;
    }

    let until = null;
    if (!option.isPermanent) {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + option.days);
      until = endDate.toISOString().slice(0, 10);
    }

    // TODO: PATCH /api/admin/users/{id}/status { status, days, reason, isPermanent }
    setMember((prev) => ({
      ...prev,
      status: option.isPermanent ? 'BANNED' : 'SUSPENDED',
      suspendedUntil: until,
      suspendReason: suspendReason,
      sanctionHistory: [
        {
          sanctionId: Date.now(),
          type: option.isPermanent ? 'BAN' : 'SUSPENSION',
          reason: suspendReason,
          createdAt: new Date().toISOString().slice(0, 10),
          endedAt: until,
          status: 'ACTIVE',
          adminName: '관리자 (본인)',
        },
        ...prev.sanctionHistory,
      ],
    }));
    setSuspendOpen(false);
  };

  const handleUnsuspend = () => {
    const label = isBanned ? '영구 정지' : '정지';
    if (!window.confirm(`${member.name} 회원의 ${label}를 해제하시겠습니까?`))
      return;
    // TODO: PATCH /api/admin/users/{id}/status { status: 'ACTIVE' }
    setMember((prev) => ({
      ...prev,
      status: 'ACTIVE',
      suspendedUntil: null,
      suspendReason: null,
      sanctionHistory: prev.sanctionHistory.map((s) =>
        s.status === 'ACTIVE' ? { ...s, status: 'RELEASED' } : s
      ),
    }));
  };

  const handleWithdrawOpen = () => {
    setWithdrawReason('');
    setWithdrawConfirmText('');
    setWithdrawAgreed(false);
    setWithdrawOpen(true);
  };

  const handleWithdrawConfirm = () => {
    // TODO: DELETE /api/admin/users/{id} { reason }
    setMember((prev) => ({
      ...prev,
      status: 'WITHDRAWN',
    }));
    setWithdrawOpen(false);
    alert('강제 탈퇴 처리가 완료되었습니다.');
  };

  return (
    <PageContainer>
      <PageLayout
        title="회원 상세"
        description={`회원번호 #${member.memberId}`}
        backTo="/admin/members"
        backLabel="회원 목록"
      >
        {/* 헤더 카드 — 프로필 + 핵심 정보 + 상태 */}
        <HeaderCard>
          <ProfileSection>
            <ProfileImage>
              {member.profileImgUrl ? (
                <img src={member.profileImgUrl} alt={member.name} />
              ) : (
                <FaUserCircle />
              )}
            </ProfileImage>
            <ProfileInfo>
              <NameRow>
                <Name>{member.name}</Name>
                <RoleBadge $variant={member.role === 'HOST' ? 'host' : 'user'}>
                  {ROLE_LABEL[member.role]}
                </RoleBadge>
                <StatusBadge $status={member.status}>
                  {STATUS_LABEL[member.status]}
                </StatusBadge>
              </NameRow>
              <EmailRow>{member.email}</EmailRow>
            </ProfileInfo>
          </ProfileSection>

          {isSuspended && (
            <SuspendNotice>
              <FaExclamationTriangle />
              <div>
                <strong>정지 중</strong>
                <span>
                  {member.suspendedUntil}까지 — {member.suspendReason}
                </span>
              </div>
            </SuspendNotice>
          )}

          {isBanned && (
            <SuspendNotice $variant="banned">
              <FaExclamationTriangle />
              <div>
                <strong>영구 정지</strong>
                <span>{member.suspendReason}</span>
              </div>
            </SuspendNotice>
          )}

          {isWithdrawn && (
            <SuspendNotice $variant="withdrawn">
              <FaTimesCircle />
              <div>
                <strong>탈퇴 회원</strong>
                <span>
                  이 회원은 탈퇴 처리되어 더 이상 서비스를 이용할 수 없습니다
                </span>
              </div>
            </SuspendNotice>
          )}
        </HeaderCard>

        {/* 기본 정보 */}
        <Section>
          <SectionTitle>기본 정보</SectionTitle>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>
                <FaEnvelope /> 이메일
              </InfoLabel>
              <InfoValue>
                {member.email}
                {member.emailVerified ? (
                  <VerifiedTag>
                    <FaCheckCircle /> 인증완료
                  </VerifiedTag>
                ) : (
                  <UnverifiedTag>
                    <FaTimesCircle /> 미인증
                  </UnverifiedTag>
                )}
              </InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>
                <FaPhone /> 연락처
              </InfoLabel>
              <InfoValue>
                {phoneVisible ? member.phone : maskPhone(member.phone)}
                <ToggleBtn onClick={() => setPhoneVisible((v) => !v)}>
                  {phoneVisible ? (
                    <>
                      <FaEyeSlash /> 가리기
                    </>
                  ) : (
                    <>
                      <FaEye /> 전체 보기
                    </>
                  )}
                </ToggleBtn>
              </InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>
                <FaCalendarAlt /> 가입일
              </InfoLabel>
              <InfoValue>
                {member.createdAt}
                <SubText> · {PROVIDER_LABEL[member.provider]}</SubText>
              </InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>
                <FaSignInAlt /> 마지막 로그인
              </InfoLabel>
              <InfoValue>{member.lastLoginAt}</InfoValue>
            </InfoItem>
          </InfoGrid>
        </Section>

        {/* 활동 통계 */}
        <Section>
          <SectionTitle>활동 통계</SectionTitle>
          <StatsGrid>
            <StatBox>
              <StatNum>{member.stats.reservationCount}</StatNum>
              <StatLabel>총 예약</StatLabel>
              {member.stats.ongoingReservationCount > 0 && (
                <StatSub>
                  진행중 {member.stats.ongoingReservationCount}건
                </StatSub>
              )}
            </StatBox>
            <StatBox>
              <StatNum>{member.stats.reviewCount}</StatNum>
              <StatLabel>작성 리뷰</StatLabel>
            </StatBox>
            <StatBox>
              <StatNum>{member.stats.point.toLocaleString()}</StatNum>
              <StatLabel>보유 포인트</StatLabel>
            </StatBox>
            <StatBox>
              <StatNum>{member.stats.couponCount}</StatNum>
              <StatLabel>보유 쿠폰</StatLabel>
            </StatBox>
          </StatsGrid>
        </Section>

        {/* 호스트 정보 — 호스트만 */}
        {member.hostProfile && (
          <Section>
            <SectionTitle>
              <FaBuilding /> 호스트 정보
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>상호명</InfoLabel>
                <InfoValue>{member.hostProfile.businessName}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>사업자등록번호</InfoLabel>
                <InfoValue>{member.hostProfile.businessNumber}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>승인 일자</InfoLabel>
                <InfoValue>
                  {member.hostProfile.approvedAt}
                  <SubText> · 처리: {member.hostProfile.approvedBy}</SubText>
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>사업자등록증</InfoLabel>
                <InfoValue>
                  <DocLink
                    href={member.hostProfile.businessDocUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaFileAlt /> 다운로드
                  </DocLink>
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>운영 공간 수</InfoLabel>
                <InfoValue>{member.hostProfile.spaceCount}개</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>미정산 금액</InfoLabel>
                <InfoValue>
                  {formatMoney(member.hostProfile.unsettledAmount)}
                  {member.hostProfile.unsettledAmount > 0 && (
                    <WarnText> · 정산 처리 필요</WarnText>
                  )}
                </InfoValue>
              </InfoItem>
            </InfoGrid>
            <HostNote>
              호스트 자격 취소는{' '}
              <HostLink onClick={() => navigate('/admin/host/list')}>
                호스트 목록
              </HostLink>
              에서 처리하세요.
            </HostNote>
          </Section>
        )}

        {/* 제재 이력 */}
        {member.sanctionHistory.length > 0 && (
          <Section>
            <SectionTitle>
              <FaHistory /> 제재 이력 ({member.sanctionHistory.length})
            </SectionTitle>
            <HistoryTable>
              <thead>
                <tr>
                  <Th $w="100px">처리일</Th>
                  <Th $w="100px">유형</Th>
                  <Th>사유</Th>
                  <Th $w="120px">종료일</Th>
                  <Th $w="100px">상태</Th>
                  <Th $w="120px">처리자</Th>
                </tr>
              </thead>
              <tbody>
                {member.sanctionHistory.map((s) => (
                  <tr key={s.sanctionId}>
                    <Td>{s.createdAt}</Td>
                    <Td>정지</Td>
                    <Td>{s.reason}</Td>
                    <Td>{s.endedAt}</Td>
                    <Td>
                      <SanctionBadge $status={s.status}>
                        {SANCTION_STATUS_LABEL[s.status]}
                      </SanctionBadge>
                    </Td>
                    <Td>{s.adminName}</Td>
                  </tr>
                ))}
              </tbody>
            </HistoryTable>
          </Section>
        )}

        {/* 액션 영역 */}
        {!isWithdrawn && (
          <Section>
            <SectionTitle>회원 관리</SectionTitle>
            <ActionRow>
              {isActive && (
                <PrimaryBtn $variant="warning" onClick={handleSuspendOpen}>
                  계정 정지
                </PrimaryBtn>
              )}
              {isRestricted && (
                <PrimaryBtn onClick={handleUnsuspend}>
                  {isBanned ? '영구 정지 해제' : '정지 해제'}
                </PrimaryBtn>
              )}
            </ActionRow>
          </Section>
        )}

        {/* 위험 작업 영역 (Danger Zone) */}
        {!isWithdrawn && (
          <DangerZone>
            <DangerHeader>
              <FaExclamationTriangle />
              <div>
                <DangerTitle>위험 작업 영역</DangerTitle>
                <DangerDesc>
                  아래 작업은 되돌릴 수 없습니다. 신중하게 진행하세요.
                </DangerDesc>
              </div>
            </DangerHeader>
            <DangerBody>
              <DangerItem>
                <div>
                  <DangerItemTitle>회원 강제 탈퇴</DangerItemTitle>
                  <DangerItemDesc>
                    회원 계정을 즉시 탈퇴 처리합니다. 모든 권한이 회수되고
                    복구할 수 없습니다.
                    {!canWithdraw && (
                      <BlockReason>
                        {member.stats.ongoingReservationCount > 0 &&
                          '· 진행 중인 예약이 있어 처리 불가'}
                        {member.hostProfile &&
                          member.hostProfile.unsettledAmount > 0 &&
                          '· 미정산 금액이 있어 처리 불가'}
                      </BlockReason>
                    )}
                  </DangerItemDesc>
                </div>
                <DangerBtn disabled={!canWithdraw} onClick={handleWithdrawOpen}>
                  강제 탈퇴
                </DangerBtn>
              </DangerItem>
            </DangerBody>
          </DangerZone>
        )}
      </PageLayout>

      {/* 정지 모달 */}
      {suspendOpen && (
        <ModalOverlay onClick={() => setSuspendOpen(false)}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalTitle>회원 정지</ModalTitle>
            <ModalDesc>
              <strong>{member.name}</strong> ({member.email}) 회원을 정지합니다.
            </ModalDesc>

            <FormGroup>
              <FormLabel>정지 유형 *</FormLabel>
              <SuspendOptions>
                {SUSPEND_OPTIONS.map((opt) => (
                  <SuspendOptionCard
                    key={opt.value}
                    $active={suspendOption === opt.value}
                    $danger={opt.isPermanent}
                    onClick={() => setSuspendOption(opt.value)}
                  >
                    <SuspendRadio
                      $active={suspendOption === opt.value}
                      $danger={opt.isPermanent}
                    />
                    <div>
                      <SuspendOptionLabel $danger={opt.isPermanent}>
                        {opt.label}
                      </SuspendOptionLabel>
                      <SuspendOptionDesc>
                        {opt.isPermanent
                          ? '관리자가 해제하기 전까지 영원히 이용 불가'
                          : `${opt.days}일 후 자동 해제`}
                      </SuspendOptionDesc>
                    </div>
                  </SuspendOptionCard>
                ))}
              </SuspendOptions>
            </FormGroup>

            <FormGroup>
              <FormLabel>정지 사유 *</FormLabel>
              <FormTextarea
                rows="3"
                placeholder="회원에게 알림으로 전달될 정지 사유를 입력하세요"
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                maxLength={200}
              />
              <HelpText>{suspendReason.length} / 200</HelpText>
            </FormGroup>

            <ModalActions>
              <ModalBtn onClick={() => setSuspendOpen(false)}>취소</ModalBtn>
              <ModalBtn $danger onClick={handleSuspendConfirm}>
                정지 처리
              </ModalBtn>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}

      {/* 강제 탈퇴 모달 (3중 잠금) */}
      {withdrawOpen && (
        <ModalOverlay onClick={() => setWithdrawOpen(false)}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalTitle $danger>회원 강제 탈퇴</ModalTitle>
            <ModalDesc>
              <strong>{member.name}</strong> ({member.email}) 회원을 즉시 탈퇴
              처리합니다.
              <DangerNote>
                이 작업은 되돌릴 수 없습니다. 회원의 모든
                데이터(예약·리뷰·포인트)가 탈퇴 처리되며 복구할 수 없습니다.
              </DangerNote>
            </ModalDesc>

            <FormGroup>
              <FormLabel>탈퇴 사유 *</FormLabel>
              <FormTextarea
                rows="3"
                placeholder="강제 탈퇴 사유를 입력하세요 (감사 로그에 기록됩니다)"
                value={withdrawReason}
                onChange={(e) => setWithdrawReason(e.target.value)}
                maxLength={200}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>확인 문구 입력 *</FormLabel>
              <FormInput
                placeholder="탈퇴 처리합니다"
                value={withdrawConfirmText}
                onChange={(e) => setWithdrawConfirmText(e.target.value)}
              />
              <HelpText>
                정확히 "<strong>탈퇴 처리합니다</strong>"라고 입력해주세요.
              </HelpText>
            </FormGroup>

            <FormGroup>
              <CheckRow>
                <input
                  type="checkbox"
                  id="withdraw-agree"
                  checked={withdrawAgreed}
                  onChange={(e) => setWithdrawAgreed(e.target.checked)}
                />
                <label htmlFor="withdraw-agree">
                  이 작업이 되돌릴 수 없음을 확인했습니다.
                </label>
              </CheckRow>
            </FormGroup>

            <ModalActions>
              <ModalBtn onClick={() => setWithdrawOpen(false)}>취소</ModalBtn>
              <ModalBtn
                $danger
                disabled={!withdrawConfirmReady}
                onClick={handleWithdrawConfirm}
              >
                강제 탈퇴 처리
              </ModalBtn>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}
    </PageContainer>
  );
}

export default MemberDetailPage;

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

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ProfileImage = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #faf8f3;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;

  svg {
    font-size: 56px;
    color: #c8c4ba;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Name = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

const EmailRow = styled.div`
  font-size: 14px;
  color: #888;
`;

const RoleBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  background: ${(p) => (p.$variant === 'host' ? '#FFE9C2' : '#E8F0DF')};
  color: ${(p) => (p.$variant === 'host' ? '#B07A19' : '#5A6B4F')};
`;

const StatusBadge = styled.span`
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

const SuspendNotice = styled.div`
  margin-top: 16px;
  padding: 12px 16px;
  background: ${(p) =>
    p.$variant === 'withdrawn'
      ? '#F5F5F5'
      : p.$variant === 'banned'
        ? '#FDF1F0'
        : '#FEF6E8'};
  border-left: 3px solid
    ${(p) =>
      p.$variant === 'withdrawn'
        ? '#B0B0B0'
        : p.$variant === 'banned'
          ? '#C9433D'
          : '#D9A441'};
  border-radius: 4px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 13px;

  svg {
    color: ${(p) =>
      p.$variant === 'withdrawn'
        ? '#888'
        : p.$variant === 'banned'
          ? '#C9433D'
          : '#D9A441'};
    margin-top: 3px;
    flex-shrink: 0;
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  strong {
    color: ${(p) =>
      p.$variant === 'withdrawn'
        ? '#666'
        : p.$variant === 'banned'
          ? '#9B3A36'
          : '#9B6A1F'};
    font-weight: 600;
  }

  span {
    color: #666;
  }
`;

const Section = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #eee;
  padding: 24px 28px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 18px 0;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    color: #7a8b71;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px 32px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const InfoLabel = styled.span`
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    font-size: 11px;
  }
`;

const InfoValue = styled.span`
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const SubText = styled.span`
  font-size: 13px;
  color: #999;
`;

const WarnText = styled.span`
  font-size: 12px;
  color: #c9433d;
  font-weight: 500;
`;

const VerifiedTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 8px;
  background: #e8f0df;
  color: #5a6b4f;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
`;

const UnverifiedTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 8px;
  background: #ffe9e5;
  color: #c9433d;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
`;

const ToggleBtn = styled.button`
  font-size: 12px;
  color: #7a8b71;
  background: transparent;
  border: 1px solid #d4d8cf;
  padding: 3px 8px;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: inherit;
  transition: all 150ms ease;

  &:hover {
    background: #f9faf8;
    border-color: #a8b89f;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatBox = styled.div`
  padding: 18px;
  background: #faf8f3;
  border-radius: 10px;
  text-align: center;
`;

const StatNum = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #333;
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: #888;
  margin-top: 4px;
`;

const StatSub = styled.div`
  font-size: 12px;
  color: #7a8b71;
  margin-top: 4px;
  font-weight: 500;
`;

const DocLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #faf8f3;
  border: 1px solid #e0ddd5;
  border-radius: 6px;
  color: #555;
  text-decoration: none;
  font-size: 13px;
  transition: all 150ms ease;

  &:hover {
    background: #f1ede4;
    border-color: #a8b89f;
    color: #333;
  }
`;

const HostNote = styled.p`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed #eee;
  font-size: 13px;
  color: #888;
`;

const HostLink = styled.span`
  color: #7a8b71;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: #5a6b4f;
  }
`;

const HistoryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

const Th = styled.th`
  background: #faf8f3;
  color: #555;
  font-weight: 600;
  text-align: left;
  padding: 12px 14px;
  border-bottom: 1px solid #eee;
  white-space: nowrap;
  font-size: 13px;
  width: ${(p) => p.$w || 'auto'};
`;

const Td = styled.td`
  padding: 12px 14px;
  border-bottom: 1px solid #f4f1eb;
  color: #444;
`;

const SanctionBadge = styled.span`
  display: inline-block;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
  background: ${({ $status }) =>
    $status === 'ACTIVE'
      ? '#FBE4C2'
      : $status === 'EXPIRED'
        ? '#EEE'
        : '#E1ECDD'};
  color: ${({ $status }) =>
    $status === 'ACTIVE'
      ? '#9B6A1F'
      : $status === 'EXPIRED'
        ? '#888'
        : '#5A6B4F'};
`;

const ActionRow = styled.div`
  display: flex;
  gap: 10px;
`;

const PrimaryBtn = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 150ms ease;
  ${(p) =>
    p.$variant === 'warning'
      ? `
    background: #fff;
    color: #C9433D;
    border: 1.5px solid #E8B5B2;
    &:hover { background: #FDF1F0; border-color: #C9433D; }
  `
      : `
    background: #7A8B71;
    color: white;
    border: 1.5px solid #7A8B71;
    &:hover { background: #6B7A63; }
  `}
`;

// 위험 작업 영역 (GitHub Danger Zone 패턴)
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

const BlockReason = styled.div`
  font-size: 12px;
  color: #c9433d;
  margin-top: 6px;
  font-weight: 500;
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

  &:hover:not(:disabled) {
    background: #c9433d;
    color: white;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

// 모달 (목록 페이지랑 동일 톤)
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
  max-width: 460px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  animation: modalIn 200ms ease-out;

  @keyframes modalIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
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

const DangerNote = styled.div`
  margin-top: 10px;
  padding: 10px 14px;
  background: #fdf1f0;
  border-left: 3px solid #c9433d;
  border-radius: 4px;
  font-size: 13px;
  color: #9b3a36;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

// 정지 옵션 라디오 카드
const SuspendOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SuspendOptionCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1.5px solid
    ${(p) => (p.$active ? (p.$danger ? '#C9433D' : '#a8b89f') : '#e8e6e0')};
  background: ${(p) =>
    p.$active ? (p.$danger ? '#FDF1F0' : '#F5F8F1') : '#fff'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 150ms ease;

  &:hover {
    border-color: ${(p) => (p.$danger ? '#C9433D' : '#a8b89f')};
  }
`;

const SuspendRadio = styled.span`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid
    ${(p) => (p.$active ? (p.$danger ? '#C9433D' : '#7A8B71') : '#cfcbc2')};
  flex-shrink: 0;
  position: relative;

  ${(p) =>
    p.$active &&
    `
    &::after {
      content: '';
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 7px; height: 7px;
      border-radius: 50%;
      background: ${p.$danger ? '#C9433D' : '#7A8B71'};
    }
  `}
`;

const SuspendOptionLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${(p) => (p.$danger ? '#C9433D' : '#333')};
`;

const SuspendOptionDesc = styled.div`
  font-size: 12px;
  color: #888;
  margin-top: 2px;
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
