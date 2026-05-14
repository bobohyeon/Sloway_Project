import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { COLOR } from '../../rsvn/components/user/RsvnStyled';
import MainHeader from '../layouts/MainHeader';

const RECOMMENDED = [
  {
    id: 1,
    type: '워크앤스테이',
    title: '청평 숲속 파인뷰 스테이',
    location: '경기 가평',
    score: 4.9,
    reviewCount: 127,
    price: 185000,
    priceUnit: '원/박',
    badge: '새싹 추천',
    icon: '🌲',
  },
  {
    id: 2,
    type: '오피스',
    title: '강릉 바다향 커먼워크',
    location: '강원 강릉',
    score: 4.8,
    reviewCount: 203,
    price: 28000,
    priceUnit: '원/4h',
    badge: '인기',
    icon: '🌊',
  },
  {
    id: 3,
    type: '숙소',
    title: '제주 돌담집 리트릿',
    location: '제주 서귀포',
    score: 4.9,
    reviewCount: 89,
    price: 220000,
    priceUnit: '원/박',
    badge: null,
    icon: '🌴',
  },
];

const TOP_SPACES = [
  {
    rank: '01',
    type: '숙소',
    title: '양양 파도소리 빌라',
    score: 4.95,
    icon: '🌅',
  },
  {
    rank: '02',
    type: '워크앤스테이',
    title: '남해 올리브 팜스테이',
    score: 4.92,
    icon: '✉️',
  },
  {
    rank: '03',
    type: '오피스',
    title: '성수 브릭라운지',
    score: 4.88,
    icon: '🧱',
  },
  {
    rank: '04',
    type: '워크앤스테이',
    title: '속초 설악 글램스테이',
    score: 4.87,
    icon: '⛰️',
  },
];

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

// ── 추천 카드 ─────────────────────────────────────────────
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
  transition:
    box-shadow 0.2s,
    transform 0.2s;
  &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
`;

const RecoImg = styled.div`
  height: 160px;
  background: ${COLOR.cream};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 56px;
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

// ── 인기 공간 랭킹 ────────────────────────────────────────
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
  transition: all 0.2s;
  &:hover {
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.07);
    transform: translateY(-1px);
  }
`;

const RankNum = styled.div`
  font-family: 'DM Serif Display', serif;
  font-size: 24px;
  color: ${COLOR.gray200};
  margin-bottom: 10px;
`;

// ── 워케이션 추천 배너 ────────────────────────────────────
const BannerSection = styled.section`
  background: #2d5a3d;
  padding: 52px 24px;
`;

const BannerInner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 48px;
  align-items: center;
`;

const BannerLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: ${COLOR.sage};
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const BannerTitle = styled.h2`
  font-family: 'DM Serif Display', serif;
  font-size: 32px;
  font-weight: 400;
  color: #fff;
  line-height: 1.3;
  margin-bottom: 16px;

  em {
    color: #a8d5a2;
    font-style: italic;
  }
`;

const BannerDesc = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.7;
  margin-bottom: 20px;
`;

const BannerFeature = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 14px;
`;

const FeatureIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
`;

const BannerCard = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  overflow: hidden;
`;

const BannerCardImg = styled.div`
  height: 150px;
  background: linear-gradient(135deg, #3d6b4f 0%, #4a7a5e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 72px;
  position: relative;
`;

const BannerCardLabel = styled.div`
  position: absolute;
  top: 14px;
  left: 14px;
  display: flex;
  gap: 6px;
`;

const GreenTag = styled.span`
  padding: 4px 10px;
  border-radius: 12px;
  background: rgba(168, 213, 162, 0.25);
  color: #a8d5a2;
  font-size: 11px;
  font-weight: 600;
`;

const BannerCardBody = styled.div`
  padding: 20px;
`;

const AmenityChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  font-size: 11px;
  margin-right: 6px;
  margin-bottom: 6px;
