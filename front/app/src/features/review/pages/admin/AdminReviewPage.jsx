import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import {
  TabBar,
  TabBtn,
  TabCount,
  Card,
  CardRow,
  CardBody,
  TagRow,
  CardTitle,
  CardMeta,
  CardRight,
  COLOR,
} from '../../../rsvn/components/user/RsvnStyled';
import { findAllReports } from '../../api/reviewApi';

const FilterRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 16px;
`;

const Select = styled.select`
  padding: 7px 12px;
  border: 1px solid ${COLOR.gray200};
  border-radius: 8px;
  font-size: 13px;
  background: #fff;
  outline: none;
`;

const StatusBadge = styled.span`
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  background: ${({ $status }) =>
    $status === 'PENDING' ? '#FFF3E0' : $status === 'I' ? '#EEF5EE' : '#FFEBEB'};
  color: ${({ $status }) =>
    $status === 'PENDING' ? '#E65100' : $status === 'I' ? '#2D6A4F' : '#C0392B'};
`;

// 백엔드 enum 값 → 표시 라벨 매핑
const STATUS_LABEL = { null: '검토 중', I: '유지', D: '삭제됨' };
const REASON_LABEL = {
  SPAM: '공간과 관련 없는 내용',
  FALSE: '허위·과장된 내용',
  PRIVACY: '개인정보 노출',
  HATE: '욕설·혐오 표현',
  COPYRIGHT: '저작권 침해',
  ETC: '기타',
};

const TABS = [
  { label: '전체', status: null },
  { label: '검토 중', status: null, pending: true },
  { label: '유지', status: 'I' },
  { label: '삭제됨', status: 'D' },
];

function AdminReviewPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await findAllReports();
        setReports(data);
      } catch {
        setReports([]);
      }
    };
    fetchReports();
  }, []);

  const filtered = reports.filter((item) => {
    if (activeTab === 0) return true;
    if (activeTab === 1) return item.processStatus === null;
    if (activeTab === 2) return item.processStatus === 'I';
    if (activeTab === 3) return item.processStatus === 'D';
    return true;
  });

  const counts = [
    reports.length,
    reports.filter((i) => i.processStatus === null).length,
    reports.filter((i) => i.processStatus === 'I').length,
    reports.filter((i) => i.processStatus === 'D').length,
  ];

  const formatDate = (dt) => dt?.slice(0, 10).replaceAll('-', '.') ?? '';

  return (
    <PageLayout
      title="리뷰 신고 관리"
      description="접수된 리뷰 신고를 검토하고 처리하세요"
      maxWidth={1200}
    >
      <TabBar>
        {TABS.map((tab, idx) => (
          <TabBtn key={idx} $active={activeTab === idx} onClick={() => setActiveTab(idx)}>
            {tab.label}
            <TabCount $active={activeTab === idx}>{counts[idx]}</TabCount>
          </TabBtn>
        ))}
      </TabBar>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: COLOR.gray400, fontSize: 14 }}>
          조건에 맞는 신고가 없어요
        </div>
      )}

      {filtered.map((item) => (
        <Card
          key={item.no}
          onClick={() => navigate(`/admin/review/report/${item.no}`, { state: { report: item } })}
        >
          <CardRow>
            <CardBody>
              <TagRow>
                <StatusBadge $status={item.processStatus ?? 'PENDING'}>
                  {item.processStatus ? STATUS_LABEL[item.processStatus] : '검토 중'}
                </StatusBadge>
                <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 4, background: '#F5F0E8', color: '#666' }}>
                  {REASON_LABEL[item.reasonType] ?? item.reasonType}
                </span>
              </TagRow>
              <CardTitle style={{ marginTop: 4 }}>리뷰 No. {item.reviewNo}</CardTitle>
              <CardMeta>
                <span>신고자 No. {item.memberNo}</span>
                <span>·</span>
                <span>신고일 {formatDate(item.createdAt)}</span>
                {item.processAt && <><span>·</span><span>처리일 {formatDate(item.processAt)}</span></>}
              </CardMeta>
              {item.reasonDetail && (
                <div style={{ fontSize: 12, color: '#666', marginTop: 6, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  "{item.reasonDetail}"
                </div>
              )}
            </CardBody>
            <CardRight>
              <span style={{ fontSize: 12, color: COLOR.green }}>상세 →</span>
            </CardRight>
          </CardRow>
        </Card>
      ))}
    </PageLayout>
  );
}

export default AdminReviewPage;
