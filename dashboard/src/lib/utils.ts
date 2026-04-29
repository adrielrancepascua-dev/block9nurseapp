/** Format number with commas */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US')
}

/** Truncate text with ellipsis */
export function truncate(text: string, length: number = 30): string {
  return text.length > length ? text.substring(0, length) + '…' : text
}

/** Get initials from email */
export function getInitials(email: string | null): string {
  if (!email || email === 'ghost') return 'GU'
  const parts = email.split('@')[0].split('.')
  return parts.map(p => p[0]).join('').toUpperCase().slice(0, 2)
}

/** Group array by key function */
export function groupBy<T>(arr: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const key = keyFn(item)
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {} as Record<string, T[]>)
}

/** Sort by object property */
export function sortBy<T>(arr: T[], key: keyof T, desc = false): T[] {
  return [...arr].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    if (aVal < bVal) return desc ? 1 : -1
    if (aVal > bVal) return desc ? -1 : 1
    return 0
  })
}

const FEATURE_LABELS: Record<string, string> = {
  auth: 'Authentication',
  session: 'Session',
  otc_ref: 'OTC Reference',
  vitals: 'Vitals',
  dosage_calc: 'Dosage Calculator',
  medication_lookup: 'Medication Lookup',
  simulation: 'Simulation',
  notes: 'Notes',
  export: 'Export',
}

const ACTION_LABELS: Record<string, string> = {
  feature_op: 'Opened',
  feature_open: 'Opened',
  feature_use: 'Used',
  result_generated: 'Result Generated',
  copy_reference: 'Copied Reference',
  copy_result: 'Copied Result',
  navigation: 'Navigation',
  app_init: 'App Start',
  session_start: 'Session Start',
  session_end: 'Session End',
}

function titleCase(value: string): string {
  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
}

export function getFeatureLabel(feature: string | null | undefined): string {
  const raw = String(feature || '').trim()
  if (!raw) return 'Unknown Feature'
  return FEATURE_LABELS[raw] || titleCase(raw)
}

export function getFeatureActionLabel(feature: string | null | undefined, action: string | null | undefined): string {
  const featureLabel = getFeatureLabel(feature)
  const rawAction = String(action || '').trim()
  if (!rawAction) return featureLabel
  return `${featureLabel} • ${ACTION_LABELS[rawAction] || titleCase(rawAction)}`
}
