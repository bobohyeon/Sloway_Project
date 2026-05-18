import React, { useState, useMemo } from 'react';
import SpaceApprovalLayout from '../../layouts/admin/SpaceApprovalLayOut';
import ApprovalStats from '../../components/admin/ApprovalStats';
import ApprovalTable from '../../components/admin/ApprovalTable';

// ✅ 1. rawData를 컴포넌트 외부로 이동 (재선언 방지)
const RAW_DATA = [
  {
    id: 'SP-000142',
    name: '제주 돌담집 리트릿',
    host: '박진호',
    type: 'STATION',
    status: 'P',
    price: '220,000',
    date: '2026.04.23 18:20',
    wait: '1일',
  },
  {
    id: 'SP-000143',
    name: '돌담집 리트릿',
    host: '박진호',
    type: 'STATION',
    status: 'P',
    price: 220000,
    date: '2026.04.23 18:20',
    wait: '1일',
  },
  {
    id: 'SP-000144',
    name: '제주 돌담집',
    host: '박진호',
    type: 'WORK_STAY',
    status: 'P',
    price: 220000,
    date: '2026.04.23 18:20',
    wait: '1일',
  },
  {
    id: 'SP-000145',
    name: '제주 리트릿',
    host: '박진호',
    type: 'STATION',
    status: 'R',
    price: 220000,
    date: '2026.04.23 18:20',
    wait: '1일',
  },
  {
    id: 'SP-000146',
    name: '리트릿 제주',
    host: '박진호',
    type: 'OFFICE',
    status: 'R',
    price: 220000,
    date: '2026.04.23 18:20',
    wait: '1일',
  },
  {
    id: 'SP-000141',
    name: '판교 테크오피스',
    host: '이민지',
    type: 'OFFICE',
    status: 'A',
    price: 28000,
    date: '2026.04.22 10:15',
    wait: '2일',
    isAlert: true,
  },
  {
    id: 'SP-000140',
    name: '성수 루프탑 스튜디오',
    host: '김철수',
    type: 'STATION',
    status: 'A',
    price: 55000,
    date: '2026.04.20 14:00',
    wait: '-',
  },
];

function SpaceApprovalPage() {
  const [currentTab, setCurrentTab] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const counts = useMemo(
    () => ({
      ALL: RAW_DATA.length,
      P: RAW_DATA.filter((d) => d.status === 'P').length,
      A: RAW_DATA.filter((d) => d.status === 'A').length,
      R: RAW_DATA.filter((d) => d.status === 'R').length,
    }),
    []
  ); // 의존성 배열 비움 (정적 데이터이므로)

  const filteredData = useMemo(() => {
    return RAW_DATA.filter((item) => {
      const matchesTab = currentTab === 'ALL' || item.status === currentTab;
      const matchesType = selectedType === 'ALL' || item.type === selectedType;

      return matchesTab && matchesType;
    });
  }, [currentTab, selectedType, RAW_DATA]);

  return (
    <SpaceApprovalLayout
      currentTab={currentTab}
      onTabChange={setCurrentTab}
      counts={counts}
      typeFilter={{
        value: selectedType,
        onChange: (e) => setSelectedType(e.target.value),
      }}
      statsSection={<ApprovalStats totalData={RAW_DATA} />}
      tableSection={<ApprovalTable data={filteredData} />}
    />
  );
}

export default SpaceApprovalPage;
