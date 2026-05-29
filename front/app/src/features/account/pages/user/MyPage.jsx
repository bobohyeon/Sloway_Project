import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaLock,
  FaCalendarAlt,
  FaCoins,
  FaTicketAlt,
  FaHeart,
  FaChevronRight,
  FaStore,
} from 'react-icons/fa';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import { useMyPage } from '../../hooks/useMyPage';

// ─── 더미 데이터 (백엔드 연동 후 API로 교체) ───────────────
const DUMMY_USER = {
  name: '홍길동',
  email: 'hong@sloway.co.kr',
  grade: '새싹 등급',
  profileImg: null,
  point: 2450,
  coupon: 3,
  joinDate: '2024.03.15',
};

const DUMMY_RESERVATIONS = [
  {
    id: 1,
    spaceName: '제주 돌담집 리트릿',
    type: '숙소',
    checkIn: '2026.05.20',
    status: 'S',
  },
  {
    id: 2,
    spaceName: '판교 테크오피스',
    type: '코워킹',
    checkIn: '2026.05.15',
    status: 'E',
  },
  {
    id: 3,
    spaceName: '성수 워크앤스테이',
    type: '워크앤스테이',
    checkIn: '2026.04.30',
    status: 'C',
  },
];

const STATUS_LABEL = { S: '확정', E: '이용완료', C: '취소', R: '거절' };
const STATUS_COLOR = { S: '#5a7a42', E: '#A8B89F', C: '#e24b4a', R: '#e24b4a' };

// ─── Styled Components ─────────────────────────────────────
const CardStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// 프로필 카드
const ProfileCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 28px;
  display: flex;
  align-items: center;
  gap: 24px;
  border: 1px solid #e8e4dc;
`;

const Avatar = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--sage);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: bold;
  flex-shrink: 0;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 4px;
`;

const UserMeta = styled.p`
  font-size: 13px;
  color: var(--gray-400);
  margin-bottom: 8px;
`;

const GradeBadge = styled.span`
  display: inline-block;
  padding: 3px 10px;
  background: rgba(168, 184, 159, 0.15);
  color: #5b6b53;
  font-size: 11px;
  font-weight: 500;
  border-radius: 99px;
`;

const ProfileActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid var(--gray-200);
  background: #fff;
  color: var(--gray-800);

  &:hover {
    border-color: var(--sage);
    color: var(--sage);
  }
`;

// 통계 카드
const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
`;

const StatCard = styled.div`
  background: #fff;
  border-radius: 14px;
  padding: 20px;
  border: 1px solid #e8e4dc;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
  }
`;

const StatIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${(p) => p.$bg || 'rgba(168,184,159,0.15)'};
  color: ${(p) => p.$color || '#5b6b53'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
`;

const StatInfo = styled.div``;

const StatValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: var(--gray-800);
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: var(--gray-400);
  margin-top: 2px;
`;

// 섹션
const Section = styled.div`
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e8e4dc;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid #f0ede6;
`;

const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: var(--gray-800);
`;

const SeeAllBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--gray-400);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: var(--sage);
  }
`;

// 예약 목록
const ReservationList = styled.div``;

const ReservationItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #f5f3ef;
  cursor: pointer;
  transition: background 0.15s;

  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: #faf9f6;
  }
`;

const RsvnInfo = styled.div`
  flex: 1;
`;

const RsvnName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 3px;
`;

const RsvnMeta = styled.div`
  font-size: 12px;
  color: var(--gray-400);
`;

const RsvnStatus = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${(p) => p.$color};
  margin-right: 12px;
`;

// 퀵 메뉴
const QuickMenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
`;

const QuickMenuItem = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 12px;
  border: none;
  background: none;
  cursor: pointer;
  border-right: 1px solid #f0ede6;
  transition: background 0.15s;
  color: var(--gray-600);
  font-size: 12px;
  font-weight: 500;

  &:last-child {
    border-right: none;
  }
  &:hover {
    background: #faf9f6;
    color: var(--sage);
  }

  svg {
    font-size: 20px;
  }
`;

const BannerText = styled.div``;

const BannerTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
`;

const BannerDesc = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
`;

const BannerArrow = styled.div`
  color: #fff;
  font-size: 20px;
