import type { FlowAIOutput, UnderstandOutput, PrepareOutput, DecideOutput } from '@/types'
import type { PromptKey } from './prompts'

type ValidationResult =
  | { valid: true; data: FlowAIOutput }
  | { valid: false; error: string }

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === 'string')
}

function requireString(obj: Record<string, unknown>, key: string): string | null {
  return typeof obj[key] === 'string' ? null : `"${key}" must be a string`
}

function requireStringArray(obj: Record<string, unknown>, key: string): string | null {
  return isStringArray(obj[key]) ? null : `"${key}" must be an array of strings`
}

function firstError(...checks: (string | null)[]): string | null {
  return checks.find((c) => c !== null) ?? null
}

// ─── Schema validators ────────────────────────────────────────────────────────

function validateUnderstand(obj: Record<string, unknown>): ValidationResult {
  const err = firstError(
    requireString(obj, 'situationSummary'),
    requireString(obj, 'possibleOtherPerspective'),
    requireString(obj, 'healthierReframe'),
    requireString(obj, 'suggestedNextStep'),
    requireStringArray(obj, 'patternsToNotice'),
    requireStringArray(obj, 'redFlagsOrSafetyConcerns'),
    requireStringArray(obj, 'whatIsUnclear'),
    requireStringArray(obj, 'actionPlan'),
  )
  if (err) return { valid: false, error: err }

  const fvi = obj.factsVsInterpretations as Record<string, unknown>
  if (typeof fvi !== 'object' || fvi === null)
    return { valid: false, error: '"factsVsInterpretations" must be an object' }
  const fviErr = firstError(
    requireStringArray(fvi, 'facts'),
    requireStringArray(fvi, 'interpretations'),
  )
  if (fviErr) return { valid: false, error: `factsVsInterpretations.${fviErr}` }

  const fan = obj.feelingsAndNeeds as Record<string, unknown>
  if (typeof fan !== 'object' || fan === null)
    return { valid: false, error: '"feelingsAndNeeds" must be an object' }
  const fanErr = firstError(
    requireStringArray(fan, 'feelings'),
    requireStringArray(fan, 'needs'),
  )
  if (fanErr) return { valid: false, error: `feelingsAndNeeds.${fanErr}` }

  return { valid: true, data: obj as unknown as UnderstandOutput }
}

function validatePrepare(obj: Record<string, unknown>): ValidationResult {
  const err = firstError(
    requireString(obj, 'conversationGoal'),
    requireString(obj, 'recommendedMessage'),
    requireString(obj, 'softerVersion'),
    requireString(obj, 'directVersion'),
    requireString(obj, 'boundaryFocusedVersion'),
    requireString(obj, 'followUpSuggestion'),
    requireStringArray(obj, 'whatToAvoid'),
    requireStringArray(obj, 'ifTheyReactBadly'),
  )
  if (err) return { valid: false, error: err }
  return { valid: true, data: obj as unknown as PrepareOutput }
}

function validateDecide(obj: Record<string, unknown>): ValidationResult {
  const err = firstError(
    requireString(obj, 'situationSummary'),
    requireString(obj, 'safetyNote'),
    requireString(obj, 'recommendedLowRiskNextStep'),
    requireStringArray(obj, 'whatSeemsHealthy'),
    requireStringArray(obj, 'whatSeemsConcerning'),
    requireStringArray(obj, 'boundariesToConsider'),
    requireStringArray(obj, 'availableOptions'),
    requireStringArray(obj, 'questionsBeforeDeciding'),
    requireStringArray(obj, 'actionPlan'),
  )
  if (err) return { valid: false, error: err }

  if (!Array.isArray(obj.tradeOffs))
    return { valid: false, error: '"tradeOffs" must be an array' }

  for (const [i, t] of (obj.tradeOffs as unknown[]).entries()) {
    if (typeof t !== 'object' || t === null)
      return { valid: false, error: `tradeOffs[${i}] must be an object` }
    const to = t as Record<string, unknown>
    const toErr = firstError(
      requireString(to, 'option'),
      requireStringArray(to, 'benefits'),
      requireStringArray(to, 'risks'),
    )
    if (toErr) return { valid: false, error: `tradeOffs[${i}].${toErr}` }
  }

  return { valid: true, data: obj as unknown as DecideOutput }
}

// ─── Public entry point ───────────────────────────────────────────────────────

export function validateAIOutput(key: PromptKey, raw: unknown): ValidationResult {
  if (typeof raw !== 'object' || raw === null)
    return { valid: false, error: 'AI response is not a JSON object' }

  const obj = raw as Record<string, unknown>

  switch (key) {
    case 'understand_summary': return validateUnderstand(obj)
    case 'prepare_summary':    return validatePrepare(obj)
    case 'decide_summary':     return validateDecide(obj)
    default:                   return { valid: false, error: `Unknown prompt key: ${key}` }
  }
}
