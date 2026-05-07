import styled from "styled-components";

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
  padding: 8px 15px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: ${(props) => (props.primary ? "#768966" : "white")};
  color: ${(props) => (props.primary ? "white" : "#333")};
  cursor: pointer;
`;

function DetailHeader() {
  return (
    <HeaderWrap>
      <div>
        <h1>공간 상세</h1>
        <p style={{ color: "#888", fontSize: "13px" }}>
          내 공간의 정보와 통계를 확인하세요
        </p>
      </div>
      <div className="btns">
        <HeaderBtn>🖼️ 이미지 관리</HeaderBtn>
        <HeaderBtn primary>📝 정보 수정</HeaderBtn>
      </div>
    </HeaderWrap>
  );
}
export default DetailHeader;
