import { NAV_ITEMS } from '../lib/hooks'

interface SidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
  onLogout: () => void
  userLabel?: string
}

export function Sidebar({ currentPage, onNavigate, onLogout, userLabel }: SidebarProps) {
  return (
    <div className="w-64 bg-slate-900 border-r border-slate-700 flex flex-col h-screen sticky top-0">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold text-cyan-400">NursePath</h1>
        <p className="text-xs text-slate-400 mt-1">Faculty Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
              currentPage === item.id
                ? 'bg-cyan-600 text-white'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700 space-y-2">
        <button
          onClick={onLogout}
          className="w-full px-4 py-2 text-sm rounded-lg bg-red-900 text-red-100 hover:bg-red-800 transition-colors"
        >
          Logout
        </button>
        <p className="text-xs text-slate-500 text-center">{userLabel ? `Signed in as ${userLabel}` : 'Admin Dashboard v1.0'}</p>
      </div>
    </div>
  )
}
