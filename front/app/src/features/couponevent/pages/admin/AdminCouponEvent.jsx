import { useEffect, useState } from 'react';
import styled from 'styled-components';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { Button, EmptyState, Modal } from '../../../pay_shared/components';

import {
  closeEvent,
  createEvent,
  findEventAll,
} from '../../api/couponEventApi';

const DC_TYPE_OPTIONS = [
  { value: 'FIXED', label: '정액 (원)' },
  { value: 'RATE', label: '정률 (%)' },
];

const STATUS_INFO = {
  OPEN: { label: '게시중', color: 'var(--sage)' },
  CLOSED: { label: '종료됨', color: 'var(--gray-500)' },
  SOLDOUT: { label: '소진됨', color: 'var(--coral-500)' },
};

const formatDateTime = (iso) => {
  if (!iso) return '-';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const formatDcValue = (dcType, dcValue) => {
  if (dcType === 'FIXED') return `${Number(dcValue).toLocaleString()}원`;
  if (dcType === 'RATE') return `${dcValue}%`;
  return `${dcValue}`;
};

export default function AdminCouponEvent() {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [closing, setClosing] = useState(null);

  const [formCouponName, setFormCouponName] = useState('');
  const [formDcType, setFormDcType] = useState('FIXED');
  const [formDcValue, setFormDcValue] = useState('');
  const [formValidDays, setFormValidDays] = useState('');
  const [formStartAt, setFormStartAt] = useState('');
  const [formEndAt, setFormEndAt] = useState('');
  const [formTotalCount, setFormTotalCount] = useState('');

  const loadEvents = async () => {
    try {
      const list = await findEventAll();
      setEvents(list);
    } catch (err) {
      console.error('쿠폰 게시 조회 실패', err);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const resetForm = () => {
    setFormCouponName('');
    setFormDcType('FIXED');
    setFormDcValue('');
    setFormValidDays('');
    setFormStartAt('');
    setFormEndAt('');
    setFormTotalCount('');
  };

  const handleOpenModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    if (submitting) return;
    setModalOpen(false);
  };

  const handleSubmit = async () => {
    if (submitting) return;

    if (!formCouponName.trim()) {
      alert('쿠폰명을 입력해주세요.');
      return;
    }
    const dcValueNum = Number(formDcValue);
    if (!formDcValue || Number.isNaN(dcValueNum) || dcValueNum <= 0) {
      alert('할인값은 0보다 큰 숫자로 입력해주세요.');
      return;
    }
    if (formDcType === 'RATE' && dcValueNum > 100) {
      alert('정률 할인은 100% 이하로 입력해주세요.');
      return;
    }
    const validDaysNum = Number(formValidDays);
    if (!formValidDays || Number.isNaN(validDaysNum) || validDaysNum <= 0) {
      alert('유효기간(일)은 0보다 큰 숫자로 입력해주세요.');
      return;
    }
    const totalCountNum = Number(formTotalCount);
    if (!formTotalCount || Number.isNaN(totalCountNum) || totalCountNum <= 0) {
      alert('총 발급 수량은 0보다 큰 숫자로 입력해주세요.');
      return;
    }
    if (!formStartAt || !formEndAt) {
      alert('게시 시작/종료 시점을 모두 입력해주세요.');
      return;
    }
    if (new Date(formStartAt) >= new Date(formEndAt)) {
      alert('게시 종료 시점은 시작 시점 이후여야 합니다.');
      return;
    }

    setSubmitting(true);
    try {
      const reqDto = {
        couponName: formCouponName.trim(),
        dcType: formDcType,
        dcValue: dcValueNum,
        validDays: validDaysNum,
        startAt: new Date(formStartAt).toISOString(),
        endAt: new Date(formEndAt).toISOString(),
        totalCount: totalCountNum,
      };
      await createEvent(reqDto);
      await loadEvents();
      setModalOpen(false);
      resetForm();
      alert('쿠폰 게시가 등록됐습니다.');
    } catch (err) {
      console.error('쿠폰 게시 등록 실패', err);
      const msg = err?.response?.data?.msg ?? err.message;
      alert(`게시 등록에 실패했습니다.\n${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = async (no) => {
    if (closing) return;
    if (
      !window.confirm(
        '해당 쿠폰 게시를 종료할까요?\n종료 후 유저는 더 이상 다운로드할 수 없습니다.'
      )
    )
      return;

    setClosing(no);
    try {
      await closeEvent(no);
      await loadEvents();
      alert('게시가 종료됐습니다.');
    } catch (err) {
      console.error('게시 종료 실패', err);
      const msg = err?.response?.data?.msg ?? err.message;
      alert(`게시 종료에 실패했습니다.\n${msg}`);
    } finally {
      setClosing(null);
    }
  };

  return (
    <PageLayout
      title="쿠폰 게시 관리"
      description="관리자가 게시한 쿠폰을 유저가 다운로드합니다"
      maxWidth={1100}
      actions={
        <Button variant="primary" onClick={handleOpenModal}>
          + 신규 쿠폰 게시
        </Button>
      }
    >
      {events.length === 0 ? (
        <EmptyState
          icon="🎫"
          title="등록된 쿠폰 게시가 없어요"
          description="첫 게시를 등록하면 유저가 다운로드할 수 있어요"
          action={
            <Button variant="primary" onClick={handleOpenModal}>
              첫 게시 등록하기
            </Button>
          }
        />
      ) : (
        <EventGrid>
          {events.map((ev) => {
            const statusInfo = STATUS_INFO[ev.status] ?? {
              label: ev.status,
              color: 'var(--gray-500)',
            };
            const progress =
              ev.totalCount > 0
                ? Math.round((ev.issuedCount / ev.totalCount) * 100)
                : 0;
            return (
              <EventCard key={ev.no}>
                <CardHeader>
                  <CardTitle>{ev.couponName}</CardTitle>
                  <StatusBadge $color={statusInfo.color}>
                    {statusInfo.label}
                  </StatusBadge>
                </CardHeader>

                <CardBody>
                  <InfoRow>
                    <InfoLabel>할인</InfoLabel>
                    <InfoValue>
                      {formatDcValue(ev.dcType, ev.dcValue)}
                    </InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>유효기간</InfoLabel>
                    <InfoValue>다운로드 후 {ev.validDays}일</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>게시 기간</InfoLabel>
                    <InfoValue>
                      {formatDateTime(ev.startAt)} ~ {formatDateTime(ev.endAt)}
                    </InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>발급 현황</InfoLabel>
                    <InfoValue>
                      {ev.issuedCount} / {ev.totalCount}장 ({progress}%)
                    </InfoValue>
                  </InfoRow>
                  <ProgressBar>
                    <ProgressFill $width={progress} />
                  </ProgressBar>
                </CardBody>

                <CardFooter>
                  <Button
                    variant="secondary"
                    onClick={() => handleClose(ev.no)}
                    disabled={ev.status !== 'OPEN' || closing === ev.no}
                  >
                    {closing === ev.no ? '종료 중...' : '게시 종료'}
                  </Button>
                </CardFooter>
              </EventCard>
            );
          })}
        </EventGrid>
      )}

      <Notice>
        ⓘ 게시 종료 시점 이후 유저는 다운로드할 수 없습니다. 총 발급 수량 도달
        시 자동으로 소진 처리됩니다.
      </Notice>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        title="신규 쿠폰 게시 등록"
        maxWidth="560px"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={handleCloseModal}
              disabled={submitting}
            >
              취소
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? '등록 중...' : '등록하기'}
            </Button>
          </>
        }
      >
        <Form>
          <FormRow>
            <FormLabel>쿠폰명 *</FormLabel>
            <FormInput
              type="text"
              placeholder="예: 5월 가입 환영 쿠폰"
              value={formCouponName}
              onChange={(e) => setFormCouponName(e.target.value)}
            />
          </FormRow>

          <FormRow>
            <FormLabel>할인 타입 *</FormLabel>
            <FormSelect
              value={formDcType}
              onChange={(e) => setFormDcType(e.target.value)}
            >
              {DC_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </FormSelect>
          </FormRow>

          <FormRow>
            <FormLabel>할인값 *</FormLabel>
            <FormInput
              type="number"
              min="0"
              placeholder={
                formDcType === 'FIXED' ? '예: 5000 (원)' : '예: 10 (%)'
              }
              value={formDcValue}
              onChange={(e) => setFormDcValue(e.target.value)}
            />
            <FormHelp>
              {formDcType === 'FIXED' ? '정액(원 단위)' : '정률(0~100 사이 %)'}
            </FormHelp>
          </FormRow>

          <FormRow>
            <FormLabel>유효기간 (일) *</FormLabel>
            <FormInput
              type="number"
              min="1"
              placeholder="예: 30"
              value={formValidDays}
              onChange={(e) => setFormValidDays(e.target.value)}
            />
            <FormHelp>유저가 다운로드한 시점부터 N일간 유효</FormHelp>
          </FormRow>

          <FormRow>
            <FormLabel>총 발급 수량 *</FormLabel>
            <FormInput
              type="number"
              min="1"
              placeholder="예: 100"
              value={formTotalCount}
              onChange={(e) => setFormTotalCount(e.target.value)}
            />
            <FormHelp>수량 도달 시 자동으로 소진 처리됩니다</FormHelp>
          </FormRow>

          <FormRow>
            <FormLabel>게시 시작 시점 *</FormLabel>
            <FormInput
              type="datetime-local"
              value={formStartAt}
              onChange={(e) => setFormStartAt(e.target.value)}
            />
          </FormRow>

          <FormRow>
            <FormLabel>게시 종료 시점 *</FormLabel>
            <FormInput
              type="datetime-local"
              value={formEndAt}
              onChange={(e) => setFormEndAt(e.target.value)}
            />
          </FormRow>
        </Form>
      </Modal>
    </PageLayout>
  );
}

const EventGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-4);
`;

const EventCard = styled.div`
  display: flex;
  flex-direction: column;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  gap: var(--space-3);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-2);
`;

const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--gray-900);
  margin: 0;
`;

const StatusBadge = styled.span`
  padding: 4px 10px;
  border-radius: 999px;
  background: ${({ $color }) => $color};
  color: var(--white);
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
`;

const InfoLabel = styled.span`
  color: var(--gray-500);
`;

const InfoValue = styled.span`
  color: var(--gray-800);
  font-weight: 500;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: var(--gray-100);
  border-radius: 999px;
  overflow: hidden;
  margin-top: var(--space-1);
`;

const ProgressFill = styled.div`
  width: ${({ $width }) => $width}%;
  height: 100%;
  background: var(--sage);
  transition: width 200ms ease;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: var(--space-2);
  border-top: 1px solid var(--gray-100);
`;

const Notice = styled.div`
  margin-top: var(--space-5);
  padding: var(--space-3) var(--space-4);
  background: var(--gray-100);
  border-radius: var(--radius-md);
  font-size: 0.82rem;
  color: var(--gray-600);
  line-height: 1.5;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;

const FormLabel = styled.label`
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--gray-800);
`;

const FormInput = styled.input`
  padding: 10px 14px;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  font-size: 0.92rem;
  color: var(--gray-800);
  outline: none;
  transition: border-color 160ms ease;

  &:focus {
    border-color: var(--sage);
    box-shadow: 0 0 0 3px rgba(168, 184, 159, 0.15);
  }
`;

const FormSelect = styled.select`
  padding: 10px 14px;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  font-size: 0.92rem;
  color: var(--gray-800);
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: var(--sage);
    box-shadow: 0 0 0 3px rgba(168, 184, 159, 0.15);
  }
`;

const FormHelp = styled.div`
  font-size: 0.78rem;
  color: var(--gray-400);
`;
