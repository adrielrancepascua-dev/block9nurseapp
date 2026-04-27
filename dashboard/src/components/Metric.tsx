interface MetricProps {
  label: string
  value: string | number
  subtext?: string
  trend?: 'up' | 'down'
  icon?: string
}

export function Metric({ label, value, subtext, trend, icon = '📊' }: MetricProps) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-400 text-sm font-medium mb-2">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {subtext && <p className="text-xs text-slate-500 mt-2">{subtext}</p>}
        </div>
        <span className="text-3xl opacity-50">{icon}</span>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-1 text-sm">
          {trend === 'up' ? (
            <>
              <span className="text-green-400">↑</span>
              <span className="text-green-400">Increasing</span>
            </>
          ) : (
            <>
              <span className="text-red-400">↓</span>
              <span className="text-red-400">Decreasing</span>
            </>
          )}
        </div>
      )}
    </div>
  )
}
