import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  FaPhone,
  FaCalendarAlt,
  FaIdCard,
  FaUniversity,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaFileAlt,
  FaImages,
  FaDownload,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaExternalLinkAlt,
  FaTimes,
} from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';

// ─────────────────────────────────────────────
// 더미 데이터 — 백엔드 연동 시 GET /api/admin/hosts/applications/{id} 로 교체
// ─────────────────────────────────────────────
const APPLICATION_DETAILS = {
  'HA-2025-001': {
    applicationId: 'HA-2025-001',
    memberId: 10101,
    email: 'seoyeon.lee@example.com',
    name: '이서연',
    phone: '010-2345-6789',
    businessNumber: '123-45-67890',
    businessName: '제주살이 게스트하우스',
    representative: '이서연',
    businessCategory: '숙박업 / 펜션',
    businessAddress: '제주특별자치도 제주시 한림읍 협재로 ...',
    businessContact: '064-1234-5678',
    applyStatus: 'PENDING',
    applyMessage:
      '제주에서 한 달 살기 게스트하우스를 운영하고 있습니다. 워케이션 손님 유치를 위해 가입 신청합니다.',
    appliedAt: '2025-05-13 14:22',
    processedAt: null,
    processedBy: null,
    rejectReason: null,
    bankAccount: {
      bankName: '신한은행',
      accountNumber: '110-***-***876',
      accountHolder: '이서연',
      verified: true,
    },
    documents: [
      {
        id: 1,
        type: 'BUSINESS_DOC',
        name: '사업자등록증',
        mimeType: 'application/pdf',
        sizeBytes: 1_990_000,
        url: '/uploads/business/seoyeon_biz.pdf',
        uploadedAt: '2025-05-13 14:18',
      },
      {
        id: 2,
        type: 'BANKBOOK',
        name: '통장사본',
        mimeType: 'application/pdf',
        sizeBytes: 820_000,
        url: '/uploads/bankbook/seoyeon_bank.pdf',
        uploadedAt: '2025-05-13 14:21',
      },
      {
        id: 3,
        type: 'SPACE_PHOTO',
        name: '공간 사진',
        mimeType: 'image/jpeg',
        sizeBytes: 4_900_000,
        urls: [
          'https://picsum.photos/seed/sloway-space-1/1200/800',
          'https://picsum.photos/seed/sloway-space-2/1200/800',
          'https://picsum.photos/seed/sloway-space-3/1200/800',
          'https://picsum.photos/seed/sloway-space-4/1200/800',
          'https://picsum.photos/seed/sloway-space-5/1200/800',
          'https://picsum.photos/seed/sloway-space-6/1200/800',
        ],
        count: 6,
        uploadedAt: '2025-05-13 14:21',
      },
    ],
  },
  'HA-2025-007': {
    applicationId: 'HA-2025-007',
    memberId: 10107,
    email: 'donghyun.jung@example.com',
    name: '정동현',
    phone: '010-8901-2345',
    businessNumber: '789-01-23456',
    businessName: '경주 한옥 게스트하우스',
    representative: '정동현',
    businessCategory: '숙박업 / 한옥체험',
    businessAddress: '경상북도 경주시 황남동 ...',
    businessContact: '054-987-6543',
    applyStatus: 'APPROVED',
    applyMessage: '경주 한옥 체험 게스트하우스 운영 중입니다.',
    appliedAt: '2025-05-09 10:30',
    processedAt: '2025-05-10 09:15',
    processedBy: '관리자 A',
    rejectReason: null,
    bankAccount: {
      bankName: '국민은행',
      accountNumber: '123-***-***456',
      accountHolder: '정동현',
      verified: true,
    },
    documents: [
      {
        id: 1,
        type: 'BUSINESS_DOC',
        name: '사업자등록증',
        mimeType: 'application/pdf',
        sizeBytes: 2_100_000,
        url: '/uploads/business/donghyun_biz.pdf',
        uploadedAt: '2025-05-09 10:25',
      },
      {
        id: 2,
        type: 'BANKBOOK',
        name: '통장사본',
        mimeType: 'application/pdf',
        sizeBytes: 750_000,
        url: '/uploads/bankbook/donghyun_bank.pdf',
        uploadedAt: '2025-05-09 10:27',
      },
      {
        id: 3,
        type: 'SPACE_PHOTO',
        name: '공간 사진',
        mimeType: 'image/jpeg',
        sizeBytes: 3_800_000,
        urls: [
          'https://picsum.photos/seed/sloway-hanok-1/1200/800',
          'https://picsum.photos/seed/sloway-hanok-2/1200/800',
          'https://picsum.photos/seed/sloway-hanok-3/1200/800',
        ],
        count: 3,
        uploadedAt: '2025-05-09 10:28',
      },
    ],
  },
  'HA-2025-010': {
    applicationId: 'HA-2025-010',
    memberId: 10110,
    email: 'fake.host@example.com',
    name: '김위장',
    phone: '010-1111-2222',
    businessNumber: '000-00-00000',
    businessName: '미상 호스트',
    representative: '김위장',
    businessCategory: '미상',
    businessAddress: '서울 어딘가',
    businessContact: '02-000-0000',
    applyStatus: 'REJECTED',
    applyMessage: '운영하고싶어요',
    appliedAt: '2025-05-06 18:10',
    processedAt: '2025-05-07 14:30',
    processedBy: '관리자 A',
    rejectReason: '사업자등록증 사본 식별 불가 — 원본 스캔본으로 재제출 요청',
    bankAccount: {
      bankName: '농협은행',
      accountNumber: '301-***-***000',
      accountHolder: '김위장',
      verified: false,
    },
    documents: [
      {
        id: 1,
        type: 'BUSINESS_DOC',
        name: '사업자등록증',
        mimeType: 'application/pdf',
        sizeBytes: 120_000,
        url: '/uploads/business/fake_biz.pdf',
        uploadedAt: '2025-05-06 18:05',
      },
      {
        id: 2,
        type: 'BANKBOOK',
        name: '통장사본',
        mimeType: 'application/pdf',
        sizeBytes: 80_000,
        url: '/uploads/bankbook/fake_bank.pdf',
        uploadedAt: '2025-05-06 18:08',
      },
      {
        id: 3,
        type: 'SPACE_PHOTO',
        name: '공간 사진',
        mimeType: 'image/jpeg',
        sizeBytes: 500_000,
        urls: ['https://picsum.photos/seed/sloway-fake-1/1200/800'],
        count: 1,
        uploadedAt: '2025-05-06 18:09',
      },
    ],
  },
};

