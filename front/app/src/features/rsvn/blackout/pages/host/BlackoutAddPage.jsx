import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import PageLayout from '../../../../../app/layouts/page/PageLayout';
import {
  BackLink,
  BtnPrimary,
  BtnOutline,
  COLOR,
} from '../../../components/user/RsvnStyled';
import { saveBlackout } from '../../../api/blackoutApi';

const FormBox = styled.div`
  background: #fff;
  border: 1px solid ${COLOR.gray200};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
`;

const FormRow = styled.div`
  margin-bottom: 18px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: ${COLOR.black};
  margin-bottom: 6px;
  display: block;
`;

const Req = styled.span`
  color: ${COLOR.red};
  margin-left: 2px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 14px;
  border: 1px solid ${COLOR.gray200};
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  box-sizing: border-box;
  &:focus {
    border-color: ${COLOR.sage};
  }
`;

const TypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
`;

const TypeBtn = styled.button`
  padding: 10px;
  border: 1.5px solid
    ${({ $active }) => ($active ? COLOR.green : COLOR.gray200)};
  background: ${({ $active }) => ($active ? COLOR.greenLight : '#fff')};
  color: ${({ $active }) => ($active ? COLOR.green : '#555')};
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  text-align: center;
  transition: all 0.15s;
`;

const DateRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 10px;
`;

const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
`;

const Toggle = styled.div`
  width: 40px;
  height: 22px;
  border-radius: 11px;
  background: ${({ $on }) => ($on ? COLOR.green : COLOR.gray200)};
  position: relative;
  cursor: pointer;
  transition: background 0.2s;
`;

const ToggleDot = styled.div`
  width: 18px;
  height: 18px;
  background: #fff;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: ${({ $on }) => ($on ? '20px' : '2px')};
  transition: left 0.2s;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px 14px;
  border: 1px solid ${COLOR.gray200};
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  resize: none;
  outline: none;
  box-sizing: border-box;
  &:focus {
    border-color: ${COLOR.sage};
  }
`;

const BottomBtns = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
`;

const TYPES = [
  { label: '🔧 정비·보수', value: 'M' },
  { label: '🧹 청소', value: 'C' },
  { label: '🏠 개인 이용', value: 'P' },
  { label: '📝 기타', value: 'E' },
];

function BlackoutAddPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const entityNo = location.state?.entityNo;

  const [selectedType, setSelectedType] = useState(0);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timeOn, setTimeOn] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [memo, setMemo] = useState('');

  const handleSave = async () => {
    if (!entityNo) {
      alert('공간 번호가 없어요. 이용 불가 목록에서 다시 시도해주세요');
      return;
    }
    if (!title.trim()) {
      alert('제목을 입력해주세요');
      return;
    }
    if (!startDate || !endDate) {
      alert('날짜를 입력해주세요');
      return;
    }
    if (endDate < startDate) {
      alert('종료 날짜는 시작 날짜 이후여야 해요');
      return;
    }

    try {
      await saveBlackout(entityNo, {
        title,
        memo,
        reasonType: TYPES[selectedType].value,
        startDate: `${startDate}T00:00:00`,
        endDate: `${endDate}T00:00:00`,
        startTime: timeOn && startTime ? `${startDate}T${startTime}:00` : null,
        endTime: timeOn && endTime ? `${endDate}T${endTime}:00` : null,
      });
      navigate('/host/reservation/block');
    } catch (err) {
      if (err?.response?.status === 409) {
        alert('해당 기간에 이미 확정된 예약이 있어서 이용 불가 설정을 등록할 수 없어요.');
      } else {
        alert('저장에 실패했어요.');
      }
    }
  };

  return (
    <PageLayout
      title="이용 불가 추가"
      description="예약을 받지 않을 날짜·시간을 설정하세요"
      maxWidth={800}
    >
      <BackLink onClick={() => navigate('/host/reservation/block')}>
        ← 이용 불가 목록
      </BackLink>

      <FormBox>
        <FormRow>
          <Label>
            사유 유형 <Req>*</Req>
          </Label>
          <TypeGrid>
            {TYPES.map((t, i) => (
              <TypeBtn
                key={i}
                $active={selectedType === i}
                onClick={() => setSelectedType(i)}
              >
                {t.label}
              </TypeBtn>
            ))}
          </TypeGrid>
        </FormRow>

        <FormRow>
          <Label>
            제목 <Req>*</Req>
          </Label>
          <Input
            type="text"
            placeholder="예) 내부 정비, 정기 청소"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormRow>

        <FormRow>
          <Label>
            날짜 <Req>*</Req>
          </Label>
          <DateRow>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span style={{ color: COLOR.gray400 }}>~</span>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </DateRow>
        </FormRow>

        <ToggleRow>
          <Label style={{ margin: 0 }}>시간 설정 (코워킹오피스)</Label>
          <Toggle $on={timeOn} onClick={() => setTimeOn((v) => !v)}>
            <ToggleDot $on={timeOn} />
          </Toggle>
          <span style={{ fontSize: 12, color: COLOR.gray400 }}>
            {timeOn ? '켜짐' : '꺼짐'}
          </span>
        </ToggleRow>

        {timeOn && (
          <FormRow>
            <Label>
              시간 <Req>*</Req>
            </Label>
            <DateRow>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <span style={{ color: COLOR.gray400 }}>~</span>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </DateRow>
          </FormRow>
        )}

        <FormRow>
          <Label>메모 (선택)</Label>
          <Textarea
            rows={3}
            placeholder="추가 안내 사항을 입력해주세요"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </FormRow>
      </FormBox>

      <BottomBtns>
        <BtnOutline onClick={() => navigate('/host/reservation/block')}>
          취소
        </BtnOutline>
        <BtnPrimary onClick={handleSave}>저장</BtnPrimary>
      </BottomBtns>
    </PageLayout>
  );
}

export default BlackoutAddPage;
