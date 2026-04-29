import { useEffect, useState } from 'react'
import { supabase, UsageEvent } from '../lib/supabase'

export function Export() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastExport, setLastExport] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('np_last_export')
    if (saved) {
      setLastExport(new Date(saved).toLocaleString())
    }
  }, [])

  async function exportToCSV() {
    try {
      setLoading(true)
      setError(null)

      // Fetch all events
      const { data, error: fetchError } = await supabase
        .from('usage_events')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100000)

      if (fetchError) throw fetchError

      const events = (data || []) as UsageEvent[]

      // Convert to CSV
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
        e.user_email || 'ghost',
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

      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)

      link.setAttribute('href', url)
      link.setAttribute('download', `nursepath_usage_events_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setLastExport(new Date().toLocaleString())
      localStorage.setItem('np_last_export', new Date().toISOString())
    } catch (err) {
      console.error('Export failed:', err)
      setError(err instanceof Error ? err.message : 'Export failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Export Card */}
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
              <li>✓ User email or "ghost" for anonymous sessions</li>
              <li>✓ Session IDs for grouping related events</li>
              <li>✓ Feature usage, actions, and metadata</li>
              <li>✓ Timestamps and duration metrics</li>
              <li>✓ Online/offline status</li>
            </ul>
          </div>

          <button
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

      {/* Info Section */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
        <h3 className="text-lg font-semibold text-white mb-4">Data Processing Notes</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li>
            <strong>Duplicates:</strong> Dashboard filters obvious duplicates for cleaner views, but raw export
            includes all rows for audit trail.
          </li>
          <li>
            <strong>Ghost Users:</strong> Sessions without email (anonymous/offline-first) show as "ghost" in user
            email column.
          </li>
          <li>
            <strong>Meta Field:</strong> Complex metadata is stored as JSON strings; parse as needed in your
            analysis tool.
          </li>
          <li>
            <strong>Duration:</strong> Measured in milliseconds; convert to seconds/minutes as needed (divide by 1000
            or 60000).
          </li>
          <li>
            <strong>Recommended Queries:</strong> Use SQL/Sheets to filter by feature, aggregate sessions,
            calculate engagement metrics.
          </li>
        </ul>
      </div>
    </div>
  )
}
