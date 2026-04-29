'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Alert } from '@/components/ui/Alert'
import { SafetyBanner } from '@/components/SafetyBanner'
import { TextInputStep } from './steps/TextInputStep'
import { SingleSelectStep } from './steps/SingleSelectStep'
import { MultiSelectStep } from './steps/MultiSelectStep'
import { EmotionPickerStep } from './steps/EmotionPickerStep'
import type { FlowDefinition } from '@/types'

interface Props {
  flow: FlowDefinition
  sessionId: string
  initialStep: number
  totalSteps: number
}

export function FlowRunner({ flow, sessionId, initialStep, totalSteps }: Props) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [safetyMessage, setSafetyMessage] = useState<string | null>(null)

  const step = flow.steps[currentStep]

  async function submitAnswer(answer: string | string[] | number) {
    if (!step) return
    setError(null)
    setLoading(true)

    try {
      const res = await fetch(`/api/flows/${sessionId}/step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId: step.id, answer }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        return
      }

      if (data.type === 'safety') {
        setSafetyMessage(data.message)
        return
      }
      if (data.type === 'complete') {
        router.push(`/flows/${flow.id}/complete?session=${sessionId}`)
        return
      }
      if (data.type === 'next') {
        setCurrentStep(data.currentStep)
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (safetyMessage) return <SafetyBanner message={safetyMessage} />
  if (!step) return null

  // Summary step: auto-submit to trigger AI generation
  const isSummaryStep = step.type === 'summary'
  if (isSummaryStep) {
    if (!loading) {
      setLoading(true)
      submitAnswer('')
    }
    return (
      <div className="flex items-center gap-2.5 py-12 justify-center">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
        <span className="text-sm text-stone-400">Generating your reflection…</span>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <ProgressBar current={currentStep + 1} total={totalSteps} />

      {error && <Alert type="error">{error}</Alert>}

      <div className="space-y-3">
        <h2 className="text-base font-semibold text-stone-900">{step.question}</h2>

        {step.type === 'text_input' && (
          <TextInputStep step={step} onSubmit={submitAnswer} loading={loading} />
        )}
        {step.type === 'single_select' && (
          <SingleSelectStep step={step} onSubmit={submitAnswer} loading={loading} />
        )}
        {step.type === 'multi_select' && (
          <MultiSelectStep step={step} onSubmit={(a) => submitAnswer(a)} loading={loading} />
        )}
        {step.type === 'emotion_picker' && (
          <EmotionPickerStep step={step} onSubmit={(a) => submitAnswer(a)} loading={loading} />
        )}
      </div>
    </div>
  )
}
