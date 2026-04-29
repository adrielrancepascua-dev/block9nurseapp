const PILOT_ACCESS_STORAGE_KEY = 'np_dashboard_pilot_access_v1'
const DEFAULT_PILOT_DOMAIN = 'cdd.edu.ph'
const DEFAULT_PILOT_INVITE_CODES = ['NP-PILOT-2026']

export interface PilotAccessRecord {
  email: string
  accessCode: string
  grantedAt: string
}

function readListFromEnv(value: string | undefined, fallback: string[]): string[] {
  if (!value) {
    return fallback
  }

  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
}

export function getPilotAllowlistDomains(): string[] {
  return readListFromEnv(import.meta.env.VITE_PILOT_ALLOWLIST_DOMAINS, [DEFAULT_PILOT_DOMAIN])
}

export function getPilotInviteCodes(): string[] {
  return readListFromEnv(import.meta.env.VITE_PILOT_INVITE_CODES, DEFAULT_PILOT_INVITE_CODES)
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function isAllowedPilotEmail(email: string): boolean {
  const normalized = normalizeEmail(email)
  if (!normalized || !normalized.includes('@')) {
    return false
  }

  const domain = normalized.split('@').pop() || ''
  return getPilotAllowlistDomains().includes(domain)
}

export function hasValidPilotInvite(accessCode: string): boolean {
  const normalized = accessCode.trim().toUpperCase()
  return normalized.length > 0 && getPilotInviteCodes().includes(normalized)
}

export function resolvePilotIdentityEmail(email: string, accessCode: string): string {
  const normalizedEmail = normalizeEmail(email)

  if (normalizedEmail && isAllowedPilotEmail(normalizedEmail)) {
    return normalizedEmail
  }

  if (hasValidPilotInvite(accessCode)) {
    const code = accessCode.trim().toUpperCase().replace(/[^A-Z0-9]+/g, '-')
    return `pilot+${code}@nursepath.local`
  }

  return normalizedEmail
}

export function isPilotAccessAllowed(email: string, accessCode: string): boolean {
  return isAllowedPilotEmail(email) || hasValidPilotInvite(accessCode)
}

export function loadPilotAccess(): PilotAccessRecord | null {
  try {
    const raw = localStorage.getItem(PILOT_ACCESS_STORAGE_KEY)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw) as PilotAccessRecord
    if (!parsed.email || !parsed.grantedAt) {
      return null
    }

    return parsed
  } catch {
    return null
  }
}

export function savePilotAccess(record: PilotAccessRecord) {
  localStorage.setItem(PILOT_ACCESS_STORAGE_KEY, JSON.stringify(record))
}

export function clearPilotAccess() {
  localStorage.removeItem(PILOT_ACCESS_STORAGE_KEY)
}
