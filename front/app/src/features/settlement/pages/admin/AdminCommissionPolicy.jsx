// 관리자 수수료 정책 페이지 — 도메인: Fee / 역할: ADMIN
// 백엔드 API: ✅ GET /api/settlement/fee (전체 조회)
//            ✅ POST /api/settlement/fee (신규 정책 등록)
// 관리자 영역 — 수수료율 신규 등록 권한 (U/D 미진입, 명세서 기준 CRU)

import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { Button, EmptyState, Modal } from '../../../pay_shared/components';
import { CommissionPolicyTable } from '../../components/host/CommissionPolicyTable';

import { createFee, findFeeAll } from '../../api/feeApi';

// 백엔드 PlaceType → UI 노출 정보
// 사용자 노출 명칭 (CLAUDE.md SSOT): STATION=숙소 / WORK_STAY=워크앤스테이 / OFFICE=코워킹오피스
const PLACE_TYPE_INFO = {
  STATION: {
    icon: '🏠',
    category: '숙소',
    description: '워케이션용 일반 숙소 영역',
  },
  WORK_STAY: {
    icon: '🌲',
    category: '워크앤스테이',
    description: '장기 체류 + 업무 공간 결합형',
  },
  OFFICE: {
    icon: '🏢',
    category: '코워킹오피스',
    description: '단기 사무·미팅 공간',
  },
};

const PLACE_TYPE_OPTIONS = [
  { value: 'STATION', label: '숙소 (STATION)' },
  { value: 'WORK_STAY', label: '워크앤스테이 (WORK_STAY)' },
  { value: 'OFFICE', label: '코워킹오피스 (OFFICE)' },
];

const formatDate = (iso) => {
  if (!iso) return '-';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
};

// 백엔드 FeeResDto → CommissionPolicyTable prop 변환
const toPolicyTableItem = (resDto) => {
  const info = PLACE_TYPE_INFO[resDto.placeType] ?? {
    icon: '📋',
    category: resDto.placeType,
    description: '-',
  };
  return {
    id: resDto.no,
    icon: info.icon,
    category: info.category,
    description: info.description,
    rate: resDto.rate,
    effectiveFrom: formatDate(resDto.startAt),
  };
};

export default function AdminCommissionPolicy() {
  const [fees, setFees] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 폼 영역
  const [formPlaceType, setFormPlaceType] = useState('STATION');
  const [formRate, setFormRate] = useState('');
  const [formStartAt, setFormStartAt] = useState('');
  const [formEndAt, setFormEndAt] = useState('');

  const loadFees = async () => {
    try {
      const list = await findFeeAll();
      setFees(list);
    } catch (err) {
      console.error('수수료 정책 조회 실패', err);
    }
  };

  useEffect(() => {
    loadFees();
  }, []);

  // 현재 적용 중인 정책만 활성 표시 (delYn=N 영역). 백엔드 자체 delYn 처리하므로 프론트는 단순 표시
  const policies = useMemo(
    () => fees.filter((f) => f.delYn !== 'Y').map(toPolicyTableItem),
    [fees]
  );

  const resetForm = () => {
    setFormPlaceType('STATION');
    setFormRate('');
    setFormStartAt('');
    setFormEndAt('');
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

    // 입력 검증
    const rateNum = Number(formRate);
    if (!formRate || Number.isNaN(rateNum) || rateNum < 0 || rateNum > 100) {
      alert('수수료율은 0 ~ 100 사이 숫자로 입력해주세요.');
      return;
    }
    if (!formStartAt) {
      alert('적용 시작일을 입력해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      // datetime-local 입력 → ISO 변환 (LocalDateTime 영역 매핑)
      const reqDto = {
        placeType: formPlaceType,
        rate: rateNum,
        startAt: new Date(formStartAt).toISOString(),
        endAt: formEndAt ? new Date(formEndAt).toISOString() : null,
      };
      await createFee(reqDto);
      await loadFees(); // 등록 후 재조회
      setModalOpen(false);
      resetForm();
      alert('수수료 정책이 등록됐습니다.');
    } catch (err) {
      console.error('수수료 정책 등록 실패', err);
      const msg = err?.response?.data?.msg ?? err.message;
      alert(`정책 등록에 실패했습니다.\n${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout
      title="수수료 정책 관리"
      description="공간 타입별 수수료 정책을 등록하고 관리하세요"
      maxWidth={1100}
      actions={
        <Button variant="primary" onClick={handleOpenModal}>
          + 신규 정책 등록
        </Button>
      }
    >
      {policies.length === 0 ? (
        <EmptyState
          icon="📋"
          title="등록된 수수료 정책이 없어요"
          description="공간 타입별로 수수료율을 등록해주세요"
          action={
            <Button variant="primary" onClick={handleOpenModal}>
              첫 정책 등록하기
            </Button>
          }
        />
      ) : (
        <CommissionPolicyTable policies={policies} />
      )}

      <Notice>
        ⓘ 본 화면은 신규 등록만 지원합니다. 정책 변경 시 신규 정책 등록으로
        이전 정책이 자동 대체됩니다. (명세서 기준 CRU — Delete 미지원)
      </Notice>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        title="신규 수수료 정책 등록"
        maxWidth="520px"
        footer={
          <>
            <Button variant="secondary" onClick={handleCloseModal} disabled={submitting}>
              취소
            </Button>
            <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? '등록 중...' : '등록하기'}
            </Button>
          </>
        }
      >
        <Form>
          <FormRow>
            <FormLabel>공간 타입 *</FormLabel>
            <FormSelect
              value={formPlaceType}
              onChange={(e) => setFormPlaceType(e.target.value)}
            >
              {PLACE_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </FormSelect>
          </FormRow>

          <FormRow>
            <FormLabel>수수료율 (%) *</FormLabel>
            <FormInput
              type="number"
              min="0"
              max="100"
              placeholder="예: 10"
              value={formRate}
              onChange={(e) => setFormRate(e.target.value)}
            />
            <FormHelp>0 ~ 100 사이 숫자. 예) 숙소 10%, 워크앤스테이 12%</FormHelp>
          </FormRow>

          <FormRow>
            <FormLabel>적용 시작일 *</FormLabel>
            <FormInput
              type="datetime-local"
              value={formStartAt}
              onChange={(e) => setFormStartAt(e.target.value)}
            />
          </FormRow>

          <FormRow>
            <FormLabel>적용 종료일 (선택)</FormLabel>
            <FormInput
              type="datetime-local"
              value={formEndAt}
              onChange={(e) => setFormEndAt(e.target.value)}
            />
            <FormHelp>비워두면 무기한 적용</FormHelp>
          </FormRow>
        </Form>
      </Modal>
    </PageLayout>
  );
}

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
