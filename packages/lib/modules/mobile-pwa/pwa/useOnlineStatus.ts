'use client'

import { useSyncExternalStore } from 'react'

export function useOnlineStatus() {
  return useSyncExternalStore(subscribeToOnlineStatus, getOnlineSnapshot, () => true)
}

function subscribeToOnlineStatus(onStoreChange: () => void) {
  window.addEventListener('online', onStoreChange)
  window.addEventListener('offline', onStoreChange)

  return () => {
    window.removeEventListener('online', onStoreChange)
    window.removeEventListener('offline', onStoreChange)
  }
}

function getOnlineSnapshot() {
  return navigator.onLine
}
