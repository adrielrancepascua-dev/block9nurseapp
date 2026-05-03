import { useState, useEffect, lazy, Suspense } from 'react'
import { Sidebar } from './components/Sidebar'
const Overview = lazy(async () => {
  const m = await import('./pages/Overview')
  return { default: m.Overview }
})
const Analytics = lazy(async () => {
  const m = await import('./pages/Analytics')
  return { default: m.Analytics }
})
const Users = lazy(async () => {
  const m = await import('./pages/Users')
  return { default: m.Users }
})
const Export = lazy(async () => {
  const m = await import('./pages/Export')
  return { default: m.Export }
})
import { isSupabaseConfigured } from './lib/supabase'
import { getAdminToken, setAdminToken, clearAdminToken } from './lib/supabase'
import { useMobile } from './lib/hooks'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin'

export default function App() {
  const [currentPage, setCurrentPage] = useState('overview')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const isMobile = useMobile()

  useEffect(() => {
    const token = getAdminToken()
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      const token = 'admin_' + Date.now()
      setAdminToken(token)
      setIsAuthenticated(true)
      setPassword('')
      setError('')
    } else {
      setError('Invalid password')
      setPassword('')
    }
  }

  const handleLogout = () => {
    clearAdminToken()
    setIsAuthenticated(false)
    setPassword('')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-slate-800 border border-slate-700 rounded-lg p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-cyan-400">NursePath</h1>
            <p className="text-slate-400 text-sm mt-1">Faculty Dashboard</p>
          </div>

          <div className="bg-slate-900 rounded p-4 border border-slate-700">
            <p className="text-xs text-slate-400 mb-2">Admin Login</p>
            <p className="text-sm text-slate-300">
              Enter the admin password to access the dashboard.
            </p>
          </div>

          {!isSupabaseConfigured && (
            <div className="bg-amber-900/30 border border-amber-700 rounded p-3 text-amber-200 text-xs">
              Supabase env not detected. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local,
              then restart dev server.
            </div>
          )}

          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Admin password"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="button"
              onClick={handleLogin}
              className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
            >
              Login
            </button>
          </div>

          <p className="text-xs text-slate-500 text-center">
            Use the faculty password from your pilot handout. Set <code className="bg-slate-900 px-1 rounded">VITE_ADMIN_PASSWORD</code> for production builds.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Sidebar - hide on mobile in a drawer if needed */}
      {!isMobile && (
        <Sidebar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onLogout={handleLogout}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto flex flex-col">
        {/* Mobile Header */}
        {isMobile && (
          <div className="bg-slate-900 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
            <h1 className="text-lg font-bold text-cyan-400">NursePath Dashboard</h1>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Sign out
            </button>
          </div>
        )}

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className={`p-6 md:p-8 max-w-7xl mx-auto ${isMobile ? 'pb-24' : ''}`}>
            {/* Page Header */}
            <div className="mb-8">
              {!isSupabaseConfigured && (
                <div className="mb-4 bg-amber-900/30 border border-amber-700 rounded p-3 text-amber-200 text-xs">
                  Supabase env not configured. Data panels will show fetch errors until .env.local is set.
                </div>
              )}
              <h1 className="text-3xl font-bold text-white">
                {currentPage === 'overview' && '📊 Overview'}
                {currentPage === 'analytics' && '📈 Usage Analytics'}
                {currentPage === 'users' && '👥 Users'}
                {currentPage === 'export' && '⬇️ Export Data'}
              </h1>
              <p className="text-slate-400 text-sm mt-2">
                {currentPage === 'overview' && 'Key metrics and usage trends'}
                {currentPage === 'analytics' && 'Detailed event logs and feature analysis'}
                {currentPage === 'users' && 'User activity and engagement'}
                {currentPage === 'export' && 'Download usage data for external analysis'}
              </p>
            </div>

            {/* Page Router — lazy-loaded so charts load only when opened */}
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-24 text-slate-400 text-sm" role="status">
                  Loading…
                </div>
              }
            >
              {currentPage === 'overview' && <Overview />}
              {currentPage === 'analytics' && <Analytics />}
              {currentPage === 'users' && <Users />}
              {currentPage === 'export' && <Export />}
            </Suspense>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Bottom Drawer */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 px-4 py-3 flex justify-around">
          {[
            { id: 'overview', icon: '📊' },
            { id: 'analytics', icon: '📈' },
            { id: 'users', icon: '👥' },
            { id: 'export', icon: '⬇️' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded transition-colors ${
                currentPage === item.id
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-xs">{item.id}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
