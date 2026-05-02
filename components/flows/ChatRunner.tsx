'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { SafetyBanner } from '@/components/SafetyBanner'
import { Alert } from '@/components/ui/Alert'
import { useLanguage } from '@/contexts/LanguageContext'
import { getStepT, getStepOptions } from '@/lib/i18n/flowTranslations'
import type { FlowDefinition, FlowStep } from '@/types'

// ─── Message types ────────────────────────────────────────────────────────────

type AIMessage  = { role: 'ai';      content: string; step: FlowStep }
type UserMessage = { role: 'user';    content: string }
type SpinnerMessage = { role: 'spinner' }
type Message = AIMessage | UserMessage | SpinnerMessage

// ─── Input components ─────────────────────────────────────────────────────────

function TextInput({ step, flowId, onSubmit, loading }: {
  step: FlowStep
  flowId: string
  onSubmit: (v: string) => void
  loading: boolean
}) {
  const { lang, t } = useLanguage()
  const stepT = getStepT(flowId, step.id, lang)
  const [value, setValue] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)
  useEffect(() => { ref.current?.focus() }, [])

  const submit = () => {
    const trimmed = value.trim()
    if (!trimmed || loading) return
    onSubmit(trimmed)
    setValue('')
  }

  return (
    <div className="flex flex-col gap-2">
      <textarea
        ref={ref}
        className="w-full rounded-2xl border border-stone-200 bg-white p-4 text-sm text-stone-800 placeholder:text-stone-300 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none shadow-sm transition-colors"
        rows={3}
        placeholder={stepT?.placeholder ?? step.placeholder ?? '…'}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() } }}
        disabled={loading}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-stone-300">{t.chat.sendHint}</span>
        <button
          onClick={submit}
          disabled={!value.trim() || loading}
          className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {t.chat.send}
        </button>
      </div>
    </div>
  )
}

