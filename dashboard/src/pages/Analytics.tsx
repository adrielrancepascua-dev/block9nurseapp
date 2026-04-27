import { useCallback, useEffect, useState } from 'react'
import { UsageEvent, formatTime, formatDuration, parseMeta } from '../lib/supabase'
import { fetchUsageEventsResilient } from '../lib/usageData'

interface FilterState {
  dateFrom: string
  dateTo: string
  feature: string
  userSearch: string
}

export function Analytics() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<'live' | 'cache'>('live')
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [events, setEvents] = useState<UsageEvent[]>([])
  const [filtered, setFiltered] = useState<UsageEvent[]>([])
  const [topFeatures, setTopFeatures] = useState<{ name: string; count: number }[]>([])
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterState>({
    dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dateTo: new Date().toISOString().split('T')[0],
    feature: '',
    userSearch: '',
  })

  const fetchEvents = useCallback(async (silent = false) => {
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

      const allEvents = result.events as UsageEvent[]
      setDataSource(result.source)
      setStatusMessage(result.warning)

      // Remove obvious duplicates: same event_id within 100ms
      const deduped: UsageEvent[] = []
      const seen = new Set<string>()

      allEvents.forEach((e) => {
        const key = `${e.event_id}_${e.timestamp}`
        if (!seen.has(key)) {
          deduped.push(e)
          seen.add(key)
        }
      })

      setEvents(deduped)

      // Calculate top features
      const featureMap = new Map<string, number>()
      deduped.forEach((e) => {
        if (e.feature && e.feature !== 'session' && e.feature !== 'auth') {
          const key = `${e.feature}:${e.action || 'use'}`
          featureMap.set(key, (featureMap.get(key) || 0) + 1)
        }
      })
      setTopFeatures(
        Array.from(featureMap.entries())
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
      )
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (err) {
      console.error('Failed to fetch events:', err)
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
    fetchEvents()
  }, [fetchEvents])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      fetchEvents(true)
    }, 15000)

    const onFocus = () => fetchEvents(true)
    window.addEventListener('focus', onFocus)

    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener('focus', onFocus)
    }
  }, [fetchEvents])

  // Apply filters
  useEffect(() => {
    let result = events

    // Date filter
    if (filters.dateFrom) {
      result = result.filter((e) => e.timestamp >= filters.dateFrom)
    }
    if (filters.dateTo) {
      result = result.filter((e) => e.timestamp <= filters.dateTo + 'T23:59:59')
    }

    // Feature filter
    if (filters.feature) {
      result = result.filter((e) => e.feature === filters.feature)
    }

    // User search
    if (filters.userSearch) {
      result = result.filter((e) =>
        (e.user_email || 'ghost').toLowerCase().includes(filters.userSearch.toLowerCase())
      )
    }

    setFiltered(result.slice(0, 100)) // Show top 100 for performance
  }, [events, filters])

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-400">Loading analytics...</p>
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
          onClick={() => fetchEvents(true)}
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

      {/* Top Features Summary */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Top 5 Most Used Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {topFeatures.map((feat, i) => (
            <div key={i} className="bg-slate-700 rounded p-3 text-center">
              <p className="text-xs text-slate-400 truncate">{feat.name}</p>
              <p className="text-2xl font-bold text-cyan-400">{feat.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-sm font-semibold text-white mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-2">From Date</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-2">To Date</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-2">Feature</label>
            <select
              value={filters.feature}
              onChange={(e) => handleFilterChange('feature', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
            >
              <option value="">All Features</option>
              {Array.from(new Set(events.map((e) => e.feature)))
                .filter((f) => f && f !== 'session' && f !== 'auth')
                .map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-2">User Email</label>
            <input
              type="text"
              placeholder="Search..."
              value={filters.userSearch}
              onChange={(e) => handleFilterChange('userSearch', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm placeholder-slate-500"
            />
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-4">Showing {filtered.length} of {events.length} events</p>
      </div>

      {/* Events Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-900 border-b border-slate-700">
              <tr>
                <th className="px-4 py-3 text-left text-slate-300 font-semibold">Timestamp</th>
                <th className="px-4 py-3 text-left text-slate-300 font-semibold">User</th>
                <th className="px-4 py-3 text-left text-slate-300 font-semibold">Session</th>
                <th className="px-4 py-3 text-left text-slate-300 font-semibold">Feature</th>
                <th className="px-4 py-3 text-left text-slate-300 font-semibold">Action</th>
                <th className="px-4 py-3 text-left text-slate-300 font-semibold">Duration</th>
                <th className="px-4 py-3 text-left text-slate-300 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    No events found with current filters
                  </td>
                </tr>
              ) : (
                filtered.map((event) => (
                  <tr key={event.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-4 py-3 text-slate-300 text-xs">{formatTime(event.timestamp)}</td>
                    <td className="px-4 py-3 text-slate-300 truncate max-w-xs">
                      {event.user_email ? (
                        <span title={event.user_email}>{event.user_email.split('@')[0]}</span>
                      ) : (
                        <span className="text-slate-500">Ghost</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-400 font-mono text-xs truncate max-w-xs">
                      {event.session_id.substring(0, 8)}…
                    </td>
                    <td className="px-4 py-3 text-cyan-400 font-medium">{event.feature}</td>
                    <td className="px-4 py-3 text-slate-300">{event.action}</td>
                    <td className="px-4 py-3 text-slate-300">{formatDuration(event.duration_ms)}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs truncate max-w-xs">
                      {event.meta ? (
                        <code>{Object.keys(parseMeta(event.meta)).join(', ').substring(0, 30)}</code>
                      ) : (
                        <span>—</span>
                      )}
                    </td>
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
