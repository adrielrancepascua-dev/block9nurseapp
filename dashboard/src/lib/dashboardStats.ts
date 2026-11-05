import { isSupabaseConfigured, supabase, UsageEvent } from './supabase'
import { PILOT_METRICS_SINCE } from './usageData'

export function browserTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
}

export interface OverviewStats {
  uniqueUsers: number
  totalSessions: number
  featureUses: number
  avgSessionMs: number
  daily: { date: string; count: number }[]
  topFeatures: { feature: string; value: number }[]
}

export interface DashboardUserRow {
  email: string
  sessions: number
  totalDuration: number
  lastActive: string
  featureCount: number
}

interface OverviewPayload {
  unique_users: number
  total_sessions: number
  feature_uses: number
  avg_session_ms: number
  daily: { date: string; count: number }[]
  top_features: { feature: string; value: number }[]
}

interface UsersPayload {
  legacy_events: number
  users: {
    email: string
    sessions: number
    total_duration: number
    last_active: string
    feature_count: number
  }[]
}

function assertConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase env not configured.')
  }
}

export async function fetchOverviewStats(): Promise<OverviewStats> {
  assertConfigured()
  const { data, error } = await supabase.rpc('dashboard_overview', {
    since: PILOT_METRICS_SINCE,
    tz: browserTimeZone(),
  })
  if (error) throw error
  const payload = data as OverviewPayload
  return {
    uniqueUsers: payload.unique_users ?? 0,
    totalSessions: payload.total_sessions ?? 0,
    featureUses: payload.feature_uses ?? 0,
    avgSessionMs: Number(payload.avg_session_ms) || 0,
    daily: Array.isArray(payload.daily) ? payload.daily : [],
    topFeatures: Array.isArray(payload.top_features) ? payload.top_features : [],
  }
}

export async function fetchDashboardUsers(): Promise<{ users: DashboardUserRow[]; legacyEvents: number }> {
  assertConfigured()
  const { data, error } = await supabase.rpc('dashboard_users', {
    since: PILOT_METRICS_SINCE,
  })
  if (error) throw error
  const payload = data as UsersPayload
  const users = Array.isArray(payload.users) ? payload.users : []
  return {
    legacyEvents: payload.legacy_events ?? 0,
    users: users.map((user) => ({
      email: user.email,
      sessions: user.sessions ?? 0,
      totalDuration: Number(user.total_duration) || 0,
      lastActive: user.last_active,
      featureCount: user.feature_count ?? 0,
    })),
  }
}

export interface AnalyticsQuery {
  dateFrom: string
  dateTo: string
  feature: string
  userSearch: string
}

export function startOfLocalDay(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00`).toISOString()
}

export function endOfLocalDay(isoDate: string): string {
  return new Date(`${isoDate}T23:59:59.999`).toISOString()
}

export async function fetchAnalytics(query: AnalyticsQuery): Promise<{
  events: UsageEvent[]
  total: number
  features: { feature: string; uses: number }[]
}> {
  assertConfigured()
  const since = startOfLocalDay(query.dateFrom)
  const until = endOfLocalDay(query.dateTo)
  const search = query.userSearch.trim()

  let eventsQuery = supabase
    .from('usage_events_deduped')
    .select('id,event_id,user_email,session_id,feature,action,meta,timestamp,online,duration_ms', { count: 'exact' })
    .gte('timestamp', since)
    .lte('timestamp', until)
    .order('timestamp', { ascending: false })
    .order('id', { ascending: false })
    .limit(100)

  if (query.feature) {
    eventsQuery = eventsQuery.eq('feature', query.feature)
  }
  if (search.toLowerCase() === 'ghost') {
    eventsQuery = eventsQuery.is('user_email', null)
  } else if (search) {
    eventsQuery = eventsQuery.ilike('user_email', `%${search}%`)
  }

  const [eventsResult, featuresResult] = await Promise.all([
    eventsQuery,
    supabase.rpc('dashboard_feature_counts', { since, until_ts: until }),
  ])

  if (eventsResult.error) throw eventsResult.error
  if (featuresResult.error) throw featuresResult.error

  return {
    events: (eventsResult.data || []) as UsageEvent[],
    total: eventsResult.count ?? 0,
    features: (featuresResult.data || []) as { feature: string; uses: number }[],
  }
}
