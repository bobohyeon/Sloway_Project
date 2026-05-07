import React from 'react';
import styled from 'styled-components';

const TableWrapper = styled.div`
  background: white;
  border-radius: 15px;
  border: 1px solid #eee;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  display: flex;
  flex-direction: column; /* tbody 스크롤을 위해 flex 구조 사용 */

  thead {
    display: table;
    width: 100%;
    table-layout: fixed; /* 헤더와 바디 열 너비 맞춤 */
    background: #fcfcf9;
  }

  tbody {
    display: block;
    width: 100%;
    max-height: 350px; /* 고정 높이 설정 (원하는 높이로 조절 가능) */
    overflow-y: auto;

    /* --- 스크롤바 디자인 (WebKit) --- */
    &::-webkit-scrollbar {
      width: 3px; /* 스크롤바 두께 3px */
    }
    &::-webkit-scrollbar-thumb {
      background: #a8b89f; /* 포인트 컬러 */
      border-radius: 10px;
    }
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    tr {
      display: table;
      width: 100%;
      table-layout: fixed; /* 헤더와 바디 열 너비 맞춤 */
    }
  }

  th {
    padding: 10px;
    text-align: left;
    color: #888;
    font-weight: 500;
    border-bottom: 1px solid #eee;
  }

  td {
    padding: 10px;
    border-bottom: 1px solid #f5f5f5;
    vertical-align: middle;
    /* 텍스트 줄바꿈 방지 */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const SpaceCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  .thumb {
    width: 35px;
    height: 35px;
    border-radius: 6px;
    background: #f1f4ee;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }
  .name {
    font-weight: 600;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  display: inline-block;
  background: ${(props) => {
    if (props.isType) return '#f1f4ee';
    switch (props.status) {
      case '검수 대기':
        return '#fff5f0';
      case '승인 완료':
        return '#eef6f0';
      case '반려':
        return '#fdf2f2';
      case '중지':
        return '#f5f5f5';
      default:
        return '#eee';
    }
  }};
  color: ${(props) => {
    if (props.isType) return '#768966';
    switch (props.status) {
      case '검수 대기':
        return '#d46a4f';
      case '승인 완료':
        return '#2e7d32';
      case '반려':
        return '#c62828';
      case '중지':
        return '#666';
      default:
        return '#aaa';
    }
  }};
`;

const ApprovalBtn = styled.button`
  padding: 6px 12px;
  background: #a8b89f;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  white-space: nowrap;
  transition: background 0.2s;
  &:hover {
    background: #86927e;
  }
`;

function ApprovalTable({ data }) {
  return (
    <TableWrapper>
      <Table>
        <thead>
          <tr>
            <th style={{ width: '80px' }}>공간 ID</th>
            <th style={{ width: '200px' }}>공간</th>
            <th style={{ width: '90px' }}>유형</th>
            <th style={{ width: '80px' }}>이미지</th>
            <th style={{ width: '100px' }}>가격</th>
            <th style={{ width: '140px' }}>제출일</th>
            <th style={{ width: '70px' }}>대기일</th>
            <th style={{ width: '80px' }}>상태</th>
            <th style={{ width: '80px' }}>액션</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id}>
                <td style={{ width: '80px', color: '#aaa' }}>{item.id}</td>
                <td>
                  <SpaceCell>
                    <div className="thumb">
                      {item.type === '숙소'
                        ? '🌴'
                        : item.type === '코워킹오피스'
                          ? '🏢'
                          : '🎨'}
                    </div>
                    <div className="name">{item.name}</div>
                  </SpaceCell>
                </td>
                <td style={{ width: '90px' }}>
                  <StatusBadge isType>{item.type}</StatusBadge>
                </td>
                <td style={{ width: '80px' }}>📷 {item.images}장</td>
                <td style={{ width: '100px' }}>{item.price}원</td>
                <td style={{ width: '140px', color: '#888' }}>{item.date}</td>
                <td style={{ width: '70px' }}>
                  {item.wait} {item.isAlert && '🚨'}
                </td>
                <td style={{ width: '80px' }}>
                  <StatusBadge status={item.status}>{item.status}</StatusBadge>
                </td>
                <td style={{ width: '80px' }}>
                  <ApprovalBtn>검수 →</ApprovalBtn>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="10"
                style={{ textAlign: 'center', padding: '60px', color: '#bbb' }}
              >
                조회된 데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </TableWrapper>
  );
}

export default ApprovalTable;
