import styled from 'styled-components';
import { FaInfoCircle, FaHome, FaPlusCircle, FaCheckCircle, FaPause } from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { StatCard } from '../../../pay_shared/components/StatCard';
import { Card, Section, EmptyState, Badge } from '../../../pay_shared/components';

const KPIS = [
  { key: 'total', label: '등록 공간', unit: '개', icon: <FaHome /> },
  { key: 'newReg', label: '신규 등록', unit: '개', icon: <FaPlusCircle /> },
  { key: 'active', label: '운영 중', unit: '개', icon: <FaCheckCircle /> },
  { key: 'paused', label: '일시 중지', unit: '개', icon: <FaPause /> },
];

export default function SpaceStats() {
  return (
    <PageLayout title="공간 통계" description="공간 등록·이용 현황과 타입별 분포" maxWidth={1200}>
      <NoticeCard padded>
        <NoticeIcon><FaInfoCircle /></NoticeIcon>
        <NoticeText>
          공간 통계는 2번 도메인(공간·오피스·액티비티) Repository 합류 후 적재됩니다.
          공간 타입별(숙소/워크앤스테이/코워킹) 통계는 본인 5/27 SSOT에서 제외 결정 — 본 페이지는 운영 현황 위주.
        </NoticeText>
      </NoticeCard>

      <KPIGrid>
        {KPIS.map((k) => (
          <StatCard key={k.key} label={k.label} value="—" unit={k.unit} icon={k.icon} />
        ))}
      </KPIGrid>

      <Section title="공간 분포" action={<Badge>공간 도메인 통합 대기</Badge>}>
        <EmptyCard padded>
          <EmptyState
            icon="🏠"
            title="공간 통계 통합 대기"
            description="2번 도메인 공간 Repository 및 통계 적재 파이프라인 합류 후 노출됩니다."
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
