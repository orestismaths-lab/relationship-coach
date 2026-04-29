'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { ChatRunner } from '@/components/flows/ChatRunner'
import { getFlow } from '@/lib/flows/definitions'
import { Alert } from '@/components/ui/Alert'

interface SessionData {
  sessionId: string
  currentStep: number
  totalSteps: number
}

const accentDot: Record<string, string> = {
  understand: 'bg-indigo-400',
  prepare:    'bg-violet-400',
  decide:     'bg-teal-400',
}

export default function FlowPage({ params }: { params: Promise<{ flowId: string }> }) {
  const { flowId } = use(params)
  const flow = getFlow(flowId)
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [starting, setStarting] = useState(false)

  useEffect(() => {
    if (!flow) return
    startSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowId])

  async function startSession() {
    setStarting(true)
    setError(null)
    try {
      const res = await fetch('/api/flows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flowId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Could not start.')
        return
      }
      setSessionData({ sessionId: data.sessionId, currentStep: data.currentStep, totalSteps: data.totalSteps })
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setStarting(false)
    }
  }

  if (!flow) {
    return (
      <div className="space-y-4">
        <Alert type="error">Flow not found.</Alert>
        <Link href="/dashboard" className="text-sm text-indigo-600 hover:underline">← Back</Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="space-y-2">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-stone-600 transition-colors"
        >
          ← Back
        </Link>
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${accentDot[flowId] ?? 'bg-indigo-400'}`} />
          <h1 className="text-base font-semibold text-stone-900">{flow.title}</h1>
        </div>
        <p className="text-sm text-stone-500">{flow.tagline}</p>
      </div>

      <div className="border-t border-stone-100" />

      {/* Body */}
      {starting && (
        <div className="flex items-center justify-center py-16">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
        </div>
      )}

      {error && (
        <div className="space-y-3">
          <Alert type="error">{error}</Alert>
          <button
            onClick={startSession}
            className="text-sm text-indigo-600 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {sessionData && !starting && (
        <ChatRunner
          flow={flow}
          sessionId={sessionData.sessionId}
          initialStep={sessionData.currentStep}
          totalSteps={sessionData.totalSteps}
        />
      )}
    </div>
  )
}
