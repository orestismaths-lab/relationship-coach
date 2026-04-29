export type FlowId = 'understand' | 'prepare' | 'decide'

export type StepType =
  | 'text_input'
  | 'single_select'
  | 'multi_select'
  | 'emotion_picker'
  | 'summary'

export type FlowStep = {
  id: string
  type: StepType
  question: string
  hint?: string
  placeholder?: string
  options?: string[]
  aiPromptKey?: string
  required: boolean
  triggersAI: boolean
  /** Select answer values that should trigger the safety banner */
  safetyTriggerValues?: string[]
}

export type FlowDefinition = {
  id: FlowId
  title: string
  tagline: string
  estimatedMinutes: number
  steps: FlowStep[]
}

export type SessionStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED'

export type SessionAnswers = Record<string, string | string[] | number>
export type SessionAIOutputs = Record<string, FlowAIOutput>

// ─── Per-flow AI output schemas ───────────────────────────────────────────────

export type UnderstandOutput = {
  situationSummary: string
  factsVsInterpretations: {
    facts: string[]
    interpretations: string[]
  }
  feelingsAndNeeds: {
    feelings: string[]
    needs: string[]
  }
  possibleOtherPerspective: string
  patternsToNotice: string[]
  redFlagsOrSafetyConcerns: string[]
  whatIsUnclear: string[]
  healthierReframe: string
  suggestedNextStep: string
  actionPlan: string[]
}

export type PrepareOutput = {
  conversationGoal: string
  recommendedMessage: string
  softerVersion: string
  directVersion: string
  boundaryFocusedVersion: string
  whatToAvoid: string[]
  ifTheyReactBadly: string[]
  followUpSuggestion: string
}

export type DecideOutput = {
  situationSummary: string
  whatSeemsHealthy: string[]
  whatSeemsConcerning: string[]
  boundariesToConsider: string[]
  availableOptions: string[]
  tradeOffs: {
    option: string
    benefits: string[]
    risks: string[]
  }[]
  questionsBeforeDeciding: string[]
  safetyNote: string
  recommendedLowRiskNextStep: string
  actionPlan: string[]
}

export type FlowAIOutput = UnderstandOutput | PrepareOutput | DecideOutput

// ─── Validation helpers ───────────────────────────────────────────────────────

export function isUnderstandOutput(o: FlowAIOutput): o is UnderstandOutput {
  return 'situationSummary' in o && 'factsVsInterpretations' in o
}

export function isPrepareOutput(o: FlowAIOutput): o is PrepareOutput {
  return 'conversationGoal' in o && 'recommendedMessage' in o
}

export function isDecideOutput(o: FlowAIOutput): o is DecideOutput {
  return 'availableOptions' in o && 'tradeOffs' in o
}

export type SafetyCheckResult = {
  safe: boolean
  reason?: string
}

export const EMOTIONS = [
  'Hurt', 'Angry', 'Sad', 'Confused', 'Scared',
  'Disappointed', 'Lonely', 'Frustrated', 'Numb', 'Betrayed',
  'Relieved', 'Hopeful', 'Guilty', 'Ashamed', 'Anxious',
]

export const RELATIONSHIP_TYPES = [
  'Romantic partner', 'Ex-partner', 'Friend', 'Family member',
  'Colleague', 'Manager / boss', 'Parent', 'Sibling', 'Other',
]
