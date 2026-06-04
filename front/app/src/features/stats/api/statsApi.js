import api from '../../../app/api/axiosApi';

export async function findStatsMonthlySales(year, month) {
  const resp = await api.get(`/payment/stats/summary`, { params: { year, month } });
  return resp.data;
}

export async function findStatsPayMethods(year, month) {
  const resp = await api.get(`/payment/stats/methods`, { params: { year, month } });
  return resp.data;
}

export async function findStatsMonthlyTrend(year, month) {
  const resp = await api.get(`/payment/stats/trend`, { params: { year, month } });
  return resp.data;
}

export async function findStatsRefund(year, month) {
  const resp = await api.get(`/payment/stats/refund`, { params: { year, month } });
  return resp.data;
}

export async function findHostSalesStats(year, month) {
  const resp = await api.get(`/payment/stats/host`, {
    params: { year, month },
  });
  return resp.data;
}

export async function findSpaceStats(year, month) {
  const resp = await api.get(`/payment/stats/space`, { params: { year, month } });
  return resp.data;
}

export async function findBookingStats(year, month) {
  const resp = await api.get(`/payment/stats/booking`, {
    params: { year, month },
  });
  return resp.data;
}

export async function findMemberStats(year, month) {
  const resp = await api.get(`/payment/stats/member`, {
    params: { year, month },
  });
  return resp.data;
}
