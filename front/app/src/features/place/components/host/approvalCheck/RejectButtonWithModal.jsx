import React, { useState } from 'react';
import RejectReasonModal from './RejectReasonModal';
import RejectReasonButton from './RejectReasonButton';
import useApprovalCheck from '../../../hooks/host/approvalCheck/useApprovalCheck';

function RejectButtonWithModal({ no, type }) {
  const { isOpen, reason, handleClose, handleOpen } = useApprovalCheck(
    no,
    type
  );

  return (
    <>
      <RejectReasonButton onClick={handleOpen} />
      <RejectReasonModal
        isOpen={isOpen}
        reason={reason}
        onClose={handleClose}
      />
    </>
  );
}

export default RejectButtonWithModal;
