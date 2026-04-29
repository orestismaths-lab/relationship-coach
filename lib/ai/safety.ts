import type { SafetyCheckResult } from '@/types'

const CRISIS_KEYWORDS = [
  'kill myself', 'end my life', 'suicide', 'suicidal',
  'want to die', 'hurt myself', 'self harm', 'self-harm',
  'cutting myself', 'overdose', 'don\'t want to live',
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
    if (lower.includes(kw)) {
      return { safe: false, reason: 'crisis' }
    }
  }

  for (const kw of MANIPULATION_KEYWORDS) {
    if (lower.includes(kw)) {
      return { safe: false, reason: 'manipulation' }
    }
  }

  for (const kw of ABUSE_KEYWORDS) {
    if (lower.includes(kw)) {
      return { safe: false, reason: 'abuse' }
    }
  }

  return { safe: true }
}

export const SAFETY_MESSAGES: Record<string, string> = {
  crisis:
    "It sounds like you may be going through something very serious. This tool isn't designed for crisis support — please reach out to a crisis line. In the US: **988 Suicide & Crisis Lifeline** (call or text 988). In the UK: **Samaritans** (116 123). You deserve real support right now.",
  manipulation:
    "This tool is designed to help you understand yourself and communicate clearly — not to influence or control another person. I can't help with that.",
  abuse:
    "This tool is designed for honest self-reflection and communication, not for harming others. I can't help with that.",
  default:
    "I wasn't able to process that safely. If you're going through a crisis, please contact a crisis line.",
}
