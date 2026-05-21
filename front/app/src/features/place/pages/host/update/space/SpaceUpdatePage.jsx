import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SpaceEditFormComponent from '../../../../components/host/update/space/SpaceEditFormComponent';
import SpaceUpdateLayout from '../../../../layouts/host/update/space/SpaceUpadteLayout';
import useSpaceUpdate from '../../../../hooks/host/place/useSpaceUpdate';

function SpaceUpdatePage() {
  const { formData, handleChange, handleSaveSubmit, navigate } =
    useSpaceUpdate();

  return (
    <SpaceUpdateLayout
      title="공간 수정"
      onSave={handleSaveSubmit}
      onCancel={() => navigate(-1)}
    >
      <SpaceEditFormComponent formData={formData} handleChange={handleChange} />
    </SpaceUpdateLayout>
  );
}

export default SpaceUpdatePage;
