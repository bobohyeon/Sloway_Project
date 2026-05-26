import styled from 'styled-components';

const Section = styled.div`
  background: white;
  border-radius: 15px;
  padding: 25px;
  border: 1px solid #eee;
  margin-bottom: 25px;
  h3 {
    margin-bottom: 20px;
    border-bottom: 1px solid #f5f5f5;
    padding-bottom: 15px;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px 40px;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  .label {
    color: #888;
  }
  .val {
    font-weight: 500;
    color: #333;
  }
  .price {
    color: #d46a4f;
    font-weight: bold;
  }
`;

function DetailBasicInfo({ info }) {
  return (
    <Section>
      <h3>기본 정보</h3>
      <InfoGrid>
        <InfoItem>
          <span className="label">공간 이름</span>
          <span className="val">{info.name}</span>
        </InfoItem>
        <InfoItem>
          <span className="label">기본 요금 (1박)</span>
          <span className="price">{info.basePrice}원</span>
        </InfoItem>
        <InfoItem>
          <span className="label">유형</span>
          <span className="val">{info.type}</span>
        </InfoItem>
        <InfoItem>
          <span className="label">주말 요금</span>
          <span className="val">{info.weekendPrice}원</span>
        </InfoItem>
        <InfoItem>
          <span className="label">주소</span>
          <span className="val">{info.address}</span>
        </InfoItem>
        <InfoItem>
          <span className="label">체크인</span>
          <span className="val">{info.checkInTime}</span>
        </InfoItem>
        <InfoItem>
          <span className="label">최대 수용 인원</span>
          <span className="val">{info.capacity}명</span>
        </InfoItem>
        <InfoItem>
          <span className="label">체크아웃</span>
          <span className="val">{info.checkOutTime}</span>
        </InfoItem>
      </InfoGrid>
    </Section>
  );
}
export default DetailBasicInfo;
