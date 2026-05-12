import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { Card, Button, Section, Badge } from '../../../pay_shared/components'
import { Modal } from '../../../pay_shared/components/Modal'

const INITIAL_POLICIES = [
  {
    id: 1,
    icon: '🏨',
    category: '숙소',
    description: '단기 숙박 예약 수수료',
    rate: 12.5,
    effectiveFrom: '2026.01.01',
    appliedSpaces: 142,
  },
  {
    id: 2,
    icon: '🌲',
    category: '워크앤스테이',
    description: '워케이션 숙박 수수료',
    rate: 12.5,
    effectiveFrom: '2026.01.01',
    appliedSpaces: 87,
  },
  {
    id: 3,
    icon: '💼',
    category: '코워킹오피스',
    description: '시간제·일일 사용 수수료',
    rate: 10.0,
    effectiveFrom: '2026.01.01',
    appliedSpaces: 119,
  },
]

const HISTORY = [
  {
    id: 1,
    title: '2026년 정책 적용',
    date: '2026.01.01',
    description: '신규 카테고리(워크앤스테이) 추가 및 코워킹오피스 수수료 인하',
    changes: [
      { category: '워크앤스테이', from: '신규', to: 12.5 },
      { category: '코워킹오피스', from: 12.0, to: 10.0 },
    ],
    updatedBy: '관리자',
  },
  {
    id: 2,
    title: '2025년 정책 적용',
    date: '2025.01.01',
    description: '숙소 수수료율 13% → 12.5%로 인하',
    changes: [{ category: '숙소', from: 13.0, to: 12.5 }],
    updatedBy: '관리자',
  },
]

