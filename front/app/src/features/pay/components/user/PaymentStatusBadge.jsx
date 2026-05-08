import { Badge } from '../../../pay_shared/components'

const STATUS_MAP = {
  completed: { label: '결제 완료', variant: 'success' },
  refunded: { label: '환불됨', variant: 'muted' },
  failed: { label: '결제 실패', variant: 'danger' },
  pending: { label: '대기', variant: 'warning' },
}

export function PaymentStatusBadge({ status, size = 'sm' }) {
  const info = STATUS_MAP[status] || { label: status, variant: 'muted' }
  return (
    <Badge variant={info.variant} size={size}>
      {info.label}
    </Badge>
  )
}
