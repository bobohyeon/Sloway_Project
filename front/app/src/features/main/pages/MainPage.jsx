import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { COLOR } from '../../rsvn/components/user/RsvnStyled';
import MainHeader from '../layouts/MainHeader';
import TopSpacesSection from './../components/TopSpacesSection';
import RecommendedSection from './../components/RecommendedSection';
import WorkationBanner from './../components/WorkationBanner';
import { useRecommend } from '../hooks/useRecommend';

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-6px); }
`;

// ── 히어로 ────────────────────────────────────────────────
const Hero = styled.section`
  min-height: 520px;
  background: linear-gradient(160deg, #eef5ee 0%, #f4efe6 40%, #d8e8d8 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 24px 80px;
  position: relative;
`;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  background: rgba(45, 106, 79, 0.1);
  color: ${COLOR.green};
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 20px;
`;

const HeroTitle = styled.h1`
  font-family: 'DM Serif Display', serif;
  font-size: 52px;
  font-weight: 400;
  color: ${COLOR.black};
  line-height: 1.25;
  margin-bottom: 16px;

  em {
    color: ${COLOR.green};
    font-style: italic;
  }
`;

const HeroSub = styled.p`
  font-size: 15px;
  color: #4a4a4a;
  line-height: 1.7;
  margin-bottom: 36px;
  max-width: 480px;
`;

// ── 검색바 ────────────────────────────────────────────────
const SearchBox = styled.div`
  display: flex;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
  max-width: 680px;
`;

const SearchField = styled.div`
  flex: 1;
  padding: 16px 20px;
  border-right: 1px solid ${COLOR.gray200};
  cursor: text;

  &:last-of-type {
    border-right: none;
  }
`;

const SearchLabel = styled.div`
  font-size: 10px;
  font-weight: 700;
  color: ${COLOR.gray400};
  letter-spacing: 0.06em;
  margin-bottom: 4px;
`;

const SearchValue = styled.div`
  font-size: 14px;
  color: ${({ $placeholder }) => ($placeholder ? COLOR.gray400 : COLOR.black)};
`;

const SearchBtn = styled.button`
  padding: 0 28px;
  background: ${COLOR.green};
  color: #fff;
  border: none;
  font-size: 15px;
  font-weight: 700;
  font-family: 'Noto Sans KR', sans-serif;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
  &:hover {
    background: #1a3a2a;
  }
`;

// ── 공통 섹션 ─────────────────────────────────────────────
const Section = styled.section`
  max-width: 1100px;
  margin: 0 auto;
  padding: 60px 24px;
`;

const SectionHeader = styled.div`
  margin-bottom: 28px;
`;

const SectionTitle = styled.h2`
  font-family: 'DM Serif Display', serif;
  font-size: 28px;
  font-weight: 400;
  color: ${COLOR.black};
  margin-bottom: 6px;
`;

const SectionSub = styled.p`
  font-size: 13px;
  color: ${COLOR.gray400};
`;

const SectionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 28px;
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

// ── 공간 유형 카드 ────────────────────────────────────────
const TypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`;

const TypeCard = styled.div`
  border: 1px solid ${COLOR.gray200};
  border-radius: 14px;
  padding: 28px 24px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: ${COLOR.green};
    box-shadow: 0 4px 16px rgba(45, 106, 79, 0.1);
    transform: translateY(-2px);
  }
`;

const TypeIcon = styled.div`
  font-size: 36px;
  margin-bottom: 12px;
  display: inline-block;
  animation: ${float} 3s ease-in-out infinite;
`;

const TypeArrow = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 16px;
  color: ${COLOR.gray400};
`;

// ── 브랜드 가치 섹션 ──────────────────────────────────────
const ValueSection = styled.section`
  background: #f2f7f2;
  padding: 52px 24px;
`;

const ValueInner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
`;

const ValueTitle = styled.h2`
  font-family: 'DM Serif Display', serif;
  font-size: 28px;
  font-weight: 400;
  color: ${COLOR.black};
  line-height: 1.4;
  margin-bottom: 12px;
`;

const ValueSub = styled.p`
  font-size: 13px;
  color: ${COLOR.gray400};
`;

const ValueItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ValueItem = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
`;

const ValueNum = styled.div`
  font-family: 'DM Serif Display', serif;
  font-size: 18px;
  color: ${COLOR.green};
  flex-shrink: 0;
  margin-top: 2px;
`;

const TypeTag = styled.span`
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(168, 184, 159, 0.18);
  color: #5b6b53;
`;