`;

// ─── 컴포넌트 ───────────────────────────────────────────────
function MyPage() {
  const navigate = useNavigate();
  const { data: profile } = useMyPage(); // 프로필(이름/이메일/사진) 실데이터
  const user = DUMMY_USER; // 통계·예약용 더미 (나중에 본인이 교체)

  return (
    <PageLayout>
      <CardStack>
        {/* 프로필 카드 */}
        <ProfileCard>
          <Avatar>
            {profile?.imgUrl ? (
              <img
                src={profile.imgUrl}
                alt="프로필"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              (profile?.name?.[0] ?? 'U')
            )}
          </Avatar>
          <ProfileInfo>
            <UserName>{profile?.name ?? '회원'}님</UserName>
            <UserMeta>{profile?.email ?? ''}</UserMeta>
            <GradeBadge>{user.grade}</GradeBadge>
          </ProfileInfo>
          <ProfileActions>
            <ActionBtn onClick={() => navigate('/user/profile')}>
              <FaUser size={12} /> 내 정보 수정
            </ActionBtn>
            <ActionBtn onClick={() => navigate('/user/password')}>
              <FaLock size={12} /> 비밀번호 변경
            </ActionBtn>
          </ProfileActions>
        </ProfileCard>

        {/* ↓ 통계·퀵메뉴·최근예약 카드는 그대로 (네가 알아서 할 부분) */}

        {/* 통계 카드 3개 */}
        <StatsRow>
          <StatCard onClick={() => navigate('/user/reservation')}>
            <StatIcon $bg="rgba(168,184,159,0.15)" $color="#5b6b53">
              <FaCalendarAlt />
            </StatIcon>
            <StatInfo>
              <StatValue>2</StatValue>
              <StatLabel>진행중인 예약</StatLabel>
            </StatInfo>
          </StatCard>

          <StatCard onClick={() => navigate('/user/point')}>
            <StatIcon $bg="rgba(212,134,31,0.12)" $color="#b8730f">
              <FaCoins />
            </StatIcon>
            <StatInfo>
              <StatValue>{user.point.toLocaleString()}P</StatValue>
              <StatLabel>보유 포인트</StatLabel>
            </StatInfo>
          </StatCard>

          <StatCard onClick={() => navigate('/user/coupon')}>
            <StatIcon $bg="rgba(184,90,78,0.12)" $color="#a04c42">
              <FaTicketAlt />
            </StatIcon>
            <StatInfo>
              <StatValue>{user.coupon}장</StatValue>
              <StatLabel>사용 가능한 쿠폰</StatLabel>
            </StatInfo>
          </StatCard>
        </StatsRow>

        {/* 퀵 메뉴 */}
        <Section>
          <QuickMenuGrid>
            <QuickMenuItem onClick={() => navigate('/user/reservation')}>
              <FaCalendarAlt /> 예약 내역
            </QuickMenuItem>
            <QuickMenuItem onClick={() => navigate('/user/wishlist')}>
              <FaHeart /> 찜 목록
            </QuickMenuItem>
            <QuickMenuItem onClick={() => navigate('/user/review')}>
              ⭐ 내 리뷰
            </QuickMenuItem>
            <QuickMenuItem onClick={() => navigate('/user/inquiry')}>
              💬 내 문의
            </QuickMenuItem>
          </QuickMenuGrid>
        </Section>

        {/* 최근 예약 */}
        <Section>
          <SectionHeader>
            <SectionTitle>최근 예약</SectionTitle>
            <SeeAllBtn onClick={() => navigate('/user/reservation')}>
              전체보기 <FaChevronRight size={10} />
            </SeeAllBtn>
          </SectionHeader>
          <ReservationList>
            {DUMMY_RESERVATIONS.map((r) => (
              <ReservationItem
                key={r.id}
                onClick={() => navigate(`/user/reservation/${r.id}`)}
              >
                <RsvnInfo>
                  <RsvnName>{r.spaceName}</RsvnName>
                  <RsvnMeta>
                    {r.type} · 체크인 {r.checkIn}
                  </RsvnMeta>
                </RsvnInfo>
                <RsvnStatus $color={STATUS_COLOR[r.status]}>
                  {STATUS_LABEL[r.status]}
                </RsvnStatus>
                <FaChevronRight size={12} color="#ccc" />
              </ReservationItem>
            ))}
          </ReservationList>
        </Section>
      </CardStack>
    </PageLayout>
  );
}

export default MyPage;
