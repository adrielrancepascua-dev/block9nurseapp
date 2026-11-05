import { supabase, isSupabaseConfigured, UsageEvent } from './supabase'

/** Ignore pre-pilot-wave telemetry (May/June legacy inflated sessions). Override via VITE_PILOT_METRICS_SINCE. */
export const PILOT_METRICS_SINCE =
  import.meta.env.VITE_PILOT_METRICS_SINCE || '2026-06-26T00:00:00.000Z'

const USAGE_CACHE_KEY = 'np_dashboard_usage_events_cache_v3'
const DASHBOARD_CACHE_KEYS = [
  USAGE_CACHE_KEY,
  'np_last_export',
  'np_dashboard_usage_events_cache_v1',
  'np_dashboard_usage_events_cache_v2',
] as const

/**
 * PostgREST caps each response (this project uses max_rows = 1000).
 * A single `.limit(10000)` still returns only the newest page, so unique
 * users shrink as new events push older emails out of that page.
 */
const USAGE_PAGE_SIZE = 1000

export function clearDashboardDataCache() {
  for (const key of DASHBOARD_CACHE_KEYS) {
    localStorage.removeItem(key)
  }
}

async function fetchUsagePage(
  from: number,
  to: number,
  since: string | null,
  timeoutMs: number,
): Promise<UsageEvent[]> {
  let request = supabase
    .from('usage_events')
    .select('*')
    .order('timestamp', { ascending: false })
    .order('id', { ascending: false })
    .range(from, to)

  if (since) {
    request = request.gte('timestamp', since)
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

export async function loadUsageEvents(options?: {
  limit?: number
  timeoutMs?: number
  /** Null skips the pilot cutoff. Omit to use PILOT_METRICS_SINCE. */
  since?: string | null
}): Promise<UsageEvent[]> {
  const limit = options?.limit ?? 10000
  const timeoutMs = options?.timeoutMs ?? 20000
  const since = options && 'since' in options ? (options.since ?? null) : PILOT_METRICS_SINCE
  const started = Date.now()
  const rows: UsageEvent[] = []
  let from = 0

  while (rows.length < limit) {
    const remainingMs = timeoutMs - (Date.now() - started)
    if (remainingMs <= 0) {
      throw new Error('Request timeout while fetching usage events.')
    }

    const size = Math.min(USAGE_PAGE_SIZE, limit - rows.length)
    const page = await fetchUsagePage(from, from + size - 1, since, remainingMs)
    rows.push(...page)

    if (page.length < size) {
      break
    }

    from += page.length
  }

  return rows
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
