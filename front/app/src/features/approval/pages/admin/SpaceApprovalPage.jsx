import React, { useState, useMemo } from 'react';
// 1. 레이아웃: 두 단계 올라가서 layouts/admin으로 이동
import SpaceApprovalLayout from '../../layouts/admin/SpaceApprovalLayOut';

// 2. 컴포넌트: 두 단계 올라가서 components/admin으로 이동
import ApprovalStats from '../../components/admin/ApprovalStats';
import ApprovalTable from '../../components/admin/ApprovalTable';

function SpaceApprovalPage() {
  const [currentTab, setCurrentTab] = useState('검수 대기');

  // 데이터 (실제로는 API 호출로 가져오게 됨)
  const rawData = [
    {
      id: 'SP-000142',
      name: '제주 돌담집 리트릿',
      host: '박진호',
      type: '숙소',
      status: '검수 대기',
      price: '220,000',
      date: '2026.04.23 18:20',
      wait: '1일',
    },
    {
      id: 'SP-000141',
      name: '판교 테크오피스',
      host: '이민지',
      type: '코워킹오피스',
      status: '검수 대기',
      price: '28,000',
      date: '2026.04.22 10:15',
      wait: '2일',
      isAlert: true,
    },
    {
      id: 'SP-000140',
      name: '성수 루프탑 스튜디오',
      host: '김철수',
      type: '스튜디오',
      status: '승인 완료',
      price: '55,000',
      date: '2026.04.20 14:00',
      wait: '-',
    },
    // ... 나머지 데이터
  ];

  // 탭별 개수 계산
  const counts = useMemo(
    () => ({
      전체: rawData.length,
      '검수 대기': rawData.filter((d) => d.status === '검수 대기').length,
      '승인 완료': rawData.filter((d) => d.status === '승인 완료').length,
      반려: rawData.filter((d) => d.status === '반려').length,
      중지: rawData.filter((d) => d.status === '중지').length,
    }),
    [rawData]
  );

  // 현재 탭에 맞는 필터링 데이터
  const filteredData = useMemo(() => {
    if (currentTab === '전체') return rawData;
    return rawData.filter((item) => item.status === currentTab);
  }, [currentTab, rawData]);

  return (
    <SpaceApprovalLayout
      currentTab={currentTab}
      onTabChange={setCurrentTab}
      counts={counts}
      // 통계 컴포넌트를 슬롯으로 전달
      statsSection={<ApprovalStats totalData={rawData} />}
      // 테이블 컴포넌트를 슬롯으로 전달
      tableSection={<ApprovalTable data={filteredData} />}
    />
  );
}

export default SpaceApprovalPage;
