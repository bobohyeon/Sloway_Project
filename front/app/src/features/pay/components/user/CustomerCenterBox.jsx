import styled from 'styled-components'
import { Card } from '../../../pay_shared/components'

export function CustomerCenterBox({ phone = '1588-0000', hours = '평일 09:00 - 18:00' }) {
  return (
    <Wrap padded>
      <Left>
        <Icon>💬</Icon>
        <TextWrap>
          <MainText>계속 문제가 발생하나요?</MainText>
          <SubText>고객센터로 문의해주세요. 빠르게 도와드릴게요.</SubText>
        </TextWrap>
      </Left>
      <Right>
        <Phone>{phone}</Phone>
        <Hours>{hours}</Hours>
      </Right>
    </Wrap>
  )
}

const Wrap = styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
  background: var(--cream);

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const Left = styled.div`
  display: flex;
  gap: var(--space-3);
  align-items: center;
`

const Icon = styled.div`
  width: 44px;
  height: 44px;
  background: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`

const TextWrap = styled.div``

const MainText = styled.div`
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 2px;
`

const SubText = styled.div`
  font-size: 0.8rem;
  color: var(--gray-600);
`

const Right = styled.div`
  text-align: right;

  @media (max-width: 640px) {
    text-align: left;
  }
`

const Phone = styled.div`
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--gray-800);
  letter-spacing: -0.01em;
`

const Hours = styled.div`
  font-size: 0.75rem;
  color: var(--gray-400);
  margin-top: 2px;
`
