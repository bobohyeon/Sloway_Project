import React from 'react';
import SpaceApprovalLayout from '../../layouts/admin/SpaceApprovalLayOut';
import ApprovalStats from '../../components/admin/ApprovalStats';
import ApprovalTable from '../../components/admin/ApprovalTable';
import { useSpaceApprovalList } from '../../hooks/admin/useSpaceApprovalList';

function SpaceApprovalPage() {
  const { 
    currentTab,
    setCurrentTab, 
    selectedType,
    setSelectedType, 
    counts,
    filteredData,
    rawData 
  } = useSpaceApprovalList();

  return (
    <SpaceApprovalLayout
      currentTab={currentTab}
      onTabChange={setCurrentTab}
      counts={counts}
      typeFilter={{
        value: selectedType,
        onChange: (e) => setSelectedType(e.target.value),
      }}
      statsSection={<ApprovalStats totalData={rawData} />}
      tableSection={<ApprovalTable data={filteredData} />}
    />
  );
}

export default SpaceApprovalPage;