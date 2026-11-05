import { useCallback, useEffect, useState } from 'react'
import { UsageEvent, formatTime, formatDuration, parseMeta } from '../lib/supabase'
import { getFeatureActionLabel, getFeatureLabel, clampSessionDurationMs } from '../lib/utils'
import { fetchAnalytics } from '../lib/dashboardStats'
import { useAutoRefresh } from '../lib/hooks'

interface FilterState {
  dateFrom: string
  dateTo: string
  feature: string
  userSearch: string
}

function daysAgo(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function Analytics() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<'live' | 'cache'>('live')
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [events, setEvents] = useState<UsageEvent[]>([])
  const [total, setTotal] = useState(0)
  const [features, setFeatures] = useState<{ feature: string; uses: number }[]>([])
  const [error, setError] = useState<string | null>(null)
  const [hasData, setHasData] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    dateFrom: daysAgo(30),
    dateTo: daysAgo(0),
    feature: '',
    userSearch: '',
  })
  const [appliedFilters, setAppliedFilters] = useState(filters)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setAppliedFilters(filters), 300)
    return () => window.clearTimeout(timeoutId)
  }, [filters])

  const fetchEvents = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true)
      } else {
        setRefreshing(true)
      }
      setError(null)

      const result = await fetchAnalytics(appliedFilters)
      setDataSource('live')
      setStatusMessage(null)
      setEvents(result.events)
      setTotal(result.total)
      setFeatures(result.features)
      setHasData(true)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (err) {
      console.error('Failed to fetch events:', err)
      setError(err instanceof Error ? err.message : 'Failed to load data')
      setStatusMessage('Unable to refresh now.')
    } finally {
      if (!silent) {
        setLoading(false)
      }
      setRefreshing(false)
    }
  }, [appliedFilters])

  useAutoRefresh(fetchEvents)

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  if (loading && !hasData) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-400">Loading analytics...</p>
      </div>
    )
  }

  if (error && !hasData) {
    return (
      <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-200">
        Error: {error}
      </div>
    )
  }

  const topFeatures = features.slice(0, 5)

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

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Top 5 Most Used Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {topFeatures.map((feat) => (
            <div key={feat.feature} className="bg-slate-700 rounded p-3 text-center">
              <p className="text-xs text-slate-400 truncate">{getFeatureLabel(feat.feature)}</p>
              <p className="text-2xl font-bold text-cyan-400">{feat.uses}</p>
            </div>
          ))}
        </div>
      </div>

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
              {features.map((feature) => (
                <option key={feature.feature} value={feature.feature}>
                  {getFeatureLabel(feature.feature)}
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
        <p className="text-xs text-slate-400 mt-4">Showing {events.length} of {total} events</p>
      </div>

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
              {events.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    No events found with current filters
                  </td>
                </tr>
              ) : (
                events.map((event) => (
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
                      {event.session_id ? `${event.session_id.substring(0, 8)}…` : '—'}
                    </td>
                    <td className="px-4 py-3 text-cyan-400 font-medium">{getFeatureLabel(event.feature)}</td>
                    <td className="px-4 py-3 text-slate-300">{getFeatureActionLabel(event.feature, event.action)}</td>
                    <td className="px-4 py-3 text-slate-300">
                      {formatDuration(
                        event.feature === 'session' && event.action === 'session_end'
                          ? clampSessionDurationMs(event.duration_ms)
                          : event.duration_ms
                      )}
                    </td>
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