const STATUS_LABEL = {
  PENDING: '검토 대기',
  APPROVED: '승인',
  REJECTED: '반려',
};

// 검토 체크리스트 — 컴포넌트 외부 선언 (정책 데이터)
const CHECKLIST_ITEMS = [
  {
    id: 'biz_doc',
    label: '사업자등록증 확인',
    desc: '사업자번호 일치, 업태·종목 확인',
  },
  { id: 'bankbook', label: '통장사본 확인', desc: '예금주 = 사업자명 일치' },
  {
    id: 'biz_status',
    label: '사업자 상태 확인',
    desc: '국세청 사업자 상태 조회 (휴·폐업 아님)',
  },
  {
    id: 'space_photo',
    label: '공간 사진 확인',
    desc: '실제 운영 가능한 공간인지 확인',
  },
  {
    id: 'terms',
    label: '호스트 약관 동의 확인',
    desc: '수수료 정책·운영 정책 동의 확인',
  },
];

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

const maskPhone = (phone) => {
  if (!phone) return '-';
  return phone.replace(/(\d{3})-(\d{4})-(\d{4})/, '$1-****-$3');
};

function HostApplyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const initial = APPLICATION_DETAILS[id] || APPLICATION_DETAILS['HA-2025-001'];
  const [application, setApplication] = useState(initial);

  // 체크리스트 (각 항목 체크 상태)
  const [checkedItems, setCheckedItems] = useState({});

  // 미리보기 모달
  const [previewDoc, setPreviewDoc] = useState(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  // 반려 모달
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const isPending = application.applyStatus === 'PENDING';
  const isApproved = application.applyStatus === 'APPROVED';
  const isRejected = application.applyStatus === 'REJECTED';

  // 체크리스트 진행률
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const allChecked = checkedCount === CHECKLIST_ITEMS.length;
  const progress = Math.round((checkedCount / CHECKLIST_ITEMS.length) * 100);

  // ─── 핸들러 ──────────────────────────
  const toggleCheck = (itemId) => {
    setCheckedItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const openPreview = (doc) => {
    setPreviewDoc(doc);
    setPhotoIndex(0);
  };

  const closePreview = () => setPreviewDoc(null);

  const handleApprove = () => {
    if (!allChecked) {
      alert('모든 검토 항목을 체크해야 승인할 수 있습니다.');
      return;
    }
    if (
      !window.confirm(
        `${application.name} 님의 호스트 신청을 승인하시겠습니까?`
      )
    )
      return;

    // TODO: PATCH /api/admin/hosts/applications/{id}/approve
    setApplication((prev) => ({
      ...prev,
      applyStatus: 'APPROVED',
      processedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      processedBy: '관리자 (본인)',
    }));
    alert('호스트 신청이 승인되었습니다.');
  };

  const handleRejectConfirm = () => {
    if (!rejectReason.trim()) {
      alert('반려 사유를 입력해주세요.');
      return;
    }
    // TODO: PATCH /api/admin/hosts/applications/{id}/reject { reason }
    setApplication((prev) => ({
      ...prev,
      applyStatus: 'REJECTED',
      processedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      processedBy: '관리자 (본인)',
      rejectReason: rejectReason,
    }));
    setRejectOpen(false);
    alert('호스트 신청이 반려되었습니다.');
  };

  return (
    <PageContainer>
      <PageLayout
        title="호스트 신청 상세"
        description="제출 서류를 검토하고 승인 또는 반려를 결정하세요"
        backTo="/admin/host/apply"
        backLabel="호스트 신청 목록"
      >
        {/* 신청자 헤더 카드 */}
        <HeaderCard>
          <HeaderTop>
            <StatusBadge $status={application.applyStatus}>
              {STATUS_LABEL[application.applyStatus]}
            </StatusBadge>
            <ApplicationId>{application.applicationId}</ApplicationId>
          </HeaderTop>
          <BusinessNameRow>{application.businessName}</BusinessNameRow>
          <ApplicantRow>
            <span>
              신청자: <strong>{application.name}</strong>
            </span>
            <Dot>·</Dot>
            <span>{maskPhone(application.phone)}</span>
            <Dot>·</Dot>
            <span>{application.email}</span>
          </ApplicantRow>
          <AppliedAt>
            <FaCalendarAlt /> 신청 {application.appliedAt}
          </AppliedAt>

          {/* 이미 처리된 경우 결과 표시 */}
          {isApproved && (
            <ProcessedNotice $variant="approved">
              <FaCheckCircle />
              <div>
                <strong>승인 완료</strong>
                <span>
                  {application.processedAt} · 처리: {application.processedBy}
                </span>
              </div>
            </ProcessedNotice>
          )}
          {isRejected && (
            <ProcessedNotice $variant="rejected">
              <FaTimesCircle />
              <div>
                <strong>반려</strong>
                <span>
                  {application.processedAt} · 처리: {application.processedBy}
                </span>
                <RejectReason>{application.rejectReason}</RejectReason>
              </div>
            </ProcessedNotice>
          )}
        </HeaderCard>

        {/* 사업자 정보 + 정산 계좌 (2컬럼) */}
        <TwoCol>
          <InfoCard>
            <CardTitle>
              <FaIdCard /> 사업자 정보
            </CardTitle>
            <InfoRow>
              <Label>상호명</Label>
              <Value>{application.businessName}</Value>
            </InfoRow>
            <InfoRow>
              <Label>대표자</Label>
              <Value>{application.representative}</Value>
            </InfoRow>
            <InfoRow>
              <Label>사업자번호</Label>
              <Value>{application.businessNumber}</Value>
            </InfoRow>
            <InfoRow>
              <Label>업태/종목</Label>
              <Value>{application.businessCategory}</Value>
            </InfoRow>
            <InfoRow>
              <Label>사업장 주소</Label>
              <Value>{application.businessAddress}</Value>
            </InfoRow>
            <InfoRow>
              <Label>연락처</Label>
              <Value>{application.businessContact}</Value>
            </InfoRow>
          </InfoCard>

          <InfoCard>
            <CardTitle>
              <FaUniversity /> 정산 계좌
            </CardTitle>
            <InfoRow>
              <Label>은행</Label>
              <Value>{application.bankAccount.bankName}</Value>
            </InfoRow>
            <InfoRow>
              <Label>계좌번호</Label>
              <Value>{application.bankAccount.accountNumber}</Value>
            </InfoRow>
            <InfoRow>
              <Label>예금주</Label>
              <Value>{application.bankAccount.accountHolder}</Value>
            </InfoRow>
            <VerifyBox $verified={application.bankAccount.verified}>
              {application.bankAccount.verified ? (
                <>
                  <FaCheckCircle />
                  <div>
                    <strong>계좌 실명 일치 확인됨</strong>
                    <span>예금주와 사업자명이 일치합니다</span>
                  </div>
                </>
              ) : (
                <>
                  <FaExclamationTriangle />
                  <div>
                    <strong>계좌 실명 확인 필요</strong>
                    <span>예금주와 사업자명을 확인해주세요</span>
                  </div>
                </>
              )}
            </VerifyBox>
          </InfoCard>
        </TwoCol>

        {/* 신청 메시지 */}
        {application.applyMessage && (
          <InfoCard>
            <CardTitle>신청 메시지</CardTitle>
            <ApplyMessage>{application.applyMessage}</ApplyMessage>
          </InfoCard>
        )}

        {/* 제출 서류 */}
        <InfoCard>
          <CardTitle>
            <FaFileAlt /> 제출 서류
          </CardTitle>
          <DocumentList>
            {application.documents.map((doc) => (
              <DocumentItem key={doc.id}>
                <DocIcon>
                  {doc.type === 'SPACE_PHOTO' ? <FaImages /> : <FaFileAlt />}
                </DocIcon>
                <DocInfo>
                  <DocName>
                    {doc.name}
                    {doc.type === 'SPACE_PHOTO' && (
                      <DocCount>({doc.count}장)</DocCount>
                    )}
                  </DocName>
                  <DocMeta>
                    {formatFileSize(doc.sizeBytes)} · 업로드 {doc.uploadedAt}
                  </DocMeta>
                </DocInfo>
                <DocActions>
                  <DocBtn onClick={() => openPreview(doc)}>
                    <FaEye /> 미리보기
                  </DocBtn>
                  <DocBtn
                    as="a"
                    href={doc.type === 'SPACE_PHOTO' ? doc.urls[0] : doc.url}
                    download
                    rel="noreferrer"
                  >
                    <FaDownload /> 다운로드
                  </DocBtn>
                </DocActions>
              </DocumentItem>
            ))}
          </DocumentList>
        </InfoCard>

        {/* 검토 체크리스트 */}
        <InfoCard>
          <CardTitleRow>
            <CardTitle>
              <FaCheckCircle /> 검토 체크리스트
            </CardTitle>
            <ChecklistProgress>
              <ProgressText>
                {checkedCount} / {CHECKLIST_ITEMS.length}
              </ProgressText>
              <ProgressBar>
                <ProgressFill $width={progress} $complete={allChecked} />
              </ProgressBar>
            </ChecklistProgress>
          </CardTitleRow>

          {isPending && (
            <ChecklistGuide>
              승인 전 아래 항목을 모두 확인해주세요.{' '}
              <strong>5개 모두 체크</strong>해야 승인할 수 있습니다.
            </ChecklistGuide>
          )}

          <ChecklistGrid>
            {CHECKLIST_ITEMS.map((item) => (
              <CheckItem
                key={item.id}
                $checked={!!checkedItems[item.id]}
                onClick={() => isPending && toggleCheck(item.id)}
                $disabled={!isPending}
              >
                <CheckBox $checked={!!checkedItems[item.id]}>
                  {checkedItems[item.id] && <FaCheckCircle />}
                </CheckBox>
                <CheckBody>
                  <CheckLabel>{item.label}</CheckLabel>
                  <CheckDesc>{item.desc}</CheckDesc>
                </CheckBody>
              </CheckItem>
            ))}
          </ChecklistGrid>
        </InfoCard>

        {/* 액션 영역 (대기 상태만) */}
        {isPending && (
          <ActionCard>
            <ActionInfo>
              {allChecked ? (
                <ActionReady>
                  <FaCheckCircle /> 모든 항목을 확인했습니다. 승인할 수
                  있습니다.
                </ActionReady>
              ) : (
                <ActionBlocked>
                  <FaExclamationTriangle /> 검토 체크리스트를 모두 완료해주세요
                  ({checkedCount}/{CHECKLIST_ITEMS.length})
                </ActionBlocked>
              )}
            </ActionInfo>
            <ActionButtons>
              <RejectBtn onClick={() => setRejectOpen(true)}>반려</RejectBtn>
              <ApproveBtn disabled={!allChecked} onClick={handleApprove}>
                호스트 승인
              </ApproveBtn>
            </ActionButtons>
          </ActionCard>
        )}
      </PageLayout>

      {/* 미리보기 모달 */}
      {previewDoc && (
        <PreviewOverlay onClick={closePreview}>
          <PreviewCard onClick={(e) => e.stopPropagation()}>
            <PreviewHeader>
              <PreviewTitle>
                {previewDoc.name}
                {previewDoc.type === 'SPACE_PHOTO' && (
                  <PreviewCount>
                    {photoIndex + 1} / {previewDoc.count}
                  </PreviewCount>
                )}
              </PreviewTitle>
              <PreviewHeaderActions>
                <PreviewIconBtn
                  as="a"
                  href={
                    previewDoc.type === 'SPACE_PHOTO'
                      ? previewDoc.urls[photoIndex]
                      : previewDoc.url
                  }
                  target="_blank"
                  rel="noreferrer"
                  title="새 탭에서 열기"
                >
                  <FaExternalLinkAlt />
                </PreviewIconBtn>
                <PreviewIconBtn onClick={closePreview} title="닫기">
                  <FaTimes />
                </PreviewIconBtn>
              </PreviewHeaderActions>
            </PreviewHeader>

            <PreviewBody>
              {previewDoc.type === 'SPACE_PHOTO' ? (
                <>
                  <PhotoArea>
                    <PhotoNavBtn
                      $side="left"
                      disabled={photoIndex === 0}
                      onClick={() => setPhotoIndex((i) => Math.max(0, i - 1))}
                    >
                      <FaChevronLeft />
                    </PhotoNavBtn>
                    <PhotoImage
                      src={previewDoc.urls[photoIndex]}
                      alt={`공간 사진 ${photoIndex + 1}`}
                    />
                    <PhotoNavBtn
                      $side="right"
                      disabled={photoIndex === previewDoc.count - 1}
                      onClick={() =>
                        setPhotoIndex((i) =>
                          Math.min(previewDoc.count - 1, i + 1)
                        )
                      }
                    >
                      <FaChevronRight />
                    </PhotoNavBtn>
                  </PhotoArea>
                  <ThumbnailRow>
                    {previewDoc.urls.map((url, idx) => (
                      <Thumbnail
                        key={idx}
                        $active={idx === photoIndex}
                        onClick={() => setPhotoIndex(idx)}
                      >
                        <img src={url} alt={`thumb-${idx}`} />
                      </Thumbnail>
                    ))}
                  </ThumbnailRow>
                </>
              ) : (
                <PdfFrame src={previewDoc.url} title={previewDoc.name} />
              )}
            </PreviewBody>
          </PreviewCard>
        </PreviewOverlay>
      )}

      {/* 반려 모달 */}
      {rejectOpen && (
        <ModalOverlay onClick={() => setRejectOpen(false)}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalTitle>호스트 신청 반려</ModalTitle>
            <ModalDesc>
              <strong>{application.name}</strong>의 호스트 신청을 반려합니다.
              반려 사유는 신청자에게 알림으로 전달됩니다.
            </ModalDesc>

            <FormGroup>
              <FormLabel>반려 사유 *</FormLabel>
              <FormTextarea
                rows="4"
                placeholder="신청자가 무엇을 보완하면 되는지 명확히 작성해주세요 (예: 사업자등록증 사본 식별 불가 → 원본 스캔본으로 재제출 요청)"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                maxLength={300}
              />
              <HelpText>{rejectReason.length} / 300</HelpText>
            </FormGroup>

            <ModalActions>
              <ModalBtn onClick={() => setRejectOpen(false)}>취소</ModalBtn>
              <ModalBtn $danger onClick={handleRejectConfirm}>
                반려 처리
              </ModalBtn>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}
    </PageContainer>
  );
}

export default HostApplyDetailPage;

// ─────────────────────────────────────────────
// Styled Components
// ─────────────────────────────────────────────
const PageContainer = styled.div`
  padding: 20px;
  background-color: #f4efe6;
  min-height: 95.2%;
`;

const HeaderCard = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #eee;
  padding: 24px 28px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  margin-bottom: 20px;
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  background: ${({ $status }) =>
    $status === 'PENDING'
      ? '#FBE4C2'
      : $status === 'APPROVED'
        ? '#E8F0DF'
        : $status === 'REJECTED'
          ? '#F7D4D1'
          : '#EEE'};
  color: ${({ $status }) =>
    $status === 'PENDING'
      ? '#9B6A1F'
      : $status === 'APPROVED'
        ? '#5A6B4F'
        : $status === 'REJECTED'
          ? '#9B3A36'
          : '#888'};
`;

const ApplicationId = styled.span`
  font-size: 13px;
  color: #888;
  font-family: monospace;
`;

const BusinessNameRow = styled.div`
  font-size: 26px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
`;

const ApplicantRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #555;
  flex-wrap: wrap;

  strong {
    color: #333;
    font-weight: 600;
  }
`;

const Dot = styled.span`
  color: #ccc;
`;

const AppliedAt = styled.div`
  margin-top: 10px;
  font-size: 13px;
  color: #888;
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    font-size: 12px;
  }
`;

const ProcessedNotice = styled.div`
  margin-top: 16px;
  padding: 14px 18px;
  background: ${(p) => (p.$variant === 'approved' ? '#F0F6EA' : '#FDF1F0')};
  border-left: 3px solid
    ${(p) => (p.$variant === 'approved' ? '#7A8B71' : '#C9433D')};
  border-radius: 4px;
  display: flex;
  align-items: flex-start;
  gap: 12px;

  svg {
    color: ${(p) => (p.$variant === 'approved' ? '#7A8B71' : '#C9433D')};
    font-size: 18px;
    margin-top: 2px;
    flex-shrink: 0;
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  strong {
    color: ${(p) => (p.$variant === 'approved' ? '#5A6B4F' : '#9B3A36')};
    font-weight: 600;
    font-size: 14px;
  }

  span {
    font-size: 13px;
    color: #666;
  }
`;

const RejectReason = styled.div`
  margin-top: 8px;
  padding: 10px 14px;
  background: white;
  border-radius: 6px;
  font-size: 13px;
  color: #444;
  line-height: 1.5;
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #eee;
  padding: 22px 26px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  margin-bottom: 20px;
`;

const CardTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  gap: 16px;
  flex-wrap: wrap;
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    color: #7a8b71;
    font-size: 15px;
  }

  ${CardTitleRow} & {
    margin-bottom: 0;
  }
`;

const InfoRow = styled.div`
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #f4f1eb;
  font-size: 14px;

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.span`
  width: 110px;
  color: #888;
  flex-shrink: 0;
`;

const Value = styled.span`
  color: #333;
  flex: 1;
  word-break: break-all;
`;

const VerifyBox = styled.div`
  margin-top: 14px;
  padding: 12px 14px;
  background: ${(p) => (p.$verified ? '#F0F6EA' : '#FEF6E8')};
  border-left: 3px solid ${(p) => (p.$verified ? '#7A8B71' : '#D9A441')};
  border-radius: 4px;
  display: flex;
  align-items: flex-start;
  gap: 10px;

  svg {
    color: ${(p) => (p.$verified ? '#7A8B71' : '#D9A441')};
    font-size: 16px;
    margin-top: 2px;
    flex-shrink: 0;
  }

  strong {
    display: block;
    color: ${(p) => (p.$verified ? '#5A6B4F' : '#9B6A1F')};
    font-weight: 600;
    font-size: 13px;
  }

  span {
    display: block;
    font-size: 12px;
    color: #666;
    margin-top: 2px;
  }
`;

const ApplyMessage = styled.p`
  font-size: 14px;
  color: #444;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
`;

// 제출 서류
const DocumentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DocumentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  background: #faf8f3;
  border-radius: 8px;
  border: 1px solid #f0ece2;

  @media (max-width: 700px) {
    flex-wrap: wrap;
  }
`;

const DocIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7a8b71;
  font-size: 16px;
  flex-shrink: 0;
`;

const DocInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const DocName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: baseline;
  gap: 6px;
`;

const DocCount = styled.span`
  font-size: 12px;
  color: #888;
  font-weight: 400;
`;

const DocMeta = styled.div`
  font-size: 12px;
  color: #888;
  margin-top: 2px;
`;

const DocActions = styled.div`
  display: flex;
  gap: 6px;
  flex-shrink: 0;
`;

const DocBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 12px;
  font-size: 13px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  color: #555;
  cursor: pointer;
  font-family: inherit;
  text-decoration: none;
  transition: all 150ms ease;

  svg {
    font-size: 11px;
  }

  &:hover {
    background: #f9faf8;
    border-color: #a8b89f;
    color: #333;
  }
`;

// 체크리스트
const ChecklistProgress = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ProgressText = styled.span`
  font-size: 13px;
  color: #666;
  font-weight: 600;
`;

const ProgressBar = styled.div`
  width: 120px;
  height: 6px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  width: ${(p) => p.$width}%;
  height: 100%;
  background: ${(p) => (p.$complete ? '#7A8B71' : '#D9A441')};
  transition:
    width 250ms ease,
    background 250ms ease;
`;

const ChecklistGuide = styled.div`
  font-size: 13px;
  color: #888;
  margin-bottom: 14px;

  strong {
    color: #555;
    font-weight: 600;
  }
`;

const ChecklistGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CheckItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border: 1.5px solid ${(p) => (p.$checked ? '#a8b89f' : '#e8e6e0')};
  background: ${(p) => (p.$checked ? '#F5F8F1' : '#fff')};
  border-radius: 8px;
  cursor: ${(p) => (p.$disabled ? 'default' : 'pointer')};
  opacity: ${(p) => (p.$disabled ? 0.7 : 1)};
  transition: all 150ms ease;

  &:hover {
    border-color: ${(p) =>
      p.$disabled ? (p.$checked ? '#a8b89f' : '#e8e6e0') : '#a8b89f'};
  }
`;

const CheckBox = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 2px solid ${(p) => (p.$checked ? '#7A8B71' : '#cfcbc2')};
  background: ${(p) => (p.$checked ? '#7A8B71' : 'white')};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
  transition: all 150ms ease;

  svg {
    font-size: 14px;
    color: white;
  }
`;

const CheckBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const CheckLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const CheckDesc = styled.span`
  font-size: 12px;
  color: #888;
`;

// 액션 영역
const ActionCard = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #eee;
  padding: 18px 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const ActionInfo = styled.div`
  flex: 1;
  min-width: 220px;
`;

const ActionReady = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #5a6b4f;
  font-weight: 600;

  svg {
    color: #7a8b71;
  }
`;

const ActionBlocked = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #9b6a1f;
  font-weight: 500;

  svg {
    color: #d9a441;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const RejectBtn = styled.button`
  padding: 11px 22px;
  font-size: 14px;
  font-weight: 500;
  background: white;
  color: #c9433d;
  border: 1.5px solid #e8b5b2;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  transition: all 150ms ease;

  &:hover {
    background: #fdf1f0;
    border-color: #c9433d;
  }
`;

const ApproveBtn = styled.button`
  padding: 11px 22px;
  font-size: 14px;
  font-weight: 600;
  background: #7a8b71;
  color: white;
  border: 1.5px solid #7a8b71;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  transition: all 150ms ease;

  &:hover:not(:disabled) {
    background: #6b7a63;
  }

  &:disabled {
    background: #c8cfc4;
    border-color: #c8cfc4;
    cursor: not-allowed;
  }
`;

// 미리보기 모달
const PreviewOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const PreviewCard = styled.div`
  background: white;
  border-radius: 14px;
  width: 100%;
  max-width: 1000px;
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const PreviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 22px;
  border-bottom: 1px solid #eee;
`;

const PreviewTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: baseline;
  gap: 10px;
`;

const PreviewCount = styled.span`
  font-size: 13px;
  color: #888;
  font-weight: 400;
`;

const PreviewHeaderActions = styled.div`
  display: flex;
  gap: 6px;
`;

const PreviewIconBtn = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 6px;
  background: white;
  border: 1px solid #ddd;
  color: #666;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  text-decoration: none;
  transition: all 150ms ease;

  &:hover {
    background: #f9faf8;
    border-color: #a8b89f;
    color: #333;
  }
`;

const PreviewBody = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #faf8f3;
`;

const PdfFrame = styled.iframe`
  width: 100%;
  flex: 1;
  border: none;
  background: white;
`;

const PhotoArea = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #2a2a2a;
  min-height: 0;
`;

const PhotoImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const PhotoNavBtn = styled.button`
  position: absolute;
  ${(p) => p.$side}: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 150ms ease;
  z-index: 1;

  &:hover:not(:disabled) {
    background: white;
    transform: translateY(-50%) scale(1.1);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const ThumbnailRow = styled.div`
  display: flex;
  gap: 6px;
  padding: 12px 16px;
  background: white;
  border-top: 1px solid #eee;
  overflow-x: auto;
`;

const Thumbnail = styled.button`
  width: 64px;
  height: 48px;
  border-radius: 6px;
  border: 2px solid ${(p) => (p.$active ? '#7A8B71' : 'transparent')};
  background: none;
  padding: 0;
  cursor: pointer;
  flex-shrink: 0;
  overflow: hidden;
  transition: all 150ms ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &:hover {
    border-color: ${(p) => (p.$active ? '#7A8B71' : '#a8b89f')};
  }
`;

// 반려 모달
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalCard = styled.div`
  background: white;
  border-radius: 14px;
  padding: 28px 28px 24px;
  width: 100%;
  max-width: 460px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
`;

const ModalDesc = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 20px 0;

  strong {
    color: #333;
    font-weight: 600;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #555;
  margin-bottom: 6px;
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid #e8e6e0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  font-family: inherit;
  resize: vertical;
  transition: border-color 200ms ease;

  &:focus {
    border-color: #a8b89f;
    box-shadow: 0 0 0 2px rgba(168, 184, 159, 0.2);
  }
`;

const HelpText = styled.div`
  font-size: 12px;
  color: #aaa;
  margin-top: 4px;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
`;

const ModalBtn = styled.button`
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 150ms ease;
  ${(p) =>
    p.$danger
      ? `
    background: #C9433D;
    color: white;
    border: 1px solid #C9433D;
    &:hover { background: #B33A35; }
  `
      : `
    background: #fff;
    color: #666;
    border: 1px solid #ddd;
    &:hover { background: #f9faf8; }
  `}
`;
