import type { SessionAnswers } from '@/types'

// ─── Types ────────────────────────────────────────────────────────────────────

export type SafetyClass = 'SAFE' | 'SENSITIVE' | 'HIGH_RISK' | 'BLOCKED'

export type ClassificationResult = {
  classification: SafetyClass
  /** Human-readable reason — for logging only, never sent to the frontend as-is */
  reason: string
  /** Matched signals that contributed to this classification */
  signals: string[]
}

// ─── Fallback responses ───────────────────────────────────────────────────────

export const HIGH_RISK_RESPONSE =
  "I'm sorry you're dealing with something that may involve safety risk. This is not something to handle only through an AI tool. If you may be in immediate danger, contact local emergency services now. If possible, reach out to someone you trust and avoid escalating the situation directly. Your safety matters more than resolving the conversation right now."

export const BLOCKED_RESPONSE =
  "I can't help with manipulation, surveillance, threats, or pressure. I can help you write an honest message, set a respectful boundary, or reflect on what you need without trying to control the other person."

// ─── Signal rule definitions ──────────────────────────────────────────────────
//
// Each rule has:
//   keywords  — substring matches (case-insensitive)
//   class     — the classification this signal contributes
//   signal    — short label used in logs / signals array
//
// Classification precedence: BLOCKED > HIGH_RISK > SENSITIVE > SAFE
// The highest-severity matching rule wins.

interface Rule {
  keywords: string[]
  class: SafetyClass
  signal: string
}

