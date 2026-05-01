'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { ChatRunner } from '@/components/flows/ChatRunner'
import { getFlow } from '@/lib/flows/definitions'
import { Alert } from '@/components/ui/Alert'
import { useLanguage } from '@/contexts/LanguageContext'
import { getFlowT } from '@/lib/i18n/flowTranslations'

interface SessionData {
  sessionId: string
  currentStep: number
  totalSteps: number
}

interface PendingSession {
  id: string
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
  const { lang, t } = useLanguage()
  const flowT = getFlowT(flowId, lang)

  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [pending, setPending] = useState<PendingSession | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!flow) { setLoading(false); return }
    checkForExisting()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowId])

  async function checkForExisting() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/flows?flowId=${flowId}&status=IN_PROGRESS`)
      if (!res.ok) { await startFresh(); return }
      const data = await res.json()
      const existing = data.sessions?.[0]
      if (existing) {
        setPending({ id: existing.id, currentStep: existing.currentStep, totalSteps: flow!.steps.length })
        setLoading(false)
      } else {
        await startFresh()
      }
    } catch {
      setError(t.chat.networkError)
      setLoading(false)
    }
  }

  async function startFresh(abandonId?: string) {
    setLoading(true)
    setError(null)
    if (abandonId) {
      await fetch(`/api/flows/${abandonId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ABANDONED' }),
      }).catch(() => {})
    }
    try {
      const res = await fetch('/api/flows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flowId }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? t.chat.genericError); setLoading(false); return }
      setSessionData({ sessionId: data.sessionId, currentStep: data.currentStep, totalSteps: data.totalSteps })
      setPending(null)
    } catch {
      setError(t.chat.networkError)
    } finally {
      setLoading(false)
    }
  }

  function resumeExisting() {
    if (!pending) return
    setSessionData({ sessionId: pending.id, currentStep: pending.currentStep, totalSteps: pending.totalSteps })
    setPending(null)
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
          {t.chat.back}
        </Link>
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${accentDot[flowId] ?? 'bg-indigo-400'}`} />
          <h1 className="text-base font-semibold text-stone-900">{flowT?.title ?? flow.title}</h1>
        </div>
        <p className="text-sm text-stone-500">{flowT?.tagline ?? flow.tagline}</p>
      </div>

      <div className="border-t border-stone-100" />

      {/* Body */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
        </div>
      )}

      {error && !loading && (
        <div className="space-y-3">
          <Alert type="error">{error}</Alert>
          <button onClick={() => checkForExisting()} className="text-sm text-indigo-600 hover:underline">
            {t.chat.continue}
          </button>
        </div>
      )}

      {/* Resume prompt */}
      {pending && !loading && !sessionData && (
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6 space-y-4">
          <div>
            <p className="text-sm font-semibold text-indigo-900">{t.chat.resumeTitle}</p>
            <p className="text-xs text-indigo-600 mt-0.5">
              {t.chat.resumeSubtitle
                .replace('{step}', String(pending.currentStep + 1))
                .replace('{total}', String(pending.totalSteps))}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={resumeExisting}
              className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              {t.chat.continueFlow}
            </button>
            <button
              onClick={() => startFresh(pending.id)}
              className="flex-1 rounded-xl border border-stone-200 bg-white py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
            >
              {t.chat.startFresh}
            </button>
          </div>
        </div>
      )}

      {sessionData && !loading && (
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
