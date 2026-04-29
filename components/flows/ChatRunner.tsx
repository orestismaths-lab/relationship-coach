'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { SafetyBanner } from '@/components/SafetyBanner'
import { Alert } from '@/components/ui/Alert'
import type { FlowDefinition, FlowStep } from '@/types'

// ─── Message types ────────────────────────────────────────────────────────────

type AIMessage = {
  role: 'ai'
  content: string
  step: FlowStep
}

type UserMessage = {
  role: 'user'
  content: string // formatted for display
}

type SpinnerMessage = {
  role: 'spinner'
}

type Message = AIMessage | UserMessage | SpinnerMessage

// ─── Input area ───────────────────────────────────────────────────────────────

function TextInput({
  step,
  onSubmit,
  loading,
}: {
  step: FlowStep
  onSubmit: (v: string) => void
  loading: boolean
}) {
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
        placeholder={step.placeholder ?? 'Write here…'}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit()
        }}
        disabled={loading}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-stone-300">⌘ + Enter to send</span>
        <button
          onClick={submit}
          disabled={!value.trim() || loading}
          className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  )
}

function SelectInput({
  step,
  onSubmit,
  loading,
  multi,
}: {
  step: FlowStep
  onSubmit: (v: string | string[]) => void
  loading: boolean
  multi: boolean
}) {
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (opt: string) => {
    if (!multi) {
      onSubmit(opt)
      return
    }
    setSelected((s) => s.includes(opt) ? s.filter((x) => x !== opt) : [...s, opt])
  }

  const isSafety = (opt: string) => step.safetyTriggerValues?.includes(opt) ?? false

  return (
    <div className="flex flex-col gap-2">
      <div className={multi ? 'flex flex-wrap gap-2' : 'flex flex-col gap-1.5'}>
        {step.options?.map((opt) => {
          const isSelected = selected.includes(opt)
          const safety = isSafety(opt)
          return (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              disabled={loading}
              className={
                multi
                  ? `rounded-full border px-4 py-2 text-sm font-medium transition-all cursor-pointer disabled:opacity-40
                      ${isSelected
                        ? 'border-indigo-300 bg-indigo-600 text-white shadow-sm'
                        : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50'
                      }`
                  : `rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all cursor-pointer disabled:opacity-40
                      ${safety
                        ? 'border-stone-200 bg-white text-amber-700 hover:border-amber-200 hover:bg-amber-50'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50'
                      }`
              }
            >
              {!multi && safety && <span className="mr-2 text-amber-500">⚠</span>}
              {opt}
            </button>
          )
        })}
      </div>

      {multi && (
        <div className="flex items-center justify-between mt-1">
          {!step.required && selected.length === 0 ? (
            <button
              onClick={() => onSubmit([])}
              className="text-sm text-stone-400 hover:text-stone-600 transition-colors"
            >
              Skip
            </button>
          ) : <span />}
          <button
            onClick={() => onSubmit(selected)}
            disabled={selected.length === 0 && !!step.required}
            className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Continue
          </button>
        </div>
      )}
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

function GeneratingBubble() {
  return (
    <div className="flex items-end gap-2">
      <div className="h-7 w-7 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0 mb-0.5">
        <span className="text-xs">✦</span>
      </div>
      <div className="rounded-2xl rounded-bl-sm bg-stone-100 px-4 py-3 flex items-center gap-2.5">
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent shrink-0" />
        <span className="text-sm text-stone-500">Generating your reflection…</span>
      </div>
    </div>
  )
}

// ─── Format answer for display ────────────────────────────────────────────────

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
  const [messages, setMessages] = useState<Message[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStep)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [safetyMessage, setSafetyMessage] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Push initial question on mount
  useEffect(() => {
    const step = flow.steps[initialStep]
    if (step && step.type !== 'summary') {
      setMessages([{ role: 'ai', content: step.question, step }])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, generating])

  const currentStep = flow.steps[currentStepIndex]

  async function submitAnswer(answer: string | string[]) {
    if (!currentStep || loading || generating) return
    setError(null)

    const displayAnswer = formatAnswer(answer)

    // Add user bubble + typing indicator immediately
    setMessages((m) => [
      ...m,
      { role: 'user', content: displayAnswer },
      { role: 'spinner' },
    ])
    setLoading(true)

    try {
      const res = await fetch(`/api/flows/${sessionId}/step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId: currentStep.id, answer }),
      })
      const data = await res.json()

      if (!res.ok) {
        // Remove spinner, show error
        setMessages((m) => m.filter((x) => x.role !== 'spinner'))
        setError(data.error ?? 'Something went wrong. Please try again.')
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
          // Remove spinner, show generating state, auto-submit
          setMessages((m) => m.filter((x) => x.role !== 'spinner'))
          setGenerating(true)
          setLoading(false)
          const genRes = await fetch(`/api/flows/${sessionId}/step`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stepId: nextStep.id, answer: '' }),
          })
          const genData = await genRes.json()
          setGenerating(false)
          if (genData.type === 'complete') {
            router.push(`/flows/${flow.id}/complete?session=${sessionId}`)
          }
          return
        }

        if (nextStep) {
          // Replace spinner with next AI question
          setMessages((m) => [
            ...m.filter((x) => x.role !== 'spinner'),
            { role: 'ai', content: nextStep.question, step: nextStep },
          ])
          setCurrentStepIndex(data.currentStep)
        }
      }
    } catch {
      setMessages((m) => m.filter((x) => x.role !== 'spinner'))
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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
            style={{ width: `${Math.round(((currentStepIndex) / (totalSteps - 1)) * 100)}%` }}
          />
        </div>
        <span className="text-xs text-stone-400 tabular-nums shrink-0">
          {Math.min(currentStepIndex + 1, totalSteps - 1)} / {totalSteps - 1}
        </span>
      </div>

      {/* Message list */}
      <div className="flex flex-col gap-4 flex-1 pb-6">
        {messages.map((msg, i) => {
          if (msg.role === 'ai') return <AIBubble key={i} content={msg.content} />
          if (msg.role === 'user') return <UserBubble key={i} content={msg.content} />
          if (msg.role === 'spinner') return <SpinnerBubble key={i} />
          return null
        })}
        {generating && <GeneratingBubble />}
        <div ref={bottomRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="mb-3">
          <Alert type="error">{error}</Alert>
        </div>
      )}

      {/* Input area — hidden while loading, generating, or on summary step */}
      {inputStep && !isSummaryStep && (
        <div className="sticky bottom-0 pt-3 pb-1 bg-stone-50">
          {inputStep.type === 'text_input' && (
            <TextInput step={inputStep} onSubmit={submitAnswer} loading={loading} />
          )}
          {inputStep.type === 'single_select' && (
            <SelectInput step={inputStep} onSubmit={(v) => submitAnswer(v as string)} loading={loading} multi={false} />
          )}
          {inputStep.type === 'multi_select' && (
            <SelectInput step={inputStep} onSubmit={(v) => submitAnswer(v as string[])} loading={loading} multi={true} />
          )}
          {inputStep.type === 'emotion_picker' && (
            <SelectInput step={inputStep} onSubmit={(v) => submitAnswer(v as string[])} loading={loading} multi={true} />
          )}
        </div>
      )}
    </div>
  )
}