const RULES: Rule[] = [
  // ── BLOCKED: user is trying to harm, control, or surveil another person ──────
  {
    signal: 'manipulation_tactics',
    class: 'BLOCKED',
    keywords: [
      'how to manipulate', 'make them jealous', 'make her jealous', 'make him jealous',
      'use jealousy', 'jealousy tactic',
      'how to control', 'control their behaviour', 'control their behavior',
      'gaslight', 'gaslighting',
      'guilt trip', 'guilt-trip', 'make them feel guilty',
      'emotional blackmail',
      'silent treatment to punish', 'punish them by ignoring',
    ],
  },
  {
    signal: 'surveillance',
    class: 'BLOCKED',
    keywords: [
      'track their location', 'track his location', 'track her location',
      'track their phone', 'monitor their phone', 'spy on their phone',
      'read their messages', 'hack their account', 'access their account without',
      'install tracking', 'hidden camera', 'keylogger',
      'stalk', 'stalking', 'follow them without', 'show up unannounced to',
    ],
  },
  {
    signal: 'threats_coercion',
    class: 'BLOCKED',
    keywords: [
      'threaten them', 'threaten to expose', 'blackmail', 'blackmail them',
      'expose their secrets', 'send their photos', 'leak their photos',
      'force them to', 'make them do it', 'coerce',
      'i will ruin', 'ruin their reputation', 'destroy their life',
      'get revenge', 'revenge on', 'make them suffer',
      'report them falsely', 'false accusation to',
    ],
  },
  {
    signal: 'physical_harm_intent',
    class: 'BLOCKED',
    keywords: [
      'hit them', 'hit her', 'hit him',
      'hurt them', 'hurt her', 'hurt him',
      'punch them', 'attack them',
      'want to harm',
    ],
  },
  {
    signal: 'sexual_coercion',
    class: 'BLOCKED',
    keywords: [
      'force them to have sex', 'force sex', 'pressure them into sex',
      'sexual coercion', 'make them sleep with', 'convince them to have sex',
      'non-consensual',
    ],
  },
  {
    signal: 'illegal_activity',
    class: 'BLOCKED',
    keywords: [
      'without their consent', 'illegal to access', 'break into their',
      'trespass', 'violate restraining order', 'ignore restraining order',
    ],
  },

  // ── HIGH_RISK: user may be in danger or describing abuse ─────────────────────
  {
    signal: 'self_harm_suicidal',
    class: 'HIGH_RISK',
    keywords: [
      'kill myself', 'end my life', 'take my life', 'want to die',
      'suicidal', 'suicide', 'thinking about suicide',
      'hurt myself', 'hurting myself', 'self harm', 'self-harm', 'cutting myself',
      'overdose on', 'don\'t want to live', 'no reason to live',
      'better off dead', 'wish i was dead', 'rather be dead',
    ],
  },
  {
    signal: 'immediate_danger',
    class: 'HIGH_RISK',
    keywords: [
      'in immediate danger', 'unsafe right now', 'i am scared for my life',
      'fear for my life', 'fear for my safety',
      'he might hurt me', 'she might hurt me', 'they might hurt me',
      'afraid they will hurt', 'afraid he will hurt', 'afraid she will hurt',
      'going to hurt me', 'threatened to hurt me', 'threatened my life',
      'threatening to kill', 'said they would kill',
    ],
  },
  {
    signal: 'domestic_violence',
    class: 'HIGH_RISK',
    keywords: [
      'hit me', 'hits me', 'punched me', 'kicked me', 'choked me', 'strangled me',
      'threw something at me', 'physically hurt me', 'physically hurts me',
      'domestic violence', 'domestic abuse',
      'he beats', 'she beats', 'they beat me',
      'bruises from', 'injuries from my partner',
    ],
  },
  {
    signal: 'coercive_control',
    class: 'HIGH_RISK',
    keywords: [
      'controls where i go', 'control where i go',
      'controls what i wear', 'control what i wear',
      'controls who i see', 'control who i see',
      'tracks my location', 'tracks my phone', 'reads my messages without',
      'not allowed to leave', 'not allowed to see friends', 'not allowed to work',
      'controls my money', 'control my money',
      'took my documents', 'took my passport',
      'isolated from', 'cut off from family', 'cut off from friends',
      'monitors everything i do', 'monitor everything i do',
    ],
  },
  {
    signal: 'sexual_abuse',
    class: 'HIGH_RISK',
    keywords: [
      'forced me to have sex', 'forced sex on', 'sexually assaulted', 'sexual assault',
      'raped', 'rape',
      'forced into sexual', 'made me do sexual',
    ],
  },
  {
    signal: 'fear_of_partner',
    class: 'HIGH_RISK',
    keywords: [
      'afraid of my partner', 'scared of my partner', 'terrified of my partner',
      'partner scares me', 'partner frightens me',
      'walk on eggshells', 'feel trapped', 'can\'t leave safely',
      'afraid to leave', 'scared to leave', 'trapped in this relationship',
    ],
  },
  {
    signal: 'child_safety',
    class: 'HIGH_RISK',
    keywords: [
      'hurting my child', 'hurting our child', 'hurting the children',
      'hitting my child', 'abusing my child', 'afraid for my children',
      'scared for my kids',
    ],
  },

  // ── SENSITIVE: emotionally intense, potentially escalating ────────────────────
  {
    signal: 'anger_intense',
    class: 'SENSITIVE',
    keywords: [
      'hate them', 'hate him', 'hate her', 'i hate my partner',
      'despise', 'can\'t stand them anymore',
      'furious', 'enraged', 'rage at',
    ],
  },
  {
    signal: 'hopelessness',
    class: 'SENSITIVE',
    keywords: [
      'no point anymore', 'nothing will change', 'pointless to try',
      'given up', 'i give up on this relationship',
      'can\'t do this anymore', 'don\'t see a future',
    ],
  },
  {
    signal: 'harassment_received',
    class: 'SENSITIVE',
    keywords: [
      'they won\'t leave me alone', 'keeps showing up', 'won\'t stop contacting',
      'harassing me', 'harassment', 'stalking me', 'being stalked',
    ],
  },
  {
    signal: 'infidelity',
    class: 'SENSITIVE',
    keywords: [
      'cheated on me', 'cheating on me', 'having an affair', 'found out they cheated',
      'betrayal', 'infidelity',
    ],
  },
  {
    signal: 'substance_abuse',
    class: 'SENSITIVE',
    keywords: [
      'drinking problem', 'alcohol problem', 'drug problem', 'addicted to',
      'substance abuse', 'when they\'re drunk', 'when they drink',
    ],
  },
]

// ─── Classifier ───────────────────────────────────────────────────────────────

const CLASS_PRIORITY: Record<SafetyClass, number> = {
  BLOCKED: 4,
  HIGH_RISK: 3,
  SENSITIVE: 2,
  SAFE: 1,
}

/**
 * Classify the full set of answers for a session before AI generation.
 * Concatenates all string values and runs them through the rule set.
 * The highest-severity matching rule wins.
 */
export function classifyAnswers(answers: SessionAnswers): ClassificationResult {
  // Flatten all answer text into one lowercase string for matching
  const corpus = Object.values(answers)
    .flatMap((v) => (Array.isArray(v) ? v : [String(v)]))
    .join(' ')
    .toLowerCase()

  let best: SafetyClass = 'SAFE'
  const signals: string[] = []

  for (const rule of RULES) {
    const matched = rule.keywords.some((kw) => corpus.includes(kw))
    if (!matched) continue

    signals.push(rule.signal)
    if (CLASS_PRIORITY[rule.class] > CLASS_PRIORITY[best]) {
      best = rule.class
    }
  }

  const reason =
    best === 'SAFE'
      ? 'No concerning signals detected'
      : `Classified as ${best} — signals: ${signals.join(', ')}`

  return { classification: best, reason, signals }
}
