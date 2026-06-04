import React, { useState } from 'react';
import WishListLayout from '../../layouts/user/WishListLayout';
import WishCardComponent from '../../components/user/WishCardComponent';
import { useWishList } from '../../hooks/useWishList';

function WishListPage() {
  const { activeTab, setActiveTab, tabs, filteredData, handleToggleWish } =
    useWishList();

  return (
    <WishListLayout
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <WishCardComponent data={filteredData} onToggleWish={handleToggleWish} />
    </WishListLayout>
  );
}

export default WishListPage;
