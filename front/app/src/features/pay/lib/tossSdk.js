import { loadTossPayments, ANONYMOUS } from '@tosspayments/tosspayments-sdk';

const CLIENT_KEY = import.meta.env.test_ck_jExPeJWYVQ5MjODOvLpPV49R5gvN;

export async function requestTossPayment({
  orderId,
  amount,
  orderName,
  customerKey,
}) {
  if (!CLIENT_KEY) {
    throw new Error(
      'VITE_TOSS_CLIENT_KEY 미설정 — front/app/.env에 토스 클라이언트 키를 넣어주세요.'
    );
  }

  const tossPayments = await loadTossPayments(CLIENT_KEY);
  const payment = tossPayments.payment({
    customerKey: customerKey ?? ANONYMOUS,
  });

  await payment.requestPayment({
    method: 'CARD',
    amount: { currency: 'KRW', value: amount },
    orderId,
    orderName,
    successUrl: window.location.origin + '/user/payment/toss/success',
    failUrl: window.location.origin + '/user/payment/fail',
    card: {
      flowMode: 'DEFAULT',
      useEscrow: false,
      useCardPoint: false,
      useAppCardOnly: false,
    },
  });
}
