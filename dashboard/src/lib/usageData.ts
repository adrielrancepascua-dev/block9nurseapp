import { supabase, isSupabaseConfigured, UsageEvent } from './supabase'

type UsageSource = 'live' | 'cache'

export interface UsageFetchResult {
  events: UsageEvent[]
  source: UsageSource
  cachedAt: string | null
  warning: string | null
}

/** Ignore pre-pilot-wave telemetry (May/June legacy inflated sessions). Override via VITE_PILOT_METRICS_SINCE. */
export const PILOT_METRICS_SINCE =
  import.meta.env.VITE_PILOT_METRICS_SINCE || '2026-06-26T00:00:00.000Z'

const USAGE_CACHE_KEY = 'np_dashboard_usage_events_cache_v2'
const DASHBOARD_CACHE_KEYS = [USAGE_CACHE_KEY, 'np_last_export', 'np_dashboard_usage_events_cache_v1'] as const

export function clearDashboardDataCache() {
  for (const key of DASHBOARD_CACHE_KEYS) {
    localStorage.removeItem(key)
  }
}

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function dedupeEvents(events: UsageEvent[]): UsageEvent[] {
  const seen = new Set<string>()
  const deduped: UsageEvent[] = []

  for (const event of events) {
    const key = event.event_id ? `id:${event.event_id}` : `ts:${event.timestamp}:${event.session_id}:${event.feature}:${event.action}`
    if (seen.has(key)) {
      continue
    }
    seen.add(key)
    deduped.push(event)
  }

  return deduped
}

export function filterPilotEvents(events: UsageEvent[]): UsageEvent[] {
  if (!PILOT_METRICS_SINCE) {
    return events
  }
  return events.filter((event) => event.timestamp >= PILOT_METRICS_SINCE)
}

function readCachedEvents(): { events: UsageEvent[]; cachedAt: string | null } {
  try {
    const raw = localStorage.getItem(USAGE_CACHE_KEY)
    if (!raw) {
      return { events: [], cachedAt: null }
    }

    const parsed = JSON.parse(raw) as { events?: UsageEvent[]; cachedAt?: string }
    return {
      events: filterPilotEvents(Array.isArray(parsed.events) ? parsed.events : []),
      cachedAt: parsed.cachedAt || null,
    }
  } catch {
    return { events: [], cachedAt: null }
  }
}

function writeCachedEvents(events: UsageEvent[]) {
  try {
    localStorage.setItem(
      USAGE_CACHE_KEY,
      JSON.stringify({
        events,
        cachedAt: new Date().toISOString(),
      })
    )
  } catch {
    // Intentionally ignore cache write errors.
  }
}

async function queryUsageEvents(limit: number, timeoutMs: number): Promise<UsageEvent[]> {
  let request = supabase
    .from('usage_events')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(limit)

  if (PILOT_METRICS_SINCE) {
    request = request.gte('timestamp', PILOT_METRICS_SINCE)
  }

  const timeoutPromise = new Promise<never>((_, reject) => {
    window.setTimeout(() => reject(new Error('Request timeout while fetching usage events.')), timeoutMs)
  })

  const response = await Promise.race([request, timeoutPromise])
  const { data, error } = response as { data: UsageEvent[] | null; error: Error | null }

  if (error) {
    throw error
  }

  return Array.isArray(data) ? data : []
}

export async function fetchUsageEventsResilient(options?: {
  limit?: number
  retries?: number
  timeoutMs?: number
  skipCache?: boolean
}): Promise<UsageFetchResult> {
  const limit = options?.limit ?? 10000
  const retries = options?.retries ?? 2
  const timeoutMs = options?.timeoutMs ?? 8000
  const skipCache = options?.skipCache ?? false

  const cached = skipCache ? { events: [], cachedAt: null } : readCachedEvents()
  const pilotWarning = PILOT_METRICS_SINCE
    ? `Showing pilot data from ${new Date(PILOT_METRICS_SINCE).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} onward.`
    : null

  if (!isSupabaseConfigured) {
    return {
      events: cached.events,
      source: 'cache',
      cachedAt: cached.cachedAt,
      warning: 'Supabase env not configured. Showing cached data.',
    }
  }

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const fresh = await queryUsageEvents(limit, timeoutMs)
      const deduped = dedupeEvents(fresh)
      writeCachedEvents(deduped)

      return {
        events: deduped,
        source: 'live',
        cachedAt: new Date().toISOString(),
        warning: pilotWarning,
      }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error('Unknown Supabase fetch error')

      if (attempt < retries) {
        const backoffMs = 600 * Math.pow(2, attempt)
        await delay(backoffMs)
      }
    }
  }

  if (cached.events.length > 0 && !skipCache) {
    return {
      events: cached.events,
      source: 'cache',
      cachedAt: cached.cachedAt,
      warning: pilotWarning
        ? `${pilotWarning} Supabase temporarily unavailable — showing cached data.`
        : 'Supabase temporarily unavailable. Showing cached data.',
    }
  }

  throw lastError || new Error('Failed to fetch usage data and no cache is available.')
}

export function subscribeToUsageEventChanges(onChange: () => void) {
  if (!isSupabaseConfigured) {
    return () => undefined
  }

  const channel = supabase
    .channel('dashboard-usage-events')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'usage_events',
      },
      () => {
        onChange()
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