export default function AdminCommissionPolicy() {
  const nav = useNavigate()
  const [policies, setPolicies] = useState(INITIAL_POLICIES)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [newRate, setNewRate] = useState('')
  const [effectiveDate, setEffectiveDate] = useState('')
  const [reason, setReason] = useState('')

  const openEditModal = (policy) => {
    setEditTarget(policy)
    setNewRate(String(policy.rate))
    setEffectiveDate('')
    setReason('')
    setEditModalOpen(true)
  }

  const handleSave = () => {
    const rate = parseFloat(newRate)
    if (isNaN(rate) || rate < 0 || rate > 50) {
      alert('수수료율은 0 ~ 50% 사이여야 합니다')
      return
    }
    if (!effectiveDate) {
      alert('적용 시작일을 선택해주세요')
      return
    }
    setPolicies((prev) =>
      prev.map((p) =>
        p.id === editTarget.id ? { ...p, rate, effectiveFrom: effectiveDate } : p
      )
    )
    alert(`${editTarget.category} 수수료가 ${rate}%로 변경됩니다 (${effectiveDate}부터 적용)`)
    setEditModalOpen(false)
  }

  return (
    <PageWrapper>
      <Container>
      <Header>
        <Title>수수료 정책 관리</Title>
        <Description>카테고리별 플랫폼 수수료율을 관리하세요</Description>
      </Header>

      <NoticeBanner>
        <NoticeIcon>💡</NoticeIcon>
        <NoticeContent>
          <NoticeTitle>수수료 정책 변경 시 주의사항</NoticeTitle>
          <NoticeList>
            <li>변경된 수수료는 적용 시작일 이후 발생하는 예약부터 적용됩니다</li>
            <li>기존 예약 및 진행 중인 정산에는 영향을 주지 않습니다</li>
            <li>모든 호스트에게 이메일로 알림이 발송됩니다</li>
          </NoticeList>
        </NoticeContent>
      </NoticeBanner>

      <Section title="현재 적용 중인 정책">
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>카테고리</Th>
                <Th>설명</Th>
                <Th align="right">수수료율</Th>
                <Th align="center">적용 시작일</Th>
                <Th align="right">적용 공간</Th>
                <Th align="center">관리</Th>
              </tr>
            </thead>
            <tbody>
              {policies.map((p) => (
                <Tr key={p.id}>
                  <Td>
                    <CategoryCell>
                      <Emoji>{p.icon}</Emoji>
                      <CategoryName>{p.category}</CategoryName>
                    </CategoryCell>
                  </Td>
                  <Td>
                    <DescText>{p.description}</DescText>
                  </Td>
                  <Td align="right">
                    <RateValue>{p.rate}%</RateValue>
                  </Td>
                  <Td align="center">
                    <DateText>{p.effectiveFrom}</DateText>
                  </Td>
                  <Td align="right">{p.appliedSpaces}개</Td>
                  <Td align="center">
                    <Button variant="secondary" size="sm" onClick={() => openEditModal(p)}>
                      수정
                    </Button>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      </Section>

      <Section title="정책 변경 이력">
        <HistoryList>
          {HISTORY.map((h) => (
            <HistoryCard key={h.id} padded>
              <HistoryHeader>
                <HistoryDate>{h.date}</HistoryDate>
                <Badge variant="sage" size="sm">{h.updatedBy}</Badge>
              </HistoryHeader>
              <HistoryTitle>{h.title}</HistoryTitle>
              <HistoryDesc>{h.description}</HistoryDesc>
              <ChangeList>
                {h.changes.map((c, i) => (
                  <ChangeItem key={i}>
                    <ChangeCategory>{c.category}</ChangeCategory>
                    <ChangeArrow>
                      {c.from === '신규' ? (
                        <span>신규 추가 → <strong>{c.to}%</strong></span>
                      ) : (
                        <span>{c.from}% → <strong>{c.to}%</strong></span>
                      )}
                    </ChangeArrow>
                  </ChangeItem>
                ))}
              </ChangeList>
            </HistoryCard>
          ))}
        </HistoryList>
      </Section>

      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={editTarget ? `${editTarget.category} 수수료 변경` : '수수료 변경'}
        footer={
          <ModalFooter>
            <Button variant="secondary" onClick={() => setEditModalOpen(false)}>
              취소
            </Button>
            <Button variant="primary" onClick={handleSave}>
              변경 적용
            </Button>
          </ModalFooter>
        }
      >
        {editTarget && (
          <ModalContent>
            <CurrentRow>
              <CurrentLabel>현재 수수료율</CurrentLabel>
              <CurrentValue>{editTarget.rate}%</CurrentValue>
            </CurrentRow>

            <Field>
              <FieldLabel>새 수수료율 *</FieldLabel>
              <InputRow>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="50"
                  value={newRate}
                  onChange={(e) => setNewRate(e.target.value)}
                  placeholder="예: 12.5"
                />
                <InputSuffix>%</InputSuffix>
              </InputRow>
              <FieldHint>0% ~ 50% 범위로 입력하세요</FieldHint>
            </Field>

            <Field>
              <FieldLabel>적용 시작일 *</FieldLabel>
              <Input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
              <FieldHint>오늘 이후 날짜를 선택하세요</FieldHint>
            </Field>

            <Field>
              <FieldLabel>변경 사유 (선택)</FieldLabel>
              <Textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="예: 시장 경쟁력 강화를 위한 인하"
              />
            </Field>

            <ModalNotice>
              ⚠️ 이 변경은 <strong>{editTarget.appliedSpaces}개 공간</strong>에 영향을 줍니다.
              <br />
              적용 시작일 이후 예약부터 새 수수료가 적용됩니다.
            </ModalNotice>
          </ModalContent>
        )}
      </Modal>
    </Container>
    </PageWrapper>
  )
}

const PageWrapper = styled.div`
  background-color: var(--cream);
  min-height: 100%;
  padding: var(--space-6) var(--space-5);
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  animation: fadeInUp 480ms ease-out both;
`

const Header = styled.div`
  margin-bottom: var(--space-5);
`

const Title = styled.h1`
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 500;
  color: var(--gray-800);
  letter-spacing: -0.02em;
  margin-bottom: 4px;
`

const Description = styled.p`
  font-size: 0.9rem;
  color: var(--gray-600);
`

const NoticeBanner = styled.div`
  display: flex;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--cream);
  border: 1px solid rgba(168, 184, 159, 0.3);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-5);
`

const NoticeIcon = styled.div`
  font-size: 1.4rem;
  flex-shrink: 0;
`

const NoticeContent = styled.div`
  flex: 1;
`

const NoticeTitle = styled.div`
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: var(--space-2);
`

const NoticeList = styled.ul`
  list-style: disc;
  padding-left: var(--space-4);
  font-size: 0.85rem;
  color: var(--gray-600);

  li {
    margin-bottom: 4px;
    line-height: 1.5;
  }
`

const TableWrap = styled.div`
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const Th = styled.th`
  padding: var(--space-3) var(--space-4);
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--gray-600);
  background: var(--cream);
  border-bottom: 1px solid var(--gray-200);
  text-align: ${(p) => p.align || 'left'};
  white-space: nowrap;
`

const Tr = styled.tr`
  border-bottom: 1px solid var(--gray-100);

  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: var(--gray-100);
  }
`

const Td = styled.td`
  padding: var(--space-4);
  font-size: 0.9rem;
  color: var(--gray-800);
  text-align: ${(p) => p.align || 'left'};
  vertical-align: middle;
`

const CategoryCell = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
`

const Emoji = styled.span`
  font-size: 1.3rem;
`

const CategoryName = styled.span`
  font-weight: 500;
`

const DescText = styled.span`
  color: var(--gray-600);
  font-size: 0.85rem;
`

const RateValue = styled.span`
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--sage);
`

const DateText = styled.span`
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--gray-600);
`

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`

const HistoryCard = styled(Card)``

const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
`

const HistoryDate = styled.span`
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--gray-600);
`

const HistoryTitle = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 4px;
`

const HistoryDesc = styled.div`
  font-size: 0.85rem;
  color: var(--gray-600);
  margin-bottom: var(--space-3);
`

const ChangeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-3);
  background: var(--cream);
  border-radius: var(--radius-md);
`

const ChangeItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
`

const ChangeCategory = styled.span`
  font-weight: 500;
  color: var(--gray-800);
`

const ChangeArrow = styled.span`
  color: var(--gray-600);

  strong {
    color: var(--sage);
    font-weight: 600;
  }
`

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`

const CurrentRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3);
  background: var(--cream);
  border-radius: var(--radius-md);
`

const CurrentLabel = styled.span`
  font-size: 0.85rem;
  color: var(--gray-600);
`

const CurrentValue = styled.span`
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--gray-800);
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const FieldLabel = styled.label`
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--gray-700);
`

const InputRow = styled.div`
  position: relative;
`

const Input = styled.input`
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: var(--sage);
  }
`

const InputSuffix = styled.span`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-600);
  font-weight: 500;
  pointer-events: none;
`

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-family: inherit;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: var(--sage);
  }
`

const FieldHint = styled.div`
  font-size: 0.75rem;
  color: var(--gray-400);
`

const ModalNotice = styled.div`
  padding: var(--space-3);
  background: rgba(220, 38, 38, 0.04);
  border: 1px solid rgba(220, 38, 38, 0.2);
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  color: var(--gray-700);
  line-height: 1.5;
`

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
`
