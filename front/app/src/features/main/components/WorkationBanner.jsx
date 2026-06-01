import styled from 'styled-components';
import { COLOR } from '../../rsvn/components/user/RsvnStyled';

const WorkationBanner = ({ onBookClick, RANDOM_PLACE }) => {
  const FEATURES = [
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
  ];

  const formatAddressTags = (address) => {
    if (!address) return [];

    // 1. 주소를 공백으로 나눔 (예: "경기도 성남시 분당구")
    const parts = address.split(' ');

    // 2. 도/특별자치도 명칭 변환
    const regionMap = {
      경기도: '경기',
      강원특별자치도: '강원',
      충청남도: '충남',
      충청북도: '충북',
      경상남도: '경남',
      경상북도: '경북',
      전라남도: '전남',
      전라북도: '전북',
      제주특별자치도: '제주',
      서울특별시: '서울',
      부산광역시: '부산',
      // 필요 시 추가
    };

    const formattedParts = parts.map((part, index) => {
      // 첫 번째 파트: 도/시 명칭 변환
      if (index === 0 && regionMap[part]) return regionMap[part];

      // 두 번째 파트: '시', '군', '구' 글자 제거 (예: 강릉시 -> 강릉)
      if (index === 1) {
        return part.replace(/(시|군|구)$/, '');
      }
      return part;
    });

    return formattedParts.slice(0, 2); // 최대 2개만 반환
  };

  if (!RANDOM_PLACE) return null;
  return (
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
          {FEATURES.map((f, i) => (
            <BannerFeature key={i}>
              <FeatureIcon>{f.icon}</FeatureIcon>
              <div>
                <BannerTitle>{f.title}</BannerTitle>
                <BannerDesc>{f.desc}</BannerDesc>
              </div>
            </BannerFeature>
          ))}
        </div>

        <BannerCard>
          <BannerCardImg
            style={{
              backgroundImage: `url(${RANDOM_PLACE.mainImageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <BannerCardLabel>
              {RANDOM_PLACE.address &&
                formatAddressTags(RANDOM_PLACE.address).map((tag, i) => (
                  <GreenTag key={i}>{tag}</GreenTag>
                ))}
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
              {RANDOM_PLACE.title}
            </div>
            <div>
              {RANDOM_PLACE.amenities?.map((a, i) => (
                <AmenityChip key={i}>{a}</AmenityChip>
              ))}
            </div>
            {/* ... 가격 및 예약 버튼 ... */}
            <div>
              <span style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>
                ₩{RANDOM_PLACE.price?.toLocaleString()}
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.5)',
                  marginLeft: 4,
                }}
              >
                / 1박
              </span>
            </div>
            <BookBtn onClick={() => onBookClick(data.workStayNo)}>
              예약하기
            </BookBtn>
          </BannerCardBody>
        </BannerCard>
      </BannerInner>
    </BannerSection>
  );
};
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

export default WorkationBanner;
