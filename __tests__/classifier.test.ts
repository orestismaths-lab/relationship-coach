/**
 * Safety classifier test suite
 * Run: npx tsx __tests__/classifier.test.ts
 */

import { classifyAnswers } from '../lib/ai/classifier'

// ─── Minimal test harness ─────────────────────────────────────────────────────

let passed = 0
let failed = 0

function test(name: string, fn: () => void) {
  try {
    fn()
    console.log(`  ✓  ${name}`)
    passed++
  } catch (err) {
    console.error(`  ✗  ${name}`)
    console.error(`     ${err instanceof Error ? err.message : err}`)
    failed++
  }
}

function expect(actual: unknown) {
  return {
    toBe(expected: unknown) {
      if (actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)
      }
    },
    toContain(expected: unknown) {
      if (!Array.isArray(actual) || !actual.includes(expected)) {
        throw new Error(`Expected array to contain ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)
      }
    },
  }
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function classify(answers: Record<string, string | string[]>) {
  return classifyAnswers(answers)
}

// ─── SAFE cases ───────────────────────────────────────────────────────────────

console.log('\nSAFE cases')

test('normal disagreement', () => {
  const r = classify({
    what_happened: 'We argued about household chores and I felt unheard.',
    feelings: ['Hurt', 'Frustrated'],
    fear_meaning: 'That they do not appreciate me.',
    healthy_outcome: 'A calm conversation where we both feel heard.',
  })
  expect(r.classification).toBe('SAFE')
})

test('preparing a difficult conversation', () => {
  const r = classify({
    situation: 'I want to talk about how we divide responsibilities at home.',
    want_them_to_understand: 'I feel overwhelmed doing everything alone.',
    tone: 'Calm and open',
  })
  expect(r.classification).toBe('SAFE')
})

test('deciding whether to stay or leave — abstract', () => {
  const r = classify({
    questioning: 'I am not sure if we are compatible long-term.',
    good_valuable: 'We share the same values and enjoy similar things.',
    painful_confusing: 'We do not communicate well under pressure.',
  })
  expect(r.classification).toBe('SAFE')
})

// ─── SENSITIVE cases ──────────────────────────────────────────────────────────

console.log('\nSENSITIVE cases')

test('infidelity discovery', () => {
  const r = classify({
    what_happened: 'I found out they cheated on me last month.',
    feelings: ['Betrayed', 'Angry', 'Sad'],
  })
  expect(r.classification).toBe('SENSITIVE')
  expect(r.signals).toContain('infidelity')
})

test('intense anger', () => {
  const r = classify({
    what_happened: 'I hate them for what they did. I despise how they treat me.',
  })
  expect(r.classification).toBe('SENSITIVE')
  expect(r.signals).toContain('anger_intense')
})

test('hopelessness about relationship', () => {
  const r = classify({
    questioning: 'There is no point anymore. Nothing will change. I give up on this relationship.',
  })
  expect(r.classification).toBe('SENSITIVE')
  expect(r.signals).toContain('hopelessness')
})

test('being harassed by ex', () => {
  const r = classify({
    situation: 'My ex won\'t leave me alone — they keep showing up and won\'t stop contacting me.',
  })
  expect(r.classification).toBe('SENSITIVE')
  expect(r.signals).toContain('harassment_received')
})

test('partner has drinking problem', () => {
  const r = classify({
    painful_confusing: 'They have a drinking problem and it affects how they treat me.',
  })
  expect(r.classification).toBe('SENSITIVE')
  expect(r.signals).toContain('substance_abuse')
})

// ─── HIGH_RISK cases ──────────────────────────────────────────────────────────

console.log('\nHIGH_RISK cases')

test('suicidal ideation', () => {
  const r = classify({
    fear_meaning: 'I have been thinking about suicide. I do not want to live like this.',
  })
  expect(r.classification).toBe('HIGH_RISK')
  expect(r.signals).toContain('self_harm_suicidal')
})

test('self-harm mention', () => {
  const r = classify({ what_happened: 'I have been hurting myself because of the stress.' })
  expect(r.classification).toBe('HIGH_RISK')
  expect(r.signals).toContain('self_harm_suicidal')
})

test('physical domestic violence', () => {
  const r = classify({ what_happened: 'He hit me last night and I have bruises from the incident.' })
  expect(r.classification).toBe('HIGH_RISK')
  expect(r.signals).toContain('domestic_violence')
})

test('fear of partner', () => {
  const r = classify({ fear_meaning: 'I am afraid of my partner and feel trapped in this relationship.' })
  expect(r.classification).toBe('HIGH_RISK')
  expect(r.signals).toContain('fear_of_partner')
})

test('coercive control', () => {
  const r = classify({
    painful_confusing: 'They control where I go and who I see. They monitor everything I do.',
  })
  expect(r.classification).toBe('HIGH_RISK')
  expect(r.signals).toContain('coercive_control')
})

test('immediate danger', () => {
  const r = classify({
    safety_concerns: 'Yes. They threatened to hurt me and I am scared for my life.',
  })
  expect(r.classification).toBe('HIGH_RISK')
  expect(r.signals).toContain('immediate_danger')
})

test('sexual assault disclosure', () => {
  const r = classify({ what_happened: 'They sexually assaulted me.' })
  expect(r.classification).toBe('HIGH_RISK')
  expect(r.signals).toContain('sexual_abuse')
})

test('child safety concern', () => {
  const r = classify({
    painful_confusing: 'I am scared for my kids — they have been hurting my child.',
  })
  expect(r.classification).toBe('HIGH_RISK')
  expect(r.signals).toContain('child_safety')
})

// ─── BLOCKED cases ────────────────────────────────────────────────────────────

console.log('\nBLOCKED cases')

test('explicit manipulation request', () => {
  const r = classify({ what_happened: 'I want to know how to manipulate them into staying.' })
  expect(r.classification).toBe('BLOCKED')
  expect(r.signals).toContain('manipulation_tactics')
})

test('jealousy tactics', () => {
  const r = classify({ need_ask_for: 'I want to make them jealous so they realise what they are missing.' })
  expect(r.classification).toBe('BLOCKED')
  expect(r.signals).toContain('manipulation_tactics')
})

test('phone surveillance', () => {
  const r = classify({ situation: 'I want to track their phone without them knowing.' })
  expect(r.classification).toBe('BLOCKED')
  expect(r.signals).toContain('surveillance')
})

test('stalking intent', () => {
  const r = classify({ need_ask_for: 'I want to stalk them to find out who they are seeing.' })
  expect(r.classification).toBe('BLOCKED')
  expect(r.signals).toContain('surveillance')
})

test('blackmail', () => {
  const r = classify({ what_happened: 'I want to blackmail them with photos to make them come back.' })
  expect(r.classification).toBe('BLOCKED')
  expect(r.signals).toContain('threats_coercion')
})

test('physical harm intent', () => {
  const r = classify({ what_happened: 'I want to hit him for what he did.' })
  expect(r.classification).toBe('BLOCKED')
  expect(r.signals).toContain('physical_harm_intent')
})

test('sexual coercion intent', () => {
  const r = classify({
    need_ask_for: 'I want to pressure them into sex even if they said no.',
  })
  expect(r.classification).toBe('BLOCKED')
  expect(r.signals).toContain('sexual_coercion')
})

// ─── Precedence: BLOCKED beats HIGH_RISK ─────────────────────────────────────

console.log('\nPrecedence cases')

test('BLOCKED wins over HIGH_RISK when both signals present', () => {
  const r = classify({
    what_happened: 'I want to track their phone. I am also suicidal.',
  })
  expect(r.classification).toBe('BLOCKED')
})

test('HIGH_RISK wins over SENSITIVE', () => {
  const r = classify({
    what_happened: 'I hate them and I am scared for my life.',
  })
  expect(r.classification).toBe('HIGH_RISK')
})

// ─── Multi-answer corpus coverage ────────────────────────────────────────────

console.log('\nMulti-answer corpus cases')

test('keyword split across multiple answers', () => {
  const r = classify({
    situation: 'We had a difficult argument.',
    fear_meaning: 'I am afraid they will hurt me.',
    healthy_outcome: 'I want to feel safe.',
  })
  expect(r.classification).toBe('HIGH_RISK')
  expect(r.signals).toContain('immediate_danger')
})

test('emotion array does not trigger false positives', () => {
  const r = classify({
    feelings: ['Hurt', 'Angry', 'Hopeful'],
    what_happened: 'We had a disagreement about money.',
  })
  expect(r.classification).toBe('SAFE')
})

// ─── Summary ──────────────────────────────────────────────────────────────────

console.log(`\n${'─'.repeat(50)}`)
console.log(`Results: ${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)
