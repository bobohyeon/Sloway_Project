import api from '../../../app/api/axiosApi';

// ─── 리뷰 ───────────────────────────────────────────────────

export async function saveReview(formData) {
  await api.post('/review', formData);
}

export async function findReviewsByPlace(entityNo, type) {
  const res = await api.get('/review', { params: { entityNo, type } });
  return res.data;
}

export async function findMyReviews() {
  const res = await api.get('/review/my');
  return res.data;
}

export async function findOneReview(id) {
  const res = await api.get(`/review/${id}`);
  return res.data;
}

export async function editReview(id, dto) {
  await api.put(`/review/${id}`, dto);
}

export async function deleteReview(id) {
  await api.delete(`/review/${id}`);
}

// ─── 도움됨 ──────────────────────────────────────────────────

export async function countHelpful(reviewNo) {
  const res = await api.get(`/review/helpful/${reviewNo}`);
  return res.data;
}

export async function findMyHelpfulNo(reviewNo) {
  const res = await api.get(`/review/helpful/${reviewNo}/mine`);
  return res.data;
}

export async function saveHelpful(reviewNo) {
  await api.post('/review/helpful', { reviewNo: Number(reviewNo) });
}

export async function deleteHelpful(no) {
  await api.delete(`/review/helpful/${no}`);
}

// ─── 신고 ────────────────────────────────────────────────────

export async function saveReport(dto) {
  await api.post('/review/report', dto);
}

export async function findAllReports() {
  const res = await api.get('/review/report');
  return res.data;
}

export async function processReport(no, status) {
  await api.put(`/review/report/${no}?status=${status}`);
}

// ─── 호스트 평점 통계 ────────────────────────────────────────

export async function fetchHostReviewStats() {
  const res = await api.get('/review/host/stats');
  return res.data; // { averageRating: number, reviewCount: number }
}

// ─── 호스트 답글 (기존) ──────────────────────────────────────

export async function findReviewsByHost(placeNo, entityNo, spaceType, minScore, period) {
  const res = await api.get('/host/reply/reviews', {
    params: { placeNo, entityNo, spaceType, minScore, period },
  });
  return res.data;
}

export async function saveReply(reviewNo, content) {
  const res = await api.post('/review/reply', { reviewNo, content });
  return res.data;
}

export async function updateReply(replyNo, content) {
  const res = await api.put(`/review/reply/${replyNo}`, { content });
  return res.data;
}

export async function deleteReply(replyNo) {
  const res = await api.delete(`/review/reply/${replyNo}`);
  return res.data;
}