`;

const BookBtn = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  background: ${COLOR.terra};
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  margin-top: 14px;
  transition: filter 0.2s;
  &:hover {
    filter: brightness(0.9);
  }
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
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [spaceType, setSpaceType] = useState('전체');
  const [region, setRegion] = useState('전체');

  const goSearch = () => {
    navigate('/spaces/search', {
      state: { region, type: spaceType, guests },
    });
  };

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

  const goDetail = (type, id) => {
    const path =
      type === '오피스'
        ? `/coworking-offices/${id}`
        : type === '워크앤스테이'
          ? `/workstays/${id}`
          : `/accommodations/${id}`;
    navigate(path);
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

      {/* ── 이번 주 새싹 추천 ── */}
      <Section style={{ paddingTop: 0 }}>
        <SectionRow>
          <div>
            <SectionTitle>이번 주 새싹 추천</SectionTitle>
            <SectionSub>평점과 인기도를 바탕으로 큐레이션했어요</SectionSub>
          </div>
          <MoreLink onClick={goSearch}>전체 보기 →</MoreLink>
        </SectionRow>
        <RecoGrid>
          {RECOMMENDED.map((s) => (
            <RecoCard key={s.id} onClick={() => goDetail(s.type, s.id)}>
              <RecoImg>
                {s.icon}
                {s.badge && <RecoBadge>{s.badge}</RecoBadge>}
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
                  <RecoType>{s.type}</RecoType>
                  <span style={{ fontSize: 12, color: COLOR.gray400 }}>
                    ★ {s.score} ({s.reviewCount})
                  </span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3 }}>
                  {s.title}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: COLOR.gray400,
                    marginBottom: 10,
                  }}
                >
                  📍 {s.location}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>
                  {s.price.toLocaleString()}
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 400,
                      color: COLOR.gray400,
                    }}
                  >
                    {' '}
                    {s.priceUnit}
                  </span>
                </div>
              </RecoBody>
            </RecoCard>
          ))}
        </RecoGrid>
      </Section>

      {/* ── 가장 사랑받은 공간 ── */}
      <Section style={{ paddingTop: 0 }}>
        <SectionRow>
          <div>
            <SectionTitle>가장 사랑받은 공간</SectionTitle>
            <SectionSub>평점 + 조회수 기반 상위 공간</SectionSub>
          </div>
        </SectionRow>
        <RankGrid>
          {TOP_SPACES.map((s, i) => (
            <RankCard
              key={i}
              onClick={() => navigate(`/spaces/${i + 1}/rooms`)}
            >
              <RankNum>{s.rank}</RankNum>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{s.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                {s.title}
              </div>
              <TypeTag>{s.type}</TypeTag>
              <div style={{ fontSize: 13, color: '#C97D4C', marginTop: 6 }}>
                ★ {s.score}
              </div>
            </RankCard>
          ))}
        </RankGrid>
      </Section>

      {/* ── 워케이션 추천 배너 ── */}
      <BannerSection>
        <BannerInner>
          <div>
            <BannerLabel>✦ WHY SLOWAY</BannerLabel>
            <BannerTitle>
              워케이션의
              <br />
              <em>모든 것을</em> 한 곳에
            </BannerTitle>
            <BannerDesc>
              숙소, 업무 공간, 액티비티까지
              <br />
              따로 예약하는 수고로움 없이 한 번에
            </BannerDesc>
            {[
              {
                icon: '🏠',
                title: '편안한 숙소',
                desc: '검증된 워케이션 전용 숙소에서 안정적인 컨디션을 유지하세요',
              },
              {
                icon: '💻',
                title: '집중되는 업무 공간',
                desc: '고속 인터넷·모니터·회의실 등 업무에 최적화된 환경을 제공합니다',
              },
              {
                icon: '🌿',
                title: '퇴근 후 액티비티',
                desc: '지역 특색 체험부터 워크샵까지, 일 이후의 시간도 알차게 채우세요',
              },
            ].map((f, i) => (
              <BannerFeature key={i}>
                <FeatureIcon>{f.icon}</FeatureIcon>
                <div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: '#fff',
                      marginBottom: 4,
                    }}
                  >
                    {f.title}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: 'rgba(255,255,255,0.55)',
                      lineHeight: 1.6,
                    }}
                  >
                    {f.desc}
                  </div>
                </div>
              </BannerFeature>
            ))}
          </div>

          <BannerCard>
            <BannerCardImg>
              🌴
              <BannerCardLabel>
                <GreenTag>제주</GreenTag>
                <GreenTag>예럼</GreenTag>
              </BannerCardLabel>
            </BannerCardImg>
            <BannerCardBody>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#fff',
                  marginBottom: 10,
                }}
              >
                제주 바다뷰 워케이션 라운지
              </div>
              <div>
                {['🖥 모니터', '🌐 기가인터넷', '🏢 회의실'].map((a, i) => (
                  <AmenityChip key={i}>{a}</AmenityChip>
                ))}
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 14,
                }}
              >
                <div>
                  <span
                    style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}
                  >
                    ₩85,000
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: 'rgba(255,255,255,0.5)',
                      marginLeft: 4,
                    }}
                  >
                    / 1일
                  </span>
                </div>
              </div>
              <BookBtn onClick={() => navigate('/accommodations/3')}>
                예약하기
              </BookBtn>
            </BannerCardBody>
          </BannerCard>
        </BannerInner>
      </BannerSection>

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
