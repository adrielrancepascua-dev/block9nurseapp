import { useCallback, useEffect, useState } from 'react'
import { UsageEvent, formatDuration } from '../lib/supabase'
import { formatNumber, getFeatureLabel } from '../lib/utils'
import { fetchUsageEventsResilient, subscribeToUsageEventChanges } from '../lib/usageData'
import { Metric } from '../components/Metric'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface ChartData {
  date: string
  count: number
}

interface FeatureData {
  name: string
  value: number
}

export function Overview() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<'live' | 'cache'>('live')
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [metrics, setMetrics] = useState({
    uniqueUsers: 0,
    totalSessions: 0,
    totalFeatureUses: 0,
    avgSessionDuration: 0,
  })
  const [dailyData, setDailyData] = useState<ChartData[]>([])
  const [topFeatures, setTopFeatures] = useState<FeatureData[]>([])
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async (silent = false) => {
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

      // Calculate metrics
      const uniqueEmails = new Set(
        events
          .map((e) => e.user_email || `session_${e.session_id}`)
          .filter((e) => e !== 'session_null')
      )
      const uniqueSessions = new Set(events.map((e) => e.session_id))
      const featureEvents = events.filter((e) => e.feature && e.feature !== 'session' && e.feature !== 'auth' && e.feature !== 'consent')
      const avgDuration = featureEvents.length > 0
        ? featureEvents.reduce((sum, e) => sum + (e.duration_ms || 0), 0) / featureEvents.length
        : 0

      setMetrics({
        uniqueUsers: uniqueEmails.size,
        totalSessions: uniqueSessions.size,
        totalFeatureUses: featureEvents.length,
        avgSessionDuration: avgDuration,
      })

      // Build daily chart data (last 30 days)
      const dailyMap = new Map<string, number>()
      events.forEach((e) => {
        const date = new Date(e.timestamp).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
        dailyMap.set(date, (dailyMap.get(date) || 0) + 1)
      })
      const dailyArray = Array.from(dailyMap.entries())
        .map(([date, count]) => ({ date, count }))
        .reverse()
        .slice(-30)
      setDailyData(dailyArray)

      // Top features analysis
      const featureMap = new Map<string, number>()
      events.forEach((e) => {
        if (e.feature && e.feature !== 'session' && e.feature !== 'auth' && e.feature !== 'consent') {
          const key = getFeatureLabel(e.feature)
          featureMap.set(key, (featureMap.get(key) || 0) + 1)
        }
      })
      const topFeaturesArray = Array.from(featureMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8)
      setTopFeatures(topFeaturesArray)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (err) {
      console.error('Failed to fetch overview data:', err)
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
    fetchData()
  }, [fetchData])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      fetchData(true)
    }, 15000)

    const onFocus = () => fetchData(true)
    window.addEventListener('focus', onFocus)
    const unsubscribe = subscribeToUsageEventChanges(() => fetchData(true))

    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener('focus', onFocus)
      unsubscribe()
    }
  }, [fetchData])

  const COLORS = ['#06b6d4', '#0891b2', '#0e7490', '#155e75', '#164e63']

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-400">Loading overview...</p>
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
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-slate-800 border border-slate-700 rounded-lg p-3">
        <p className="text-xs text-slate-400">
          Last updated: {lastUpdated || 'just now'} • source: {dataSource} {refreshing ? '• refreshing...' : ''}
        </p>
        <button
          type="button"
          onClick={() => fetchData(true)}
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

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Metric
          label="Unique Users"
          value={formatNumber(metrics.uniqueUsers)}
          icon="👤"
        />
        <Metric
          label="Total Sessions"
          value={formatNumber(metrics.totalSessions)}
          icon="📌"
        />
        <Metric
          label="Feature Uses"
          value={formatNumber(metrics.totalFeatureUses)}
          icon="🎯"
        />
        <Metric
          label="Avg Session Duration"
          value={formatDuration(Math.round(metrics.avgSessionDuration))}
          icon="⏱️"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Usage Trend */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Daily Usage Trend (Last 30 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={false}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Features Pie */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Top Features</h2>
          <ResponsiveContainer width="100%" height={340}>
            <PieChart>
              <Pie
                data={topFeatures}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={96}
                paddingAngle={2}
                fill="#06b6d4"
                dataKey="value"
              >
                {topFeatures.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Legend
                verticalAlign="bottom"
                height={44}
                iconType="circle"
                formatter={(value) => <span className="text-slate-300 text-xs">{String(value)}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feature Usage Bar Chart */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Feature Usage Breakdown</h2>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={topFeatures} margin={{ top: 10, right: 10, left: 0, bottom: 28 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} interval={0} angle={-18} textAnchor="end" height={52} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              labelStyle={{ color: '#f1f5f9' }}
            />
            <Bar dataKey="value" fill="#06b6d4" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
