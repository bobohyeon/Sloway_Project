import api from '../../../app/api/axiosApi';

export async function findStatsMonthlySales(year, month, months = 1) {
  const resp = await api.get(`/payment/stats/summary`, {
    params: { year, month, months },
  });
  return resp.data;
}

export async function findStatsPayMethods(year, month, months = 1) {
  const resp = await api.get(`/payment/stats/methods`, {
    params: { year, month, months },
  });
  return resp.data;
}

export async function findStatsMonthlyTrend(year, month, months = 1) {
  const resp = await api.get(`/payment/stats/trend`, {
    params: { year, month, months },
  });
  return resp.data;
}

export async function findStatsRefund(year, month, months = 1) {
  const resp = await api.get(`/payment/stats/refund`, {
    params: { year, month, months },
  });
  return resp.data;
}

export async function findHostSalesStats(year, month, months = 1) {
  const resp = await api.get(`/payment/stats/host`, {
    params: { year, month, months },
  });
  return resp.data;
}

export async function findSpaceStats(year, month, months = 1) {
  const resp = await api.get(`/payment/stats/space`, {
    params: { year, month, months },
  });
  return resp.data;
}

export async function findBookingStats(year, month, months = 1) {
  const resp = await api.get(`/payment/stats/booking`, {
    params: { year, month, months },
  });
  return resp.data;
}

export async function findMemberStats(year, month, months = 1) {
  const resp = await api.get(`/payment/stats/member`, {
    params: { year, month, months },
  });
  return resp.data;
}
