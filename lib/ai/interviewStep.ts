import { callProvider } from './providers'
import type { AIProvider } from './providers'
import type { Lang } from '@/lib/i18n/translations'

function isMockMode(): boolean {
  return process.env.MOCK_AI === 'true'
}

function getProvider(): AIProvider {
  const p = process.env.AI_PROVIDER ?? 'anthropic'
  return p === 'openai' ? 'openai' : 'anthropic'
}

export type InterviewStepResult = {
  acknowledgment: string
  question: string
}

export async function generateInterviewStep(params: {
  flowTitle: string
  answers: Record<string, unknown>
  nextQuestion: string
  nextStepId: string
  lang: Lang
}): Promise<InterviewStepResult> {
  const { flowTitle, answers, nextQuestion, nextStepId, lang } = params

  if (isMockMode()) {
    return {
      acknowledgment: lang === 'el' ? 'Ευχαριστώ που το μοιράστηκες.' : 'Thank you for sharing that.',
      question: nextQuestion,
    }
  }

  const answersText = Object.entries(answers)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? (v as unknown[]).join(', ') : String(v)}`)
    .join('\n')

  const userPrompt = `You are a warm, calm reflection guide helping a user work through "${flowTitle}".

What the user has shared so far:
${answersText}

Next topic to cover: ${nextStepId.replace(/_/g, ' ')}
Base question: "${nextQuestion}"

Your task:
1. Write a 1-sentence acknowledgment of what they just shared — specific and genuine, not generic. Reference something they actually said.
2. Rewrite the base question so it flows naturally from what they've shared. Weave in relevant context. Keep it to 1–2 sentences.

${lang === 'el' ? 'Respond entirely in Greek (Ελληνικά).' : 'Respond in English.'}

Return ONLY valid JSON, no markdown, no explanation:
{"acknowledgment": "...", "question": "..."}`

  try {
    const raw = await callProvider({ provider: getProvider(), userPrompt, maxTokens: 200 })
    const stripped = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
    const match = stripped.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('no JSON')
    const parsed = JSON.parse(match[0])
    if (typeof parsed.acknowledgment !== 'string' || typeof parsed.question !== 'string') {
      throw new Error('invalid shape')
    }
    return { acknowledgment: parsed.acknowledgment, question: parsed.question }
  } catch {
    return { acknowledgment: '', question: nextQuestion }
  }
}
