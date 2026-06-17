import styled from 'styled-components';
import { COLOR } from '../../rsvn/components/user/RsvnStyled';

const TopSpacesSection = ({ TOP_SPACES = [], navigate, TYPE_MAP }) => (
  <Section style={{ paddingTop: 0 }}>
    <SectionRow>
      <div>
        <SectionTitle>가장 사랑받은 공간</SectionTitle>
        <SectionSub>평점 + 예약 기반 상위 공간</SectionSub>
      </div>
    </SectionRow>
    <RankGrid>
      {TOP_SPACES.map((s, i) => (
        <RankCard
          key={i}
          onClick={() =>
            navigate(`/spaces/${s.placeNo}/rooms`, {
              state: { space: { type: s.type, title: s.title, thumbnailUrl: s.mainImageUrl ?? null } },
            })
          }
        >
          <RankNum>{i + 1}</RankNum>
          <div style={{ fontSize: 32, marginBottom: 10 }}>{s.icon}</div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
            {s.title}
          </div>
          <TypeTag>{TYPE_MAP[s.type] || s.type}</TypeTag>
          <div style={{ fontSize: 13, color: '#C97D4C', marginTop: 6 }}>
            ★ {s.avgReviewScore?.toFixed(1) ?? 0}
          </div>
        </RankCard>
      ))}
    </RankGrid>
  </Section>
);

const Section = styled.section`
  max-width: 1100px;
  margin: 0 auto;
  padding: 60px 24px;
`;
const SectionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 28px;
`;
const SectionTitle = styled.h2`
  font-family: 'DM Serif Display', serif;
  font-size: 28px;
  color: ${COLOR.black};
  margin-bottom: 6px;
`;
const SectionSub = styled.p`
  font-size: 13px;
  color: ${COLOR.gray400};
`;
const RankGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
`;
const RankCard = styled.div`
  border: 1px solid ${COLOR.gray200};
  border-radius: 12px;
  padding: 20px 16px;
  background: #fff;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.07);
  }
`;
const RankNum = styled.div`
  font-family: 'DM Serif Display', serif;
  font-size: 24px;
  color: ${COLOR.gray400};
  margin-bottom: 10px;
`;
const TypeTag = styled.span`
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(168, 184, 159, 0.18);
  color: #5b6b53;
`;

export default TopSpacesSection;
