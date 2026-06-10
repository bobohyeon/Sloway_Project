import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
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
import { useHostDetail } from '../../hooks/useHostDetail';
import {
  PageContainer,
  HeaderCard,
  HeaderTop,
  SubText,
  StatusBadge,
  BusinessName,
  HostRow,
  Dot,
  RatingRow,
  Stars,
  RevokedNotice,
  MemberLink,
  StatsGrid,
  StatBox,
  StatIcon,
  StatBody,
  StatLabel,
  StatValue,
  StatSub,
  TwoCol,
  InfoCard,
  CardTitleRow,
  CardTitle,
  InfoRow,
  Label,
  Value,
  VerifyBox,
  RevenueChart,
  RevenueBar,
  RevenueMonth,
  RevenueBarTrack,
  RevenueBarFill,
  RevenueAmount,
  EmptySpace,
  SpaceList,
  SpaceCard,
  SpaceLeft,
  SpaceIconWrap,
  SpaceInfo,
  SpaceName,
  SpaceTypeBadge,
  SpaceMeta,
  SpaceStatus,
  DangerZone,
  DangerHeader,
  DangerTitle,
  DangerDesc,
  DangerBody,
  DangerItem,
  DangerItemTitle,
  DangerItemDesc,
  DangerBtn,
  ActionCard,
  ActionInfo,
  RestoreBtn,
  ModalOverlay,
  ModalCard,
  ModalTitle,
  ModalDesc,
  ImpactBox,
  ImpactTitle,
  ImpactItem,
  ImpactLabel,
  ImpactValue,
  ImpactWarn,
  FormGroup,
  FormLabel,
  FormInput,
  FormTextarea,
  HelpText,
  CheckRow,
  ModalActions,
  ModalBtn,
} from './HostDetailPage.styled';

// ─────────────────────────────────────────────
// 라벨/헬퍼
// ─────────────────────────────────────────────
const STATUS_LABEL = {
  ACTIVE: '정상',
  REVOKED: '자격 취소',
  REJECTED: '반려',
  PENDING: '승인 대기',
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

  const { host, loading, error, revoke, restore, reReview } =
    useHostDetail(hostId);

  // 자격 취소 모달
  const [revokeOpen, setRevokeOpen] = useState(false);
  const [revokeReason, setRevokeReason] = useState('');
  const [revokeConfirmText, setRevokeConfirmText] = useState('');
  const [revokeAgreed, setRevokeAgreed] = useState(false);

  // 월별 매출 — 최대값 기준 막대 너비 (host null 안전)
  const maxRevenue = useMemo(
    () => Math.max(...(host?.monthlyRevenue ?? []).map((m) => m.revenue), 1),
    [host]
  );

  if (loading) {
    return (
      <PageLayout>
        <PageContainer>로딩 중...</PageContainer>
      </PageLayout>
    );
  }

  if (error || !host) {
    return (
      <PageLayout>
        <PageContainer>
          {error ?? '호스트 정보를 찾을 수 없습니다.'}
        </PageContainer>
      </PageLayout>
    );
  }

  const isActive = host.status === 'ACTIVE';
  const isRevoked = host.status === 'REVOKED';
  const isRejected = host.status === 'REJECTED';

  const revokeConfirmReady =
    revokeConfirmText === '자격을 취소합니다' &&
    revokeAgreed &&
    revokeReason.trim().length > 0;

  // ─── 핸들러 ──────────────────────────
  const openRevokeModal = () => {
    setRevokeReason('');
    setRevokeConfirmText('');
    setRevokeAgreed(false);
    setRevokeOpen(true);
  };

  const confirmRevoke = async () => {
    if (!revokeConfirmReady) return;
    try {
      await revoke(revokeReason);
      setRevokeOpen(false);
      alert('호스트 자격이 취소되었습니다.');
    } catch (err) {
      alert(err.response?.data?.message ?? '자격 취소에 실패했습니다.');
    }
  };

  const handleRestore = async () => {
    if (
      !window.confirm(
        `${host.name} (${host.businessName})의 호스트 자격을 복원하시겠습니까?`
      )
    )
      return;
    try {
      await restore();
    } catch (err) {
      alert(err.response?.data?.message ?? '자격 복구에 실패했습니다.');
    }
  };

  const handleReReview = async () => {
    if (
      !window.confirm(
        '이 호스트 신청을 재검토(대기 상태로 되돌리기) 하시겠습니까?\n반려 사유는 초기화되며 다시 심사 대기로 전환됩니다.'
      )
    )
      return;
    try {
      await reReview();
      alert('재검토로 전환되었습니다. 다시 심사 대기 상태입니다.');
    } catch (err) {
      alert(err.response?.data?.message ?? '재검토 전환에 실패했습니다.');
    }
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
            <SubText>승인일 {host.approvedAt ?? '-'}</SubText>
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

          {/* 평점 — 리뷰 도메인 연동 예정 */}
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
                <span>{host.rejectReason}</span>
              </div>
            </RevokedNotice>
          )}

          {/* 회원 정보 바로가기 */}
          <MemberLink onClick={() => navigate(`/admin/members/${host.hostId}`)}>
            회원 상세 페이지에서 일반회원 정보·활동 이력 보기 →
          </MemberLink>
        </HeaderCard>

        {/* 운영 통계 4개 — 타 도메인 연동 예정 */}
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
              <Label>사업자번호</Label>
              <Value>{host.businessNumber}</Value>
            </InfoRow>
            <InfoRow>
              <Label>대표자명</Label>
              <Value>{host.name}</Value>
            </InfoRow>
            <InfoRow>
              <Label>신청일</Label>
              <Value>{host.createdAt ?? '-'}</Value>
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
                    <strong>정산 도메인 연동 예정</strong>
                  </div>
                </>
              )}
            </VerifyBox>
          </InfoCard>
        </TwoCol>

        {/* 월별 매출 추이 — 정산 도메인 연동 예정 */}
        <InfoCard>
          <CardTitle>
            <FaChartLine /> 월별 매출 추이
          </CardTitle>
          {host.monthlyRevenue.length === 0 ? (
            <EmptySpace>정산 도메인 연동 시 표시됩니다.</EmptySpace>
          ) : (
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
          )}
        </InfoCard>

        {/* 운영 공간 목록 — 공간 도메인 연동 예정 */}
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
                : '공간 도메인 연동 시 표시됩니다.'}
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
        {isRejected && (
          <ActionCard>
            <ActionInfo>
              이 호스트 신청은 반려된 상태입니다.
              {host.rejectReason && (
                <>
                  {' '}
                  반려 사유: <strong>{host.rejectReason}</strong>
                </>
              )}
              <br />
              서류가 보완되었다면 재검토로 전환해 다시 심사 대기 상태로 되돌릴
              수 있습니다.
            </ActionInfo>
            <RestoreBtn onClick={handleReReview}>
              재검토 (대기로 되돌리기)
            </RestoreBtn>
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
