import { useMemo } from 'react'

const REFUND_POLICY = [
  { minDays: 7, rate: 100, label: '7일 이상 전' },
  { minDays: 3, rate: 50, label: '3~6일 전' },
  { minDays: 1, rate: 30, label: '1~2일 전' },
  { minDays: 0, rate: 0, label: '당일' },
]

export function useRefundCalculation({ amount, checkInDate, hostRejected = false }) {
  return useMemo(() => {
    if (hostRejected) {
      return {
        daysUntilCheckIn: 0,
        rate: 100,
        refundAmount: amount,
        policyText: '호스트 거절로 인한 자동 전액 환불',
        canRefund: true,
        policyVariant: 'success',
      }
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const checkIn = new Date(checkInDate)
    checkIn.setHours(0, 0, 0, 0)

    const diffMs = checkIn.getTime() - today.getTime()
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    let policy = REFUND_POLICY.find((p) => days >= p.minDays)
    if (!policy) policy = REFUND_POLICY[REFUND_POLICY.length - 1]

    const refundAmount = Math.floor((amount * policy.rate) / 100)
    const canRefund = policy.rate > 0

    let policyText = ''
    if (days >= 7) {
      policyText = `현재 이용 ${days}일 전이므로 100% 환불 적용`
    } else if (days >= 3) {
      policyText = `이용 ${days}일 전이므로 50% 환불 적용`
    } else if (days >= 1) {
      policyText = `이용 ${days}일 전이므로 30%만 환불 가능`
    } else {
      policyText = '이용 당일이므로 환불이 불가능합니다'
    }

    let policyVariant = 'success'
    if (policy.rate === 50) policyVariant = 'warning'
    else if (policy.rate <= 30) policyVariant = 'danger'

    return {
      daysUntilCheckIn: days,
      rate: policy.rate,
      refundAmount,
      policyText,
      policyLabel: policy.label,
      canRefund,
      policyVariant,
    }
  }, [amount, checkInDate, hostRejected])
}
