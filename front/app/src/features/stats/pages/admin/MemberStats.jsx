import styled from 'styled-components';
import { FaInfoCircle, FaUsers, FaUserPlus, FaUserCheck, FaUserClock } from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { StatCard } from '../../../pay_shared/components/StatCard';
import { Card, Section, EmptyState, Badge } from '../../../pay_shared/components';

const KPIS = [
  { key: 'total', label: '누적 회원', unit: '명', icon: <FaUsers /> },
  { key: 'newSignup', label: '신규 가입', unit: '명', icon: <FaUserPlus /> },
  { key: 'active', label: '활성 회원', unit: '명', icon: <FaUserCheck /> },
  { key: 'dormant', label: '휴면 회원', unit: '명', icon: <FaUserClock /> },
];

export default function MemberStats() {
  return (
    <PageLayout title="회원 통계" description="회원 가입·활동 추이와 등급 분포" maxWidth={1200}>
      <NoticeCard padded>
        <NoticeIcon><FaInfoCircle /></NoticeIcon>
        <NoticeText>
          회원 통계는 1번 도메인(회원·인증) Entity 채움 + 통계 적재 합류 후 활성화됩니다.
          현재 MemberEntity는 빈 껍데기 상태(본인 SSOT).
        </NoticeText>
      </NoticeCard>

      <KPIGrid>
        {KPIS.map((k) => (
          <StatCard key={k.key} label={k.label} value="—" unit={k.unit} icon={k.icon} />
        ))}
      </KPIGrid>

      <Section title="회원 분포" action={<Badge>회원 도메인 통합 대기</Badge>}>
        <EmptyCard padded>
          <EmptyState
            icon="👤"
            title="회원 통계 통합 대기"
            description="1번 도메인 회원 Entity 완성 + 통계 적재 파이프라인 합류 후 노출됩니다."
          />
        </EmptyCard>
      </Section>
    </PageLayout>
  );
}

const NoticeCard = styled(Card)`
  display: flex; align-items: flex-start; gap: var(--space-3);
  margin-bottom: var(--space-5);
  background: var(--cream); border-color: var(--sage);
`;
const NoticeIcon = styled.div`font-size: 1.1rem; color: var(--sage); flex-shrink: 0; margin-top: 2px;`;
const NoticeText = styled.p`font-size: 0.85rem; color: var(--gray-800); line-height: 1.6; margin: 0;`;
const KPIGrid = styled.div`
  display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-3);
  margin-bottom: var(--space-5);
  @media (max-width: 960px) { grid-template-columns: repeat(2, 1fr); }
`;
const EmptyCard = styled(Card)`padding: var(--space-6) var(--space-5);`;
