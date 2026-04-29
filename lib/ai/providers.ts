import { SYSTEM_PROMPT } from './prompts'

export type AIProvider = 'anthropic' | 'openai'

interface CallOptions {
  provider: AIProvider
  userPrompt: string
  maxTokens: number
}

// ─── Anthropic ────────────────────────────────────────────────────────────────

async function callAnthropic(userPrompt: string, maxTokens: number): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set')

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Anthropic API error ${res.status}: ${body}`)
  }

  const data = await res.json()
  const text: string = data.content?.[0]?.text ?? ''
  if (!text) throw new Error('Anthropic returned an empty response')
  return text
}

// ─── OpenAI ───────────────────────────────────────────────────────────────────

async function callOpenAI(userPrompt: string, maxTokens: number): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set')

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: maxTokens,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`OpenAI API error ${res.status}: ${body}`)
  }

  const data = await res.json()
  const text: string = data.choices?.[0]?.message?.content ?? ''
  if (!text) throw new Error('OpenAI returned an empty response')
  return text
}

// ─── Public entry point ───────────────────────────────────────────────────────

export async function callProvider({ provider, userPrompt, maxTokens }: CallOptions): Promise<string> {
  switch (provider) {
    case 'anthropic': return callAnthropic(userPrompt, maxTokens)
    case 'openai':    return callOpenAI(userPrompt, maxTokens)
    default:          throw new Error(`Unknown AI_PROVIDER: "${provider}". Supported: anthropic, openai`)
  }
}
