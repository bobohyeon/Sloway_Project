import { useState, useEffect } from 'react';
import { getHostMyPage } from '../api/hostApi';
/**
 * 호스트 본인 마이페이지 정보 조회 훅.
 * 마운트 시 1회 호출. { data, loading, error } 제공.
 */
export function useHostMyPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true; // 응답 오기 전 언마운트되면 setState 막기 (경고/누수 방지)

    (async () => {
      try {
        const res = await getHostMyPage();
        if (alive) setData(res);
      } catch (err) {
        if (alive) {
          setError(
            err.response?.data?.message ?? '호스트 정보를 불러오지 못했습니다'
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
