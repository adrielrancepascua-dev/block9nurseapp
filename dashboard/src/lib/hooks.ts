import { useEffect, useState } from 'react'
import { subscribeToUsageEventChanges } from './usageData'

export interface NavItem {
  id: string
  label: string
  icon: string
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'analytics', label: 'Analytics', icon: '📈' },
  { id: 'users', label: 'Users', icon: '👥' },
  { id: 'export', label: 'Export', icon: '⬇️' },
]

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

/** Refresh on an interval, when the tab is focused, and when a new event arrives. */
export function useAutoRefresh(load: (silent: boolean) => void) {
  useEffect(() => {
    load(false)
  }, [load])

  useEffect(() => {
    const intervalId = window.setInterval(() => load(true), 30000)
    const onFocus = () => {
      if (document.visibilityState === 'visible') load(true)
    }
    window.addEventListener('focus', onFocus)
    const unsubscribe = subscribeToUsageEventChanges(() => load(true))
    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener('focus', onFocus)
      unsubscribe()
    }
  }, [load])
}
