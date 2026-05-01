'use client'

import { useEffect, useState } from 'react'
import { getSaveHistoryPref, saveLocalSession, makeSessionTitle } from '@/lib/history'
import { useLanguage } from '@/contexts/LanguageContext'

type Props = {
  sessionId: string
  flowId: string
  flowTitle: string
  outputJson: string
  answers: Record<string, unknown>
}

export function HistoryManager({ sessionId, flowId, flowTitle, outputJson, answers }: Props) {
  const { t } = useLanguage()
  const [state, setState] = useState<'pending' | 'saved' | 'local'>('pending')

  useEffect(() => {
    const shouldSave = getSaveHistoryPref()
    if (!shouldSave) {
      saveLocalSession({
        id: sessionId,
        flowId,
        title: makeSessionTitle(answers, flowTitle),
        outputJson,
        createdAt: new Date().toISOString(),
      })
      fetch(`/api/flows/${sessionId}`, { method: 'DELETE' }).catch(() => {})
      setState('local')
    } else {
      setState('saved')
    }
  }, [sessionId, flowId, flowTitle, outputJson, answers])

  if (state === 'pending') return null

  if (state === 'local') {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
        <span className="font-semibold">{t.history.notSavedBadge}. </span>
        {t.history.notSavedNote}
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-xs text-green-700">
      {t.history.savedBadge}
    </div>
  )
}
