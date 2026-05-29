import { useState, useEffect } from 'react';
import { getMyPage } from '../api/userApi';

/**
 * 일반회원 본인 마이페이지 정보 조회 훅.
 * 마운트 시 1회 호출. { data, loading, error } 제공.
 */
export function useMyPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await getMyPage();
        if (alive) setData(res);
      } catch (err) {
        if (alive) {
          setError(
            err.response?.data?.message ?? '내 정보를 불러오지 못했습니다'
          );
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return { data, loading, error };
}
