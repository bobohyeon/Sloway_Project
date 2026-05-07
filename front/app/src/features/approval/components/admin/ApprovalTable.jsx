import React from "react";
import styled from "styled-components";

const TableWrapper = styled.div`
  background: white;
  border-radius: 15px;
  border: 1px solid #eee;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  th {
    background: #fcfcf9;
    padding: 15px;
    text-align: left;
    color: #888;
    font-weight: 500;
    border-bottom: 1px solid #eee;
  }

  td {
    padding: 15px;
    border-bottom: 1px solid #f5f5f5;
    vertical-align: middle;
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
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }
  .name {
    font-weight: 600;
    color: #333;
  }
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  background: ${(props) => {
    if (props.isType) return "#f1f4ee"; // 유형 뱃지 (연초록)
    switch (props.status) {
      case "검수 대기":
        return "#fff5f0";
      case "승인 완료":
        return "#eef6f0";
      case "반려":
        return "#fdf2f2";
      case "중지":
        return "#f5f5f5";
      default:
        return "#eee";
    }
  }};
  color: ${(props) => {
    if (props.isType) return "#768966";
    switch (props.status) {
      case "검수 대기":
        return "#d46a4f";
      case "승인 완료":
        return "#2e7d32";
      case "반려":
        return "#c62828";
      case "중지":
        return "#666";
      default:
        return "#aaa";
    }
  }};
`;

const ApprovalBtn = styled.button`
  padding: 6px 12px;
  background: #768966;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.2s;
  &:hover {
    background: #5e6d51;
  }
`;

function ApprovalTable({ data }) {
  return (
    <TableWrapper>
      <Table>
        <thead>
          <tr>
            <th>공간 ID</th>
            <th>공간</th>
            <th>호스트</th>
            <th>유형</th>
            <th>이미지</th>
            <th>가격</th>
            <th>제출일</th>
            <th>대기일</th>
            <th>상태</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id}>
                <td style={{ color: "#aaa" }}>{item.id}</td>
                <td>
                  <SpaceCell>
                    <div className="thumb">
                      {item.type === "숙소"
                        ? "🌴"
                        : item.type === "코워킹오피스"
                          ? "🏢"
                          : "🎨"}
                    </div>
                    <div className="name">{item.name}</div>
                  </SpaceCell>
                </td>
                <td>{item.host}</td>
                <td>
                  <StatusBadge isType>{item.type}</StatusBadge>
                </td>
                <td>📷 {item.images}장</td>
                <td>{item.price}원</td>
                <td style={{ color: "#888" }}>{item.date}</td>
                <td>
                  {item.wait} {item.isAlert && "🚨"}
                </td>
                <td>
                  <StatusBadge status={item.status}>{item.status}</StatusBadge>
                </td>
                <td>
                  <ApprovalBtn>검수 →</ApprovalBtn>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="10"
                style={{ textAlign: "center", padding: "60px", color: "#bbb" }}
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
