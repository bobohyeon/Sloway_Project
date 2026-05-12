import React from 'react';
import styled from 'styled-components';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 180px);
  gap: 12px;
  background: white;
  padding: 20px;
  border-radius: 15px;
  border: 1px solid #eee;

  ${(props) =>
    props.$count > 5 &&
    `
    grid-template-rows: repeat(3, 180px);
  `}
`;

const ImageItem = styled.div`
  background: #f5f5f5 url(${(props) => props.$src}) center/cover no-repeat;
  border-radius: 10px;
  position: relative;
  border: 1px solid #f0f0f0;

  /* sort 번호가 1인 이미지는 대표 영역(2x2) 차지 */
  ${(props) =>
    props.$isMain &&
    `
    grid-column: span 2;
    grid-row: span 2;
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

  /* 6번째(인덱스 5) 이미지부터는 3행에 배치 */
  ${(props) =>
    props.$index >= 5 &&
    `
    grid-row: 3;
  `}
`;

const ImageGrid = ({ images = [], title }) => {
  // sort 번호 오름차순 정렬
  const sortedImages = [...images].sort((a, b) => a.sort - b.sort).slice(0, 10);

  return (
    <div style={{ marginBottom: '30px' }}>
      <h3 style={{ marginBottom: '15px', fontSize: '16px', color: '#333' }}>
        {title} <span style={{ color: '#a8b89f' }}>({images.length}장)</span>
      </h3>
      <GridContainer $count={sortedImages.length}>
        {sortedImages.map((img, idx) => (
          <ImageItem
            key={idx}
            $src={img.url}
            $isMain={img.sort === 1}
            $index={idx}
          />
        ))}
      </GridContainer>
      <p style={{ fontSize: '12px', color: '#aaa', marginTop: '10px' }}>
        * 부적합한 이미지가 있다면 반려 사유에 기재해 주세요. (이미지 순서는
        sort 번호 기준입니다.)
      </p>
    </div>
  );
};

export default ImageGrid;
