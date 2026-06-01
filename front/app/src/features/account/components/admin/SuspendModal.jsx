import React, { useState } from 'react';
import { SUSPEND_OPTIONS } from '../../hooks/useMemberList';
import {
  ModalOverlay,
  ModalCard,
  ModalTitle,
  ModalDesc,
  FormGroup,
  FormLabel,
  FormTextarea,
  HelpText,
  SuspendOptions,
  SuspendOptionCard,
  SuspendRadio,
  SuspendOptionLabel,
  SuspendOptionDesc,
  ModalActions,
  ModalBtn,
} from '../../pages/admin/MemberListPage.styled';
function SuspendModal({ target, onClose, onConfirm }) {
  const [option, setOption] = useState('DAYS_7');
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (!reason.trim()) {
      alert('정지 사유를 입력해주세요.');
      return;
    }

    const selected = SUSPEND_OPTIONS.find((o) => o.value === option);
    if (!selected) return;

    if (selected.isPermanent) {
      const confirmed = window.confirm(
        `${target.name} 회원을 영구 정지하시겠습니까?\n관리자가 직접 해제하지 않는 한 영원히 서비스를 이용할 수 없습니다.`
      );
      if (!confirmed) return;
    }

    onConfirm(selected, reason);
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalTitle>회원 정지</ModalTitle>
        <ModalDesc>
          <strong>{target.name}</strong> ({target.email}) 회원을 정지합니다.
        </ModalDesc>

        <FormGroup>
          <FormLabel>정지 유형 *</FormLabel>
          <SuspendOptions>
            {SUSPEND_OPTIONS.map((opt) => (
              <SuspendOptionCard
                key={opt.value}
                $active={option === opt.value}
                $danger={opt.isPermanent}
                onClick={() => setOption(opt.value)}
              >
                <SuspendRadio
                  $active={option === opt.value}
                  $danger={opt.isPermanent}
                />
                <div>
                  <SuspendOptionLabel $danger={opt.isPermanent}>
                    {opt.label}
                  </SuspendOptionLabel>
                  <SuspendOptionDesc>
                    {opt.isPermanent
                      ? '관리자가 해제하기 전까지 영원히 이용 불가'
                      : `${opt.days}일 후 자동 해제`}
                  </SuspendOptionDesc>
                </div>
              </SuspendOptionCard>
            ))}
          </SuspendOptions>
        </FormGroup>

        <FormGroup>
          <FormLabel>정지 사유 *</FormLabel>
          <FormTextarea
            rows="3"
            placeholder="회원에게 전달될 정지 사유를 입력하세요"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={200}
          />
          <HelpText>{reason.length} / 200</HelpText>
        </FormGroup>

        <ModalActions>
          <ModalBtn onClick={onClose}>취소</ModalBtn>
          <ModalBtn $danger onClick={handleConfirm}>
            정지 처리
          </ModalBtn>
        </ModalActions>
      </ModalCard>
    </ModalOverlay>
  );
}

export default SuspendModal;
