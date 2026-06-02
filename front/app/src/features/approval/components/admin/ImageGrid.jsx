import React from 'react';
import styled from 'styled-components';
const GridContainer = styled.div`
  display: grid;
  gap: 12px;
  background: white;
  padding: 20px;
  border-radius: 15px;
  border: 1px solid #eee;
  min-width: 1400px;

  /* 기본 5열 유지 
     대표 이미지(2x2)가 포함된 경우: 5열, 3행(혹은 그 이상)
     이미지가 적을 때도 유연하게 대응
  */
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: 180px;

  ${(props) =>
    props.$hasMain &&
    `
  `}

  ${(props) =>
    props.$count <= 3 &&
    `
  .is-main { 
    grid-column: span 1; 
    grid-row: span 1; 
  }
`}
`;

const ImageItem = styled.div`
  background: #f5f5f5 url(${(props) => props.$src}) center/cover no-repeat;
  border-radius: 10px;
  position: relative;
  border: 1px solid #f0f0f0;

  ${(props) =>
    props.$isMain &&
    `
    grid-column: span 3;
    grid-row: span 3;
    &::after {
      content: '대표';
      position: absolute;
      top: 12px; left: 12px;
      background: #a8b89f;
      color: #fff;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: bold;
    }
  `}
`;

const ImageGrid = ({ images = [], title }) => {
  const safeImages = Array.isArray(images) ? images : [];

  const sortedImages = [...safeImages]
    .sort((a, b) => (a.sortNo || 0) - (b.sortNo || 0))
    .slice(0, 10);

  return (
    <div style={{ marginBottom: '30px' }}>
      <h3 style={{ marginBottom: '15px', fontSize: '16px', color: '#333' }}>
        {title}{' '}
        <span style={{ color: '#a8b89f' }}>({safeImages.length}장)</span>
      </h3>
      {sortedImages.length > 0 ? (
        <GridContainer $count={sortedImages.length}>
          {sortedImages.map((img, idx) => (
            <ImageItem
              key={img.no || idx} // key 값도 안전하게 img.no 사용
              $src={img.url}
              $isMain={img.sortNo === 1}
              $index={idx}
            />
          ))}
        </GridContainer>
      ) : (
        <p style={{ fontSize: '14px', color: '#888' }}>
          등록된 이미지가 없습니다.
        </p>
      )}
      <p style={{ fontSize: '12px', color: '#aaa', marginTop: '10px' }}>
        * 부적합한 이미지가 있다면 반려 사유에 기재해 주세요. (이미지 순서는
        sort 번호 기준입니다.)
      </p>
    </div>
  );
};

export default ImageGrid;
