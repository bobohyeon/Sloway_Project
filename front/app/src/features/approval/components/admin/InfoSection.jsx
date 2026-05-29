import React from 'react';
import styled from 'styled-components';
import { FaHotel, FaBriefcase, FaLeaf } from 'react-icons/fa';

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 20px;
`;

const Card = styled.div`
  background: white;
  padding: 25px;
  border-radius: 15px;
  border: 1px solid #eee;
`;

const SectionTitle = styled.h4`
  font-size: 16px;
  margin-bottom: 20px;
  color: #333;
  border-left: 4px solid #a8b89f;
  padding-left: 10px;
`;

const PriceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 10px;
`;

const PriceItem = styled.div`
  padding: 8px;
  background: #f9faf8;
  border-radius: 6px;
  font-size: 12px;
  .time {
    color: #888;
  }
  .amt {
    font-weight: bold;
    color: #d4a373;
    display: block;
  }
`;

const Tag = styled.span`
  display: inline-block;
  padding: 4px 10px;
  background: ${(props) => (props.$isOffice ? '#eef2ff' : '#f5f5f5')};
  color: ${(props) => (props.$isOffice ? '#5a67d8' : '#666')};
  border-radius: 6px;
  font-size: 12px;
  margin: 0 6px 6px 0;
`;

const InfoSection = ({ data }) => {
  return (
    <InfoGrid>
      <Card>
        <SectionTitle>기본 정보</SectionTitle>
        <table
          style={{ width: '100%', fontSize: '14px', borderSpacing: '0 10px' }}
        >
          <tbody>
            <tr>
              <td style={{ color: '#aaa', width: '100px' }}>공간 유형</td>
              <td>{data.type}</td>
            </tr>
            <tr>
              <td style={{ color: '#aaa' }}>공간명</td>
              <td style={{ fontWeight: 'bold' }}>{data.title}</td>
            </tr>
            <tr>
              <td style={{ color: '#aaa' }}>주소</td>
              <td>{data.address}</td>
            </tr>
            <tr>
              <td style={{ color: '#aaa' }}>호스트</td>
              <td>{data.hostName}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: '20px' }}>
          <SectionTitle>공간 소개</SectionTitle>
          <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6' }}>
            {data.content}
          </p>
        </div>
      </Card>

      <Card>
        <SectionTitle>가격 및 편의시설</SectionTitle>
        <div style={{ marginBottom: '20px' }}>
          <div
            style={{
              padding: '15px',
              background: '#fcfdfb',
              borderRadius: '10px',
            }}
          >
            <span style={{ fontSize: '13px', color: '#888' }}>
              {data.type === 'OFFICE'
                ? '기본 요금 (1시간당)'
                : '기본 요금 (1박/하루)'}
            </span>
            <div
              style={{ fontSize: '20px', fontWeight: 'bold', color: '#d4a373' }}
            >
              ₩{Number(data.price || 0).toLocaleString()}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h5 style={{ fontSize: '13px', marginBottom: '10px' }}>
            등록된 편의시설
          </h5>

          {/* 데이터가 있을 때만 Tag를 보여줌 */}
          {data.amenities && data.amenities.length > 0 ? (
            data.amenities.map((a) => <Tag key={a.no}>✓ {a.name}</Tag>)
          ) : (
            <div style={{ fontSize: '12px', color: '#888' }}>
              등록된 편의시설이 없습니다.
            </div>
          )}
        </div>
      </Card>
    </InfoGrid>
  );
};

export default InfoSection;
