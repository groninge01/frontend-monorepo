'use client'

import { StatusChip } from '../ui/status-chip'
import { useOnlineStatus } from './useOnlineStatus'

export function PwaStatusChip() {
  const isOnline = useOnlineStatus()

  return (
    <StatusChip tone={isOnline ? 'neutral' : 'warning'}>
      {isOnline ? 'Watch mode' : 'Offline'}
    </StatusChip>
  )
}
