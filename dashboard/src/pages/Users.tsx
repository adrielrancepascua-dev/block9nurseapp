import { useCallback, useEffect, useState } from 'react'
import { UsageEvent, formatDuration } from '../lib/supabase'
import { formatNumber, sortBy } from '../lib/utils'
import { fetchUsageEventsResilient } from '../lib/usageData'

interface UserRow {
  identifier: string
  sessions: number
  totalDuration: number
  lastActive: string
  featureCount: number
}

export function Users() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<'live' | 'cache'>('live')
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [users, setUsers] = useState<UserRow[]>([])
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

      // Group by user (email or session fallback)
      const userMap = new Map<string, UsageEvent[]>()

      events.forEach((e) => {
        const identifier = e.user_email || `session_${e.session_id}`
        if (!userMap.has(identifier)) {
          userMap.set(identifier, [])
        }
        userMap.get(identifier)!.push(e)
      })

      // Build user rows
      const userRows: UserRow[] = []

      userMap.forEach((events, identifier) => {
        const sessions = new Set(events.map((e) => e.session_id)).size
        const totalDuration = events.reduce((sum, e) => sum + (e.duration_ms || 0), 0)
        const lastActive = events[0]?.timestamp || ''
        const featureCount = new Set(
          events.filter((e) => e.feature && e.feature !== 'session' && e.feature !== 'auth').map((e) => e.feature)
        ).size

        userRows.push({
          identifier,
          sessions,
          totalDuration,
          lastActive,
          featureCount,
        })
      })

      // Sort by last active
      setUsers(sortBy(userRows, 'lastActive', true))
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

    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener('focus', onFocus)
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
                <th className="px-4 py-3 text-left text-slate-300 font-semibold">User</th>
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
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.identifier} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-4 py-3 text-slate-300 truncate max-w-xs">
                      {user.identifier.startsWith('session_') ? (
                        <span className="text-slate-500">Ghost: {user.identifier.substring(8, 16)}…</span>
                      ) : (
                        <span title={user.identifier}>{user.identifier}</span>
                      )}
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
