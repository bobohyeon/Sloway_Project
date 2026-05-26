// src/hooks/useStationDetail.js

import { useState, useEffect } from 'react';
import { fetchStationDetailDashboard } from '../../../api/host/place/masterPlaceApi';
// import axios from 'axios'; // 실제 API 통신 시 주석 해제

export const useStationDetail = (typePath, id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const response = await fetchStationDetailDashboard(typePath, id);
        console.log(response);

        setData(response);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  return { data, loading, error };
};