function MainPage() {
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [spaceType, setSpaceType] = useState('전체');
  const [region, setRegion] = useState('전체');
  const {
    RECOMMENDED,
    TOP_SPACES,
    TYPE_MAP,
    RANDOM_PLACE,
    goSearch,
    goDetail,

    navigate,
  } = useRecommend();

  const REGIONS = [
    '전체',
    '서울',
    '경기',
    '강원',
    '경상',
    '충청',
    '전라',
    '제주',
  ];

  // 공간 유형 클릭 → 유형 필터 적용해서 검색
  const goSearchByType = (type) => {
    navigate('/spaces/search', {
      state: { type, region: location || '전체', guests },
    });
  };

  return (
    <div
      style={{ fontFamily: "'Noto Sans KR', sans-serif", background: '#fff' }}
    >
      <MainHeader />

      {/* ── 히어로 ── */}
      <Hero>
        <HeroBadge>🌿 천천히, 머물면서 일하기</HeroBadge>
        <HeroTitle>
          도시를 떠나
          <br />
          <em>느린 워케이션</em>을 시작해요
        </HeroTitle>
        <HeroSub>
          자연과 가까운 곳에서 일하고, 쉬고, 연결되세요.
          <br />
          Sloway는 워크앤스테이·오피스·숙소를 한 곳에서 예약합니다.
        </HeroSub>

        <SearchBox>
          {/* 어디로 */}
          <SearchField as="div" style={{ padding: '14px 20px', flex: 1 }}>
            <SearchLabel>어디로</SearchLabel>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: 14,
                outline: 'none',
                fontFamily: 'inherit',
                color: region === '전체' ? '#aaa' : '#1A1A1A',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </SearchField>
          {/* 공간 유형 */}
          <SearchField style={{ flex: 1 }}>
            <SearchLabel>공간 유형</SearchLabel>
            <select
              value={spaceType}
              onChange={(e) => setSpaceType(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: 14,
                outline: 'none',
                fontFamily: 'inherit',
                color: '#1A1A1A',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              <option value="전체">전체</option>
              <option value="워크앤스테이">워크앤스테이</option>
              <option value="오피스">오피스</option>
              <option value="숙소">숙소</option>
            </select>
          </SearchField>
          {/* 인원 */}
          <SearchField style={{ flex: 1 }}>
            <SearchLabel>인원</SearchLabel>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
              }}
            >
              <button
                onClick={() => setGuests((g) => Math.max(1, g - 1))}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  border: '1px solid #E0D8C8',
                  background: '#fff',
                  cursor: 'pointer',
                  fontSize: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                −
              </button>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  minWidth: 28,
                  textAlign: 'center',
                }}
              >
                {guests}명
              </span>
              <button
                onClick={() => setGuests((g) => g + 1)}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  border: '1px solid #E0D8C8',
                  background: '#fff',
                  cursor: 'pointer',
                  fontSize: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                +
              </button>
            </div>
          </SearchField>
          <SearchBtn onClick={goSearch}>검색</SearchBtn>
        </SearchBox>
      </Hero>

      {/* ── 공간 유형 선택 ── */}
      <Section>
        <SectionHeader>
          <SectionTitle>어떤 공간이 필요하세요?</SectionTitle>
          <SectionSub>목적에 맞는 공간을 선택해보세요</SectionSub>
        </SectionHeader>
        <TypeGrid>
          {[
            {
              icon: '🌿',
              title: '워크앤스테이',
              desc: '일과 쉼이 공존하는 공간',
              type: '워크앤스테이',
            },
            {
              icon: '💻',
              title: '오피스',
              desc: '집중이 필요한 업무 공간',
              type: '오피스',
            },
            {
              icon: '🛌',
              title: '숙소',
              desc: '편안한 휴식을 위한 공간',
              type: '숙소',
            },
          ].map((t, i) => (
            <TypeCard key={i} onClick={() => goSearchByType(t.type)}>
              <TypeArrow>→</TypeArrow>
              <TypeIcon>{t.icon}</TypeIcon>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: COLOR.black,
                  marginBottom: 6,
                }}
              >
                {t.title}
              </div>
              <div style={{ fontSize: 13, color: COLOR.gray400 }}>{t.desc}</div>
            </TypeCard>
          ))}
        </TypeGrid>
      </Section>

      {/* 1. 추천 섹션 */}
      <RecommendedSection
        RECOMMENDED={RECOMMENDED}
        goSearch={goSearch}
        goDetail={goDetail}
        TYPE_MAP={TYPE_MAP}
      />

      {/* 2. 인기 공간 섹션 */}
      <TopSpacesSection
        TOP_SPACES={TOP_SPACES}
        navigate={navigate}
        TYPE_MAP={TYPE_MAP}
      />

      {/* ── 워케이션 추천 배너 ── */}
      <WorkationBanner
        onBookClick={() => navigate(`/workstays/${RANDOM_PLACE.workStayNo}`)}
        RANDOM_PLACE={RANDOM_PLACE}
      />

      {/* ── Sloway 가치 섹션 ── */}
      <ValueSection>
        <ValueInner>
          <div>
            <ValueTitle>
              Sloway가 담는
              <br />세 가지 가치
            </ValueTitle>
            <ValueSub>빠름이 아닌 속도로, 일과 삶을 설계합니다.</ValueSub>
          </div>
          <ValueItems>
            {[
              {
                num: '01',
                title: '자연 가까이',
                desc: '숲·바다·산이 기문을 열고 어디서 집중하세요.',
              },
              {
                num: '02',
                title: '편안한 업무',
                desc: '모니터·프린터·화의실, 업무에 필요한 건 다 갖춰요.',
              },
              {
                num: '03',
                title: '머무는 여유',
                desc: '하루 단위부터 장기 스테이까지, 원하는 만큼 머물어요.',
              },
            ].map((v, i) => (
              <ValueItem key={i}>
                <ValueNum>{v.num}</ValueNum>
                <div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: COLOR.black,
                      marginBottom: 6,
                    }}
                  >
                    {v.title}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: COLOR.gray400,
                      lineHeight: 1.7,
                    }}
                  >
                    {v.desc}
                  </div>
                </div>
              </ValueItem>
            ))}
          </ValueItems>
        </ValueInner>
      </ValueSection>
    </div>
  );
}

export default MainPage;
