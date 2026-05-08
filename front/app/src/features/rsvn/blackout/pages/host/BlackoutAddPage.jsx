import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  PageTitle,
  PageSub,
  BackLink,
  BtnPrimary,
  BtnOutline,
  COLOR,
} from '../../../components/user/RsvnStyled';

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
  &:focus {
    border-color: ${COLOR.sage};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 14px;
  border: 1px solid ${COLOR.gray200};
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  background: #fff;
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

const TYPES = ['🔧 정비·보수', '🧹 청소', '🏠 개인 이용', '📝 기타'];

function BlackoutAddPage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(0);
  const [timeOn, setTimeOn] = useState(true);

  return (
    <div>
      <PageTitle>이용 불가 추가</PageTitle>
      <PageSub>예약을 받지 않을 날짜·시간을 설정하세요</PageSub>
      <BackLink onClick={() => navigate('/host/reservation/block')}>
        ← 이용 불가 목록
      </BackLink>

      <FormBox>
        <FormRow>
          <Label>
            공간 선택 <Req>*</Req>
          </Label>
          <Select>
            <option value="">공간을 선택해주세요</option>
            <option>청평 숲속 파인뷰 스테이</option>
            <option>성수 브릭라운지</option>
            <option>제주 돌담집 리트릿</option>
          </Select>
        </FormRow>

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
                {t}
              </TypeBtn>
            ))}
          </TypeGrid>
        </FormRow>

        <FormRow>
          <Label>
            제목 <Req>*</Req>
          </Label>
          <Input type="text" placeholder="예) 내부 정비, 정기 청소" />
        </FormRow>

        <FormRow>
          <Label>
            날짜 <Req>*</Req>
          </Label>
          <DateRow>
            <Input type="date" defaultValue="2026-05-13" />
            <span style={{ color: COLOR.gray400 }}>~</span>
            <Input type="date" defaultValue="2026-05-15" />
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
              <Input type="time" defaultValue="10:00" />
              <span style={{ color: COLOR.gray400 }}>~</span>
              <Input type="time" defaultValue="14:00" />
            </DateRow>
          </FormRow>
        )}

        <FormRow>
          <Label>메모 (선택)</Label>
          <Textarea rows={3} placeholder="추가 안내 사항을 입력해주세요" />
        </FormRow>
      </FormBox>

      <BottomBtns>
        <BtnOutline onClick={() => navigate('/host/reservation/block')}>
          취소
        </BtnOutline>
        <BtnPrimary>저장</BtnPrimary>
      </BottomBtns>
    </div>
  );
}

export default BlackoutAddPage;
