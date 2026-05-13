import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import {
  PageTitle,
  PageSub,
  BackLink,
  BtnOutline,
  COLOR,
} from '../../../rsvn/components/user/RsvnStyled';
import {
  FormBox,
  FormLabel,
  Req,
  Textarea,
} from '../../components/user/ReviewStyled';

const REASONS = [
  { title: '공간과 관련 없는 내용', desc: '광고·홍보·스팸성 리뷰' },
  { title: '허위 또는 과장된 내용', desc: '사실과 다른 내용이 포함됨' },
  { title: '개인정보 노출', desc: '특정인의 개인정보가 드러남' },
  { title: '욕설 · 혐오 표현', desc: '부적절한 언어 사용' },
  { title: '저작권 침해', desc: '타인의 글·사진 무단 사용' },
  { title: '기타', desc: '위 사유에 해당하지 않음' },
];

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 32px 24px;
  animation: ${fadeInUp} 480ms ease-out both;
`;

const TargetBox = styled.div`
  background: #fff5f5;
  border: 1px solid #ffcdd2;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
`;

const TargetLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${COLOR.red};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ReasonItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border: 1.5px solid
    ${({ $active }) => ($active ? COLOR.green : COLOR.gray200)};
  background: ${({ $active }) => ($active ? COLOR.greenLight : '#fff')};
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 8px;
  transition: all 0.15s;
`;

const CautionBox = styled.div`
  background: #fff8f0;
  border: 1px solid #ffd9b0;
  border-left: 3px solid ${COLOR.terra};
  border-radius: 8px;
  padding: 14px 16px;
  margin-bottom: 16px;
  font-size: 12px;
  color: #666;
  line-height: 1.7;
`;

const AgreeBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${COLOR.gray600};
  margin-bottom: 20px;
`;

const BottomBtns = styled.div`
  display: flex;
  gap: 10px;
  button {
    flex: 1;
    justify-content: center;
  }
`;

const ReportBtn = styled.button`
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  background: ${COLOR.terra};
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Noto Sans KR', sans-serif;
  border: none;
  cursor: pointer;
  &:hover {
    filter: brightness(0.9);
  }
`;

function ReviewReportPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleReport = () => {
    if (selected === null) {
      alert('신고 사유를 선택해주세요');
      return;
    }
    if (!agreed) {
      alert('동의 체크박스를 확인해주세요');
      return;
    }
    alert('신고되었습니다');
    navigate(-1);
  };

  return (
    <Page>
      <PageTitle>리뷰 신고</PageTitle>
      <PageSub>부적절한 리뷰를 신고해주세요</PageSub>
      <BackLink onClick={() => navigate(-1)}>← 뒤로</BackLink>

      <TargetBox>
        <TargetLabel>🚩 신고 대상 리뷰</TargetLabel>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 6,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: COLOR.gray200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            익
          </div>
          <span style={{ fontSize: 13, fontWeight: 600 }}>익명회원</span>
          <span style={{ color: '#C97D4C', fontSize: 13 }}>★☆☆☆☆</span>
          <span style={{ fontSize: 12, color: COLOR.gray400 }}>2026.04.20</span>
        </div>
        <div style={{ fontSize: 12, color: COLOR.gray400, marginBottom: 6 }}>
          📍 청평 숲속 파인뷰 스테이
        </div>
        <div style={{ fontSize: 13, color: '#555', lineHeight: 1.6 }}>
          이상한 광고성 내용이 포함된 부적절한 리뷰 샘플입니다. 자세히 보니
          공간과는 관련 없고 다른 업체를 홍보하는 내용이네요.
        </div>
      </TargetBox>

      <FormBox>
        <FormLabel>
          신고 사유 <Req>*</Req>
        </FormLabel>
        <div style={{ fontSize: 12, color: COLOR.gray400, marginBottom: 14 }}>
          해당하는 사유를 선택해주세요
        </div>
        {REASONS.map((r, i) => (
          <ReasonItem
            key={i}
            $active={selected === i}
            onClick={() => setSelected(i)}
          >
            <input
              type="radio"
              name="reason"
              checked={selected === i}
              onChange={() => setSelected(i)}
              style={{ marginTop: 2, accentColor: COLOR.green }}
            />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{r.title}</div>
              <div style={{ fontSize: 11, color: COLOR.gray400, marginTop: 2 }}>
                {r.desc}
              </div>
            </div>
          </ReasonItem>
        ))}
      </FormBox>

      <FormBox>
        <FormLabel>
          상세 설명{' '}
          <span style={{ fontSize: 12, color: COLOR.gray400, fontWeight: 400 }}>
            (선택)
          </span>
        </FormLabel>
        <div style={{ fontSize: 12, color: COLOR.gray400, marginBottom: 10 }}>
          검토에 도움이 될 추가 내용이 있다면 작성해주세요
        </div>
        <Textarea
          rows={4}
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="예: 특정 업체를 홍보하는 내용이며, 실제 이용자의 후기로 보기 어렵습니다."
        />
        <div
          style={{
            textAlign: 'right',
            fontSize: 11,
            color: COLOR.gray400,
            marginTop: 4,
          }}
        >
          {detail.length} / 500
        </div>
      </FormBox>

      <CautionBox>
        <strong style={{ color: COLOR.terra }}>
          📌 신고 전 꼭 확인해주세요
        </strong>
        <br />
        허위 신고 시 <strong>이용 제한</strong> 조치가 있을 수 있어요.
        <br />
        신고 정보는 비공개로 처리되며, 피신고자에게 공개되지 않습니다.
      </CautionBox>

      <AgreeBox>
        <input
          type="checkbox"
          id="agree"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />
        <label htmlFor="agree">
          * 위 내용을 확인했으며, 허위 신고 시 제재를 받을 수 있음에 동의합니다
        </label>
      </AgreeBox>

      <BottomBtns>
        <BtnOutline onClick={() => navigate(-1)}>취소</BtnOutline>
        <ReportBtn onClick={handleReport}>🚩 신고하기</ReportBtn>
      </BottomBtns>
    </Page>
  );
}

export default ReviewReportPage;
