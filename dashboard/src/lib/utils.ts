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
