import type { SafetyCheckResult } from '@/types'
import { translations } from '@/lib/i18n/translations'
import type { Lang } from '@/lib/i18n/translations'

const CRISIS_KEYWORDS = [
  'kill myself', 'end my life', 'suicide', 'suicidal',
  'want to die', 'hurt myself', 'hurting myself', 'self harm', 'self-harm',
  'cutting myself', 'overdose', "don't want to live",
  'no reason to live', 'better off dead',
]

const MANIPULATION_KEYWORDS = [
  'how to manipulate', 'how to control', 'make them jealous',
  'stalk', 'track their location', 'monitor their phone',
  'get revenge', 'make them suffer', 'force them to',
]

const ABUSE_KEYWORDS = [
  'hit them', 'hurt them', 'threaten them', 'blackmail',
  'expose them', 'ruin their life',
]

export function safetyCheck(text: string): SafetyCheckResult {
  const lower = text.toLowerCase()

  for (const kw of CRISIS_KEYWORDS) {
    if (lower.includes(kw)) return { safe: false, reason: 'crisis' }
  }
  for (const kw of MANIPULATION_KEYWORDS) {
    if (lower.includes(kw)) return { safe: false, reason: 'manipulation' }
  }
  for (const kw of ABUSE_KEYWORDS) {
    if (lower.includes(kw)) return { safe: false, reason: 'abuse' }
  }

  return { safe: true }
}

export function getSafetyMessage(reason: string | undefined, lang: Lang = 'en'): string {
  const s = translations[lang].safety
  switch (reason) {
    case 'crisis':      return s.crisis
    case 'manipulation': return s.manipulation
    case 'abuse':       return s.abuse
    default:            return s.default
  }
}

export function getConversationSafetyMessage(lang: Lang = 'en'): string {
  return translations[lang].safety.conversationSafety
}
