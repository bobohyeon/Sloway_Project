import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 hook
import { FaHotel, FaBriefcase, FaLeaf, FaCheck, FaMapMarkerAlt } from 'react-icons/fa';

// --- Styled Components ---

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #eee;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 14px;

  th,
  td {
    padding: 12px 15px;
    border-bottom: 1px solid #f9f9f9;
    vertical-align: middle;
  }

  th {
    background-color: #fafafa;
    font-weight: 600;
    color: #666;
  }

  tr:hover {
    background-color: #fcfcfc;
  }
`;

const SpaceCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  .thumb {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
  }

  .name {
    font-weight: 500;
    color: #333;
  }
`;

const DetailButton = styled.button`
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid #a8b89f;
  background-color: #fff;
  color: #a8b89f;
  transition: all 0.2s;

  &:hover {
    background-color: #a8b89f;
    color: #fff;
  }
`;

// --- 설정 데이터 ---

const TYPE_CONFIG = {
  STATION: {
    label: '숙소',
    icon: <FaHotel />,
    bgColor: '#f0f4ee',
    color: '#a8b89f',
  },
  OFFICE: {
    label: '오피스',
    icon: <FaBriefcase />,
    bgColor: '#edf2f7',
    color: '#7a8da1',
  },
  WORK_STAY: {
    label: '워크앤스테이',
    icon: <FaLeaf />,
    bgColor: '#fdf2e9',
    color: '#d4a373',
  },
  PLACE:{
    label: '공간',
    icon: <FaMapMarkerAlt/>,
    bgColor: '#fff4f4',
    color: '#e78a8a'
  }
};

const STATUS_MAP = {
  P: { text: '대기', color: '#ff9800' },
  A: { text: '승인', color: '#4caf50' },
  R: { text: '반려', color: '#f44336' },
};

// --- 메인 컴포넌트 ---

function ApprovalTable({ data }) {
  const navigate = useNavigate();

  return (
    <TableContainer>
      <StyledTable>
        <thead>
          <tr>
            <th>공간 정보</th>
            <th>유형</th>
            <th>호스트</th>
            <th>금액</th>
            <th>등록일시</th>
            <th>상태</th>
            <th style={{ textAlign: 'center' }}>상세보기</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            const typeInfo = TYPE_CONFIG[item.type] || {
              label: item.type,
              icon: null,
              bgColor: '#eee',
              color: '#999',
            };
            const statusInfo = STATUS_MAP[item.status] || {
              text: item.status,
              color: '#333',
            };

            return (
              <tr key={item.id}>
                <td>
                  <SpaceCell>
                    <div
                      className="thumb"
                      style={{
                        backgroundColor: typeInfo.bgColor,
                        color: typeInfo.color,
                      }}
                    >
                      {typeInfo.icon}
                    </div>
                    <div className="name">{item.name}</div>
                  </SpaceCell>
                </td>
                <td>
                  <span style={{ fontSize: '12px', color: '#888' }}>
                    {typeInfo.label}
                  </span>
                </td>
                <td>{item.host}</td>
                <td style={{ fontWeight: '600' }}>₩{item.price}~</td>
                <td style={{ color: '#aaa', fontSize: '12px' }}>{item.date}</td>
                <td>
                  <span
                    style={{
                      color: statusInfo.color,
                      fontWeight: '600',
                      fontSize: '13px',
                    }}
                  >
                    {statusInfo.text}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <DetailButton
  disabled={item.status !== 'P'} // 'P'가 아닐 때 비활성화
  onClick={() =>
    navigate(`/admin/space/review/${item.type}/${item.id}`)
  }
  style={{
    cursor: item.status !== 'P' ? 'not-allowed' : 'pointer',
    opacity: item.status !== 'P' ? 0.5 : 1, // 비활성화 시 흐리게 표시
  }}
>
  {item.status === 'P' ? '검수하기' : '검수 완료'}
</DetailButton>
                </td>
              </tr>
            );
          })}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
}

export default ApprovalTable;
