import type { FlowAIOutput, SessionAnswers } from '@/types'
import type { PromptKey } from './prompts'
import { buildPrompt } from './prompts'
import { mockGenerate } from './mock'
import { callProvider } from './providers'
import { validateAIOutput } from './validate'
import { classifyAnswers } from './classifier'
import type { AIProvider } from './providers'
import { translations } from '@/lib/i18n/translations'
import type { Lang } from '@/lib/i18n/translations'

// ─── Env config ───────────────────────────────────────────────────────────────

function isMockMode(): boolean {
  return process.env.MOCK_AI === 'true'
}

function getProvider(): AIProvider {
  const p = process.env.AI_PROVIDER ?? 'anthropic'
  if (p !== 'anthropic' && p !== 'openai') {
    throw new Error(`Invalid AI_PROVIDER: "${p}". Supported values: anthropic, openai`)
  }
  return p
}

function getMaxTokens(): number {
  const v = parseInt(process.env.MAX_OUTPUT_TOKENS ?? '1200', 10)
  return isNaN(v) || v < 100 ? 1200 : v
}

// ─── JSON extraction ──────────────────────────────────────────────────────────

function extractJSON(text: string): unknown {
  // Strip markdown code fences if present
  const stripped = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  const match = stripped.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('AI response contained no JSON object')
  try {
    return JSON.parse(match[0])
  } catch {
    throw new Error('AI response contained malformed JSON')
  }
}

// ─── Blocked generation result ────────────────────────────────────────────────

export type BlockedResult = {
  blocked: true
  classification: 'HIGH_RISK' | 'BLOCKED'
  message: string
}

export type GenerationResult =
  | { blocked: false; data: FlowAIOutput }
  | BlockedResult

// ─── Public entry point ───────────────────────────────────────────────────────

export async function generateAI(
  key: PromptKey,
  answers: SessionAnswers,
  lang: Lang = 'en'
): Promise<GenerationResult> {
  const s = translations[lang].safety
  // Safety classification — runs before any generation, including mock
  const classification = classifyAnswers(answers)
  if (classification.classification === 'HIGH_RISK') {
    return { blocked: true, classification: 'HIGH_RISK', message: s.highRisk }
  }
  if (classification.classification === 'BLOCKED') {
    return { blocked: true, classification: 'BLOCKED', message: s.blocked }
  }
  // SENSITIVE: proceed with generation — classification is logged via the result object
  // (caller can inspect classification.signals if needed for future monitoring)

  if (isMockMode()) {
    return { blocked: false, data: await mockGenerate(key) }
  }

  const provider = getProvider()
  const maxTokens = getMaxTokens()
  const userPrompt = buildPrompt(key, answers)

  let rawText: string
  try {
    rawText = await callProvider({ provider, userPrompt, maxTokens })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    throw new Error(`AI provider call failed: ${msg}`)
  }

  let parsed: unknown
  try {
    parsed = extractJSON(rawText)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    throw new Error(`AI response parsing failed: ${msg}`)
  }

  const result = validateAIOutput(key, parsed)
  if (!result.valid) {
    throw new Error(`AI response did not match expected schema: ${result.error}`)
  }

  return { blocked: false, data: result.data }
}
