export type LocalSession = {
  id: string
  flowId: string
  title: string
  outputJson: string
  createdAt: string
}

const SESSIONS_KEY = 'rc_local_sessions'
const PREF_KEY = 'rc_save_history'
const MAX_SESSIONS = 10

export function getLocalSessions(): LocalSession[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(sessionStorage.getItem(SESSIONS_KEY) ?? '[]')
  } catch { return [] }
}

export function saveLocalSession(s: LocalSession): void {
  if (typeof window === 'undefined') return
  const existing = getLocalSessions().filter(x => x.id !== s.id)
  sessionStorage.setItem(SESSIONS_KEY, JSON.stringify([s, ...existing].slice(0, MAX_SESSIONS)))
}

export function deleteLocalSession(id: string): void {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(SESSIONS_KEY, JSON.stringify(getLocalSessions().filter(s => s.id !== id)))
}

export function clearLocalSessions(): void {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(SESSIONS_KEY)
}

export function getSaveHistoryPref(): boolean {
  if (typeof window === 'undefined') return true
  return localStorage.getItem(PREF_KEY) !== 'false'
}

export function setSaveHistoryPref(val: boolean): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(PREF_KEY, val ? 'true' : 'false')
}

export function makeSessionTitle(answers: Record<string, unknown>, fallback: string): string {
  for (const v of Object.values(answers)) {
    if (typeof v === 'string' && v.trim().length > 5) {
      const trimmed = v.trim()
      return trimmed.length > 50 ? trimmed.slice(0, 50) + '…' : trimmed
    }
  }
  return fallback
}