function SuggestionsInput({ step, flowId, onSubmit, loading }: {
  step: FlowStep
  flowId: string
  onSubmit: (v: string) => void
  loading: boolean
}) {
  const { lang, t } = useLanguage()
  const [value, setValue] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)
  useEffect(() => { ref.current?.focus() }, [])

  const options = getStepOptions(flowId, step.id, lang, step.options ?? [])
  const isSafety = (val: string) => step.safetyTriggerValues?.includes(val) ?? false

  const handlePill = (optValue: string, label: string) => {
    if (isSafety(optValue)) {
      // submit the value directly so safetyTriggerValues check on the server fires
      onSubmit(optValue)
      return
    }
    setValue((prev) => prev ? `${prev}, ${label}` : label)
    ref.current?.focus()
  }

  const submit = () => {
    const trimmed = value.trim()
    if (!trimmed || loading) return
    onSubmit(trimmed)
    setValue('')
  }

  return (
    <div className="flex flex-col gap-2">
      <textarea
        ref={ref}
        className="w-full rounded-2xl border border-stone-200 bg-white p-4 text-sm text-stone-800 placeholder:text-stone-300 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none shadow-sm transition-colors"
        rows={2}
        placeholder="…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() } }}
        disabled={loading}
      />
      {options.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {options.map(({ value: optValue, label }) => (
            <button
              key={optValue}
              type="button"
              onClick={() => handlePill(optValue, label)}
              disabled={loading}
              className={`rounded-full border px-3 py-1 text-xs transition-colors cursor-pointer disabled:opacity-40
                ${isSafety(optValue)
                  ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                  : 'border-stone-200 bg-stone-50 text-stone-500 hover:border-stone-300 hover:bg-white hover:text-stone-700'
                }`}
            >
              {isSafety(optValue) && <span className="mr-1">⚠</span>}
              {label}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between">
        {!step.required ? (
          <button onClick={() => onSubmit('')} className="text-xs text-stone-300 hover:text-stone-500 transition-colors">
            {t.chat.skip}
          </button>
        ) : <span className="text-xs text-stone-300">{t.chat.sendHint}</span>}
        <button
          onClick={submit}
          disabled={!value.trim() || loading}
          className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {t.chat.send}
        </button>
      </div>
    </div>
  )
}

// ─── Chat bubbles ─────────────────────────────────────────────────────────────

function AIBubble({ content }: { content: string }) {
  return (
    <div className="flex items-end gap-2 max-w-[85%]">
      <div className="h-7 w-7 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0 mb-0.5">
        <span className="text-xs">✦</span>
      </div>
      <div className="rounded-2xl rounded-bl-sm bg-stone-100 px-4 py-3 text-sm text-stone-800 leading-relaxed">
        {content}
      </div>
    </div>
  )
}

function UserBubble({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-indigo-600 px-4 py-3 text-sm text-white leading-relaxed">
        {content}
      </div>
    </div>
  )
}

function SpinnerBubble() {
  return (
    <div className="flex items-end gap-2">
      <div className="h-7 w-7 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0 mb-0.5">
        <span className="text-xs">✦</span>
      </div>
      <div className="rounded-2xl rounded-bl-sm bg-stone-100 px-4 py-3">
        <span className="flex gap-1 items-center">
          <span className="h-1.5 w-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:0ms]" />
          <span className="h-1.5 w-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:300ms]" />
        </span>
      </div>
    </div>
  )
}

function GeneratingBubble({ label }: { label: string }) {
  return (
    <div className="flex items-end gap-2">
      <div className="h-7 w-7 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0 mb-0.5">
        <span className="text-xs">✦</span>
      </div>
      <div className="rounded-2xl rounded-bl-sm bg-stone-100 px-4 py-3 flex items-center gap-2.5">
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent shrink-0" />
        <span className="text-sm text-stone-500">{label}</span>
      </div>
    </div>
  )
}

function formatAnswer(answer: string | string[]): string {
  if (Array.isArray(answer)) return answer.length ? answer.join(', ') : '—'
  return answer
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  flow: FlowDefinition
  sessionId: string
  initialStep: number
  totalSteps: number
}

export function ChatRunner({ flow, sessionId, initialStep, totalSteps }: Props) {
  const router = useRouter()
  const { lang, t } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStep)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [limitReached, setLimitReached] = useState(false)
  const [safetyMessage, setSafetyMessage] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Push initial question on mount
  useEffect(() => {
    const step = flow.steps[initialStep]
    if (step && step.type !== 'summary') {
      const stepT = getStepT(flow.id, step.id, lang)
      const question = stepT?.question ?? step.question
      setMessages([{ role: 'ai', content: question, step }])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, generating])

  const currentStep = flow.steps[currentStepIndex]

  async function submitAnswer(answer: string | string[]) {
    if (!currentStep || loading || generating) return
    setError(null)

    const displayAnswer = formatAnswer(answer)
    setMessages((m) => [...m, { role: 'user', content: displayAnswer }, { role: 'spinner' }])
    setLoading(true)

    try {
      const res = await fetch(`/api/flows/${sessionId}/step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-lang': lang },
        body: JSON.stringify({ stepId: currentStep.id, answer }),
      })
      const data = await res.json()

      if (!res.ok) {
        setMessages((m) => m.filter((x) => x.role !== 'spinner'))
        if (res.status === 429) { setLimitReached(true); return }
        setError(data.error ?? t.chat.genericError)
        return
      }

      if (data.type === 'safety') {
        setMessages((m) => m.filter((x) => x.role !== 'spinner'))
        setSafetyMessage(data.message)
        return
      }

      if (data.type === 'complete') {
        setMessages((m) => m.filter((x) => x.role !== 'spinner'))
        router.push(`/flows/${flow.id}/complete?session=${sessionId}`)
        return
      }

      if (data.type === 'next') {
        const nextStep = flow.steps[data.currentStep]
        setCurrentStepIndex(data.currentStep)

        if (nextStep?.type === 'summary') {
          setMessages((m) => m.filter((x) => x.role !== 'spinner'))
          setGenerating(true)
          setLoading(false)
          try {
            const genRes = await fetch(`/api/flows/${sessionId}/step`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'x-lang': lang },
              body: JSON.stringify({ stepId: nextStep.id, answer: '' }),
            })
            const genData = await genRes.json()
            setGenerating(false)
            if (genData.type === 'complete') {
              router.push(`/flows/${flow.id}/complete?session=${sessionId}`)
            } else if (genData.type === 'safety') {
              setSafetyMessage(genData.message)
            } else if (!genRes.ok) {
              setError(genData.error ?? t.chat.couldNotGenerate)
            }
          } catch {
            setGenerating(false)
            setError(t.chat.networkError)
          }
          return
        }

        if (nextStep) {
          const stepT = getStepT(flow.id, nextStep.id, lang)
          const question = stepT?.question ?? nextStep.question
          setMessages((m) => [
            ...m.filter((x) => x.role !== 'spinner'),
            { role: 'ai', content: question, step: nextStep },
          ])
          setCurrentStepIndex(data.currentStep)
        }
      }
    } catch {
      setMessages((m) => m.filter((x) => x.role !== 'spinner'))
      setError(t.chat.networkError)
    } finally {
      setLoading(false)
    }
  }

  if (limitReached) return (
    <div className="rounded-2xl border border-stone-200 bg-white px-6 py-8 space-y-3 text-center animate-slide-up">
      <p className="text-2xl">⏳</p>
      <p className="text-sm font-semibold text-stone-800">{t.chat.limitTitle}</p>
      <p className="text-sm text-stone-500 leading-relaxed">{t.chat.limitBody}</p>
    </div>
  )

  if (safetyMessage) return <SafetyBanner message={safetyMessage} />

  const inputStep = loading || generating ? null : currentStep
  const isSummaryStep = currentStep?.type === 'summary'

  return (
    <div className="flex flex-col min-h-[60vh]">
      {/* Progress */}
      <div className="mb-4 flex items-center gap-2">
        <div className="h-1 flex-1 rounded-full bg-stone-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-indigo-400 transition-all duration-500"
            style={{ width: `${Math.round((currentStepIndex / (totalSteps - 1)) * 100)}%` }}
          />
        </div>
        <span className="text-xs text-stone-400 tabular-nums shrink-0">
          {Math.min(currentStepIndex + 1, totalSteps - 1)} / {totalSteps - 1}
        </span>
      </div>

      {/* Message list */}
      <div className="flex flex-col gap-4 flex-1 pb-6">
        {messages.map((msg, i) => {
          if (msg.role === 'ai')      return <AIBubble key={i} content={msg.content} />
          if (msg.role === 'user')    return <UserBubble key={i} content={msg.content} />
          if (msg.role === 'spinner') return <SpinnerBubble key={i} />
          return null
        })}
        {generating && <GeneratingBubble label={t.chat.generating} />}
        <div ref={bottomRef} />
      </div>

      {error && (
        <div className="mb-3">
          <Alert type="error">{error}</Alert>
        </div>
      )}

      {inputStep && !isSummaryStep && (
        <div className="sticky bottom-0 pt-3 pb-1 bg-stone-50 border-t border-stone-100">
          {inputStep.type === 'text_input' && (
            <TextInput step={inputStep} flowId={flow.id} onSubmit={submitAnswer} loading={loading} />
          )}
          {(inputStep.type === 'single_select' || inputStep.type === 'multi_select' || inputStep.type === 'emotion_picker') && (
            <SuggestionsInput step={inputStep} flowId={flow.id} onSubmit={(v) => submitAnswer(v)} loading={loading} />
          )}
        </div>
      )}
    </div>
  )
}
