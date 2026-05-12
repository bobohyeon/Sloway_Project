import React from 'react';
import styled from 'styled-components';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const HeaderWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  h1 {
    font-size: 26px;
    font-weight: bold;
  }
  .btns {
    display: flex;
    gap: 10px;
  }
`;

const HeaderBtn = styled.button`
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  border: 1px solid #ddd;
  background: ${(props) => (props.$primary ? '#768966' : 'white')};
  color: ${(props) => (props.$primary ? 'white' : '#555')};
  cursor: pointer;
`;

function DetailHeader() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { pathname } = useLocation();

  const currentPathType = pathname.split('/')[2];

  return (
    <HeaderWrap>
      <div>
        <h1>공간 상세</h1>
        <p style={{ color: '#888', fontSize: '14px' }}>
          내 공간의 정보와 통계를 확인하세요
        </p>
      </div>
      <div className="btns">
        {/* 주소창에서 뽑아낸 유형을 그대로 사용하여 경로 생성 */}
        <HeaderBtn
          onClick={() => navigate(`/host/${currentPathType}/${id}/images`)}
        >
          🖼️ 이미지 관리
        </HeaderBtn>
        <HeaderBtn
          $primary
          onClick={() => navigate(`/host/${currentPathType}/${id}/edit`)}
        >
          📝 정보 수정
        </HeaderBtn>
      </div>
    </HeaderWrap>
  );
}

export default DetailHeader;
