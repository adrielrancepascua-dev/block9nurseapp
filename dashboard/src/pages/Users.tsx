import { useCallback, useEffect, useState } from 'react'
import { UsageEvent, formatDuration } from '../lib/supabase'
import { formatNumber, normalizeUserEmail, sortBy } from '../lib/utils'
import { fetchUsageEventsResilient, subscribeToUsageEventChanges } from '../lib/usageData'

interface UserRow {
  email: string
  sessions: number
  totalDuration: number
  lastActive: string
  featureCount: number
}

function buildUserRows(events: UsageEvent[]): UserRow[] {
  const userMap = new Map<string, UsageEvent[]>()

  events.forEach((event) => {
    const email = normalizeUserEmail(event.user_email)
    if (!email) {
      return
    }
    if (!userMap.has(email)) {
      userMap.set(email, [])
    }
    userMap.get(email)!.push(event)
  })

  const userRows: UserRow[] = []

  userMap.forEach((userEvents, email) => {
    const sessions = new Set(userEvents.map((e) => e.session_id).filter(Boolean)).size
    const totalDuration = userEvents
      .filter((e) => e.feature === 'session' && e.action === 'session_end')
      .reduce((sum, e) => sum + (e.duration_ms || 0), 0)
    const lastActive = userEvents.reduce((latest, e) => {
      return !latest || e.timestamp > latest ? e.timestamp : latest
    }, '')
    const featureCount = new Set(
      userEvents
        .filter((e) => e.feature && e.feature !== 'session' && e.feature !== 'auth')
        .map((e) => e.feature)
    ).size

    userRows.push({
      email,
      sessions,
      totalDuration,
      lastActive,
      featureCount,
    })
  })

  return sortBy(userRows, 'lastActive', true)
}

export function Users() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<'live' | 'cache'>('live')
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [users, setUsers] = useState<UserRow[]>([])
  const [legacyEventCount, setLegacyEventCount] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true)
      } else {
        setRefreshing(true)
      }
      setError(null)

      const result = await fetchUsageEventsResilient({
        limit: 10000,
        retries: 3,
        timeoutMs: 9000,
      })

      const events = result.events as UsageEvent[]
      setDataSource(result.source)
      setStatusMessage(result.warning)
      setLegacyEventCount(events.filter((e) => !normalizeUserEmail(e.user_email)).length)
      setUsers(buildUserRows(events))
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (err) {
      console.error('Failed to fetch users:', err)
      setError(err instanceof Error ? err.message : 'Failed to load data')
      setStatusMessage('Unable to refresh now. Retrying automatically in background.')
    } finally {
      if (!silent) {
        setLoading(false)
      }
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      fetchUsers(true)
    }, 15000)

    const onFocus = () => fetchUsers(true)
    window.addEventListener('focus', onFocus)
    const unsubscribe = subscribeToUsageEventChanges(() => fetchUsers(true))

    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener('focus', onFocus)
      unsubscribe()
    }
  }, [fetchUsers])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-400">Loading users...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-200">
        Error: {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-800 border border-slate-700 rounded-lg p-3">
        <p className="text-xs text-slate-400">
          Last updated: {lastUpdated || 'just now'} • source: {dataSource} {refreshing ? '• refreshing...' : ''}
        </p>
        <button
          type="button"
          onClick={() => fetchUsers(true)}
          className="px-3 py-1.5 text-xs font-medium rounded bg-cyan-700 hover:bg-cyan-600 text-white"
        >
          Refresh
        </button>
      </div>

      {statusMessage && (
        <div className="bg-amber-900/30 border border-amber-700 rounded-lg p-3 text-amber-200 text-xs">
          {statusMessage}
        </div>
      )}

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-sm text-slate-300">
        One row per <strong className="text-slate-100">@cdd.edu.ph</strong> email. Sessions are grouped across app
        opens; the simulation agreement in the PWA is valid for <strong className="text-slate-100">30 days</strong>.
        {legacyEventCount > 0 && (
          <span className="block mt-2 text-slate-400 text-xs">
            {formatNumber(legacyEventCount)} legacy events without email are excluded from this table.
          </span>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-400 text-sm font-medium mb-2">Total Users</p>
          <p className="text-3xl font-bold text-white">{formatNumber(users.length)}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-400 text-sm font-medium mb-2">Avg Sessions per User</p>
          <p className="text-3xl font-bold text-white">
            {users.length > 0 ? (users.reduce((s, u) => s + u.sessions, 0) / users.length).toFixed(1) : '—'}
          </p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-400 text-sm font-medium mb-2">Avg Time per User</p>
          <p className="text-3xl font-bold text-white">
            {users.length > 0
              ? formatDuration(Math.round(users.reduce((s, u) => s + u.totalDuration, 0) / users.length))
              : '—'}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-900 border-b border-slate-700">
              <tr>
                <th className="px-4 py-3 text-left text-slate-300 font-semibold">User Email</th>
                <th className="px-4 py-3 text-left text-slate-300 font-semibold">Sessions</th>
                <th className="px-4 py-3 text-left text-slate-300 font-semibold">Total Time</th>
                <th className="px-4 py-3 text-left text-slate-300 font-semibold">Last Active</th>
                <th className="px-4 py-3 text-left text-slate-300 font-semibold">Features Used</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No signed-in users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.email} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-4 py-3 text-slate-300 truncate max-w-xs">
                      <span title={user.email}>{user.email}</span>
                    </td>
                    <td className="px-4 py-3 text-cyan-400 font-semibold">{user.sessions}</td>
                    <td className="px-4 py-3 text-slate-300">{formatDuration(user.totalDuration)}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {new Date(user.lastActive).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-3 text-slate-300">{user.featureCount} features</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
