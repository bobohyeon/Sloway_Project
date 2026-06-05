import styled from 'styled-components';
import { COLOR } from '../../rsvn/components/user/RsvnStyled';

const RecommendedSection = ({
  RECOMMENDED = [],
  goSearch,
  goDetail,
  TYPE_MAP,
}) => (
  <Section style={{ paddingTop: 0 }}>
    <SectionRow>
      <div>
        <SectionTitle>이번 주 새싹 추천</SectionTitle>
        <SectionSub>평점과 인기도를 바탕으로 큐레이션했어요</SectionSub>
      </div>
      <MoreLink onClick={goSearch}>전체 보기 →</MoreLink>
    </SectionRow>
    <RecoGrid>
      {RECOMMENDED.map((s, i) => (
        <RecoCard key={i} onClick={() => goDetail(s.type, s.placeNo)}>
          <RecoImg>
            {s.mainImageUrl}
            {s.new && <RecoBadge>새싹</RecoBadge>}
          </RecoImg>
          <RecoBody>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 6,
              }}
            >
              <RecoType>{TYPE_MAP[s.type] || s.type}</RecoType>
              <span
                style={{
                  fontSize: 12,
                  color: COLOR.gray400,
                }}
              >
                ★ {s.finalScore}점
              </span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3 }}>
              {s.title}
            </div>
            <div
              style={{ fontSize: 12, color: COLOR.gray400, marginBottom: 10 }}
            >
              📍 {s.address}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>
              {s.price?.toLocaleString() || 0} 원{' '}
              <span
                style={{ fontSize: 12, fontWeight: 400, color: COLOR.gray400 }}
              >
                {s.type === 'OFFICE' ? '/1시간' : '/1박'}
              </span>
            </div>
          </RecoBody>
        </RecoCard>
      ))}
    </RecoGrid>
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
const MoreLink = styled.button`
  font-size: 13px;
  color: ${COLOR.green};
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }
`;
const RecoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;
const RecoCard = styled.div`
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid ${COLOR.gray200};
  background: #fff;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
`;
const RecoImg = styled.div`
  height: 160px;
  background-color: ${COLOR.cream};
  /* 이미지를 배경으로 설정 */
  background-image: ${({ url }) => (url ? `url(${url})` : 'none')};
  background-size: cover; /* 이미지가 영역에 꽉 차게 */
  background-position: center; /* 이미지 중앙 정렬 */
  position: relative;
`;
const RecoBadge = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 3px 9px;
  border-radius: 10px;
  background: rgba(45, 106, 79, 0.85);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
`;
const RecoBody = styled.div`
  padding: 14px 16px;
`;
const RecoType = styled.span`
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(168, 184, 159, 0.18);
  color: #5b6b53;
`;

export default RecommendedSection;
