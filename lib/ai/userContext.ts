type PastSession = {
  flowId: string
  answers: string
  aiOutputs: string
  completedAt: Date | null
  createdAt: Date
  title: string | null
}

function truncate(val: unknown, max = 100): string {
  const s = Array.isArray(val) ? val.join(', ') : String(val ?? '')
  return s.length > max ? s.slice(0, max) + '…' : s
}

function findSummaryOutput(aiOutputs: Record<string, unknown>): Record<string, unknown> | null {
  const key = Object.keys(aiOutputs).find((k) => k.includes('summary'))
  if (!key) return null
  const v = aiOutputs[key]
  return v && typeof v === 'object' ? (v as Record<string, unknown>) : null
}

function parseJSON(s: string): Record<string, unknown> {
  try { return JSON.parse(s) } catch { return {} }
}

export function buildUserHistoryContext(sessions: PastSession[]): string {
  if (!sessions.length) return ''

  const entries: string[] = []

  for (const s of sessions) {
    const answers = parseJSON(s.answers)
    const aiOutputs = parseJSON(s.aiOutputs)
    const out = findSummaryOutput(aiOutputs)

    const date = new Date(s.completedAt ?? s.createdAt).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    })

    const parts: string[] = [`[${s.flowId} · ${date}]`]

    if (s.flowId === 'understand') {
      if (answers.who_involved)  parts.push(`Relationship: ${answers.who_involved}`)
      if (answers.what_happened) parts.push(`Situation: ${truncate(answers.what_happened)}`)
      if (answers.feelings)      parts.push(`Feelings: ${truncate(answers.feelings)}`)
      if (out?.patternsToNotice && Array.isArray(out.patternsToNotice) && out.patternsToNotice.length) {
        parts.push(`Patterns: ${(out.patternsToNotice as string[]).slice(0, 2).join('; ')}`)
      }
      if (out?.suggestedNextStep) parts.push(`Next step: ${truncate(out.suggestedNextStep, 80)}`)
    }

    if (s.flowId === 'prepare') {
      if (answers.conversation_with) parts.push(`Relationship: ${answers.conversation_with}`)
      if (answers.situation)         parts.push(`Situation: ${truncate(answers.situation)}`)
      if (out?.conversationGoal)     parts.push(`Goal: ${truncate(out.conversationGoal, 80)}`)
    }

    if (s.flowId === 'decide') {
      if (answers.relationship) parts.push(`Relationship: ${truncate(answers.relationship, 60)}`)
      if (answers.questioning)  parts.push(`Questioning: ${truncate(answers.questioning)}`)
      if (out?.whatSeemsConcerning && Array.isArray(out.whatSeemsConcerning) && out.whatSeemsConcerning.length) {
        parts.push(`Concerns: ${(out.whatSeemsConcerning as string[]).slice(0, 2).join('; ')}`)
      }
      if (out?.recommendedLowRiskNextStep) parts.push(`Next step: ${truncate(out.recommendedLowRiskNextStep, 80)}`)
    }

    entries.push(parts.join(' | '))
  }

  return [
    '--- User context: previous reflections (use for personalization) ---',
    ...entries,
    'Reference recurring patterns, relationships, or themes where genuinely relevant.',
    'Do not repeat past advice verbatim. Do not mention this context section explicitly to the user.',
  ].join('\n')
}
