import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from environment or window
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || (window as any).SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || (window as any).SUPABASE_ANON_KEY
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

if (!isSupabaseConfigured) {
  console.error('Missing Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
}

// Use a safe placeholder to keep UI rendering even if env is missing.
export const supabase = createClient(
  (supabaseUrl as string) || 'https://placeholder.supabase.co',
  (supabaseAnonKey as string) || 'placeholder-anon-key'
)

export interface UsageEvent {
  id: string
  event_id: string
  user_email: string | null
  session_id: string
  feature: string
  action: string
  meta: unknown
  timestamp: string
  online: boolean
  duration_ms: number | null
}

export interface Session {
  session_id: string
  user_email: string | null
  feature: string
  action: string
  duration_ms: number | null
  timestamp: string
  event_count: number
}

/** Parse JSON meta field safely */
export function parseMeta(meta: unknown): Record<string, any> {
  if (!meta) return {}

  if (typeof meta === 'string') {
    try {
      const parsed = JSON.parse(meta)
      return parsed && typeof parsed === 'object' ? parsed as Record<string, any> : {}
    } catch {
      return {}
    }
  }

  if (typeof meta === 'object') {
    return meta as Record<string, any>
  }

  return {}
}

/** Format timestamp for display */
export function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

/** Format duration in human-readable format */
export function formatDuration(ms: number | null): string {
  if (!ms || ms < 0) return '—'
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (hours > 0) return `${hours}h ${minutes % 60}m`
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`
  return `${seconds}s`
}

export function getAdminToken(): string | null {
  return localStorage.getItem('np_admin_token')
}

export function setAdminToken(token: string) {
  localStorage.setItem('np_admin_token', token)
}

export function clearAdminToken() {
  localStorage.removeItem('np_admin_token')
}
