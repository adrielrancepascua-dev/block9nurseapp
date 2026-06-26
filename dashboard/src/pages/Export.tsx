import { useEffect, useState } from 'react'
import { supabase, UsageEvent } from '../lib/supabase'
import { clearDashboardDataCache } from '../lib/usageData'

const RESET_PILOT_SQL = `-- NursePath pilot telemetry reset
truncate table public.usage_events restart identity;
truncate table public.auth_email_log restart identity;`

export function Export() {
  const [loading, setLoading] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resetMessage, setResetMessage] = useState<string | null>(null)
  const [lastExport, setLastExport] = useState<string | null>(null)
  const [eventCount, setEventCount] = useState<number | null>(null)
  const [sqlCopied, setSqlCopied] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('np_last_export')
    if (saved) {
      setLastExport(new Date(saved).toLocaleString())
    }
    void loadEventCount()
  }, [])

  async function loadEventCount() {
    try {
      const { count, error: countError } = await supabase
        .from('usage_events')
        .select('*', { count: 'exact', head: true })

      if (countError) throw countError
      setEventCount(count ?? 0)
    } catch {
      setEventCount(null)
    }
  }

  async function exportToCSV() {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('usage_events')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100000)

      if (fetchError) throw fetchError

      const events = (data || []) as UsageEvent[]

      const headers = [
        'ID',
        'Event ID',
        'User Email',
        'Session ID',
        'Feature',
        'Action',
        'Meta',
        'Timestamp',
        'Online',
        'Duration (ms)',
      ]

      const stringifyMetaForCsv = (value: unknown): string => {
        if (value == null) return ''
        if (typeof value === 'string') return value
        try {
          return JSON.stringify(value)
        } catch {
          return String(value)
        }
      }

      const rows = events.map((e) => [
        e.id,
        e.event_id,
        e.user_email || '',
        e.session_id,
        e.feature,
        e.action,
        stringifyMetaForCsv(e.meta).replace(/"/g, '""'),
        e.timestamp,
        e.online ? 'yes' : 'no',
        e.duration_ms || '',
      ])

      const csvContent = [
        headers.map((h) => `"${h}"`).join(','),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)

      link.setAttribute('href', url)
      link.setAttribute('download', `nursepath_usage_events_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setLastExport(new Date().toLocaleString())
      localStorage.setItem('np_last_export', new Date().toISOString())
    } catch (err) {
      console.error('Export failed:', err)
      setError(err instanceof Error ? err.message : 'Export failed')
    } finally {
      setLoading(false)
    }
  }

  async function copyResetSql() {
    try {
      await navigator.clipboard.writeText(RESET_PILOT_SQL)
      setSqlCopied(true)
      window.setTimeout(() => setSqlCopied(false), 2000)
    } catch {
      setResetMessage('Could not copy automatically. Select the SQL below and copy manually.')
    }
  }

  async function refreshDashboardView() {
    try {
      setResetting(true)
      setResetMessage(null)
      clearDashboardDataCache()
      await loadEventCount()
      setResetMessage('Browser cache cleared. Reloading live Supabase data…')
      window.setTimeout(() => window.location.reload(), 400)
    } finally {
      setResetting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Export Usage Data</h2>
            <p className="text-slate-400 text-sm">
              Download all usage events as CSV for analysis in Excel, Sheets, or BI tools.
            </p>
          </div>

          <div className="bg-slate-900 rounded p-4 border border-slate-700">
            <p className="text-xs text-slate-400 mb-2">CSV will include:</p>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>✓ All usage events (up to 100,000 most recent records)</li>
              <li>✓ User email (`@cdd.edu.ph`) on all current PWA events</li>
              <li>✓ Session IDs for grouping related events</li>
              <li>✓ Feature usage, actions, and metadata</li>
              <li>✓ Timestamps and duration metrics</li>
              <li>✓ Online/offline status</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={exportToCSV}
            disabled={loading}
            className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                Exporting...
              </>
            ) : (
              <>
                <span>⬇️</span>
                Download CSV
              </>
            )}
          </button>

          {error && (
            <div className="bg-red-900/20 border border-red-700 rounded p-4 text-red-200 text-sm">
              {error}
            </div>
          )}

          {lastExport && (
            <div className="bg-green-900/20 border border-green-700 rounded p-4 text-green-200 text-sm">
              Last export: {lastExport}
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-800 border border-amber-700/60 rounded-lg p-8 space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-2">Fresh Pilot Start</h2>
          <p className="text-slate-400 text-sm">
            Wipe old telemetry (inflated times, legacy ghost rows) and reload the dashboard from a clean Supabase
            state. Export a CSV backup first if you need records for your files.
          </p>
        </div>

        <div className="bg-slate-900 rounded p-4 border border-slate-700 text-sm text-slate-300">
          <p>
            Current Supabase rows:{' '}
            <strong className="text-white">{eventCount === null ? '—' : eventCount.toLocaleString('en-US')}</strong>
          </p>
        </div>

        <ol className="list-decimal list-inside space-y-2 text-sm text-slate-300">
          <li>Optional: download CSV backup above.</li>
          <li>
            Open <strong className="text-slate-100">Supabase → SQL Editor</strong> for this project and run:
          </li>
        </ol>

        <pre className="bg-slate-950 border border-slate-700 rounded p-4 text-xs text-cyan-200 overflow-x-auto whitespace-pre-wrap">
          {RESET_PILOT_SQL}
        </pre>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={copyResetSql}
            className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {sqlCopied ? 'SQL copied' : 'Copy reset SQL'}
          </button>
          <button
            type="button"
            onClick={refreshDashboardView}
            disabled={resetting}
            className="flex-1 px-4 py-2.5 bg-amber-700 hover:bg-amber-600 disabled:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {resetting ? 'Refreshing…' : 'Clear cache & reload'}
          </button>
        </div>

        {resetMessage && (
          <div className="bg-green-900/20 border border-green-700 rounded p-4 text-green-200 text-sm">
            {resetMessage}
          </div>
        )}

        <p className="text-xs text-slate-500">
          Full script with verification queries: <code className="text-slate-400">dashboard/supabase/reset-pilot-data.sql</code>
        </p>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
        <h3 className="text-lg font-semibold text-white mb-4">Data Processing Notes</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li>
            <strong>Duplicates:</strong> Dashboard filters obvious duplicates for cleaner views, but raw export
            includes all rows for audit trail.
          </li>
          <li>
            <strong>Session time:</strong> Current PWA builds count foreground use only; legacy rows may still look high
            until you reset pilot data.
          </li>
          <li>
            <strong>Meta Field:</strong> Complex metadata is stored as JSON strings; parse as needed in your
            analysis tool.
          </li>
          <li>
            <strong>Duration:</strong> Measured in milliseconds; convert to seconds/minutes as needed (divide by 1000
            or 60000).
          </li>
        </ul>
      </div>
    </div>
  )
}
