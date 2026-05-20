import React, { useState } from 'react';
import SpaceListLayout from '../../../layouts/host/list/SpaceListLayout';
import SpaceSummaryComponent from '../../../components/host/list/SpaceSummaryComponent';
import SpaceListComponent from '../../../components/host/list/SpaceListComponent';
import useSpaceList from '../../../hooks/host/place/useSpaceList';

function SpaceListPage() {
  const { activeTab, setActiveTab, spaces, tabs, filteredData, isLoading } =
    useSpaceList();

  if (isLoading) {
    return <div>로딩 중입니다...</div>;
  }

  return (
    <SpaceListLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabs={tabs}
      summarySection={<SpaceSummaryComponent spaces={spaces} />}
      listSection={<SpaceListComponent data={filteredData} />}
    />
  );
}

export default SpaceListPage;
