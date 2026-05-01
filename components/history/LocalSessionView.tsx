'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getLocalSessions, deleteLocalSession, type LocalSession } from '@/lib/history'
import { useLanguage } from '@/contexts/LanguageContext'
import { isUnderstandOutput, isPrepareOutput, isDecideOutput } from '@/types'
import type { FlowAIOutput } from '@/types'
import { UnderstandResult } from '@/components/flows/results/UnderstandResult'
import { PrepareResult } from '@/components/flows/results/PrepareResult'
import { DecideResult } from '@/components/flows/results/DecideResult'

export function LocalSessionView({ id }: { id: string }) {
  const { t, lang } = useLanguage()
  const [session, setSession] = useState<LocalSession | null | 'loading'>('loading')
  const [output, setOutput] = useState<FlowAIOutput | null>(null)
  const [deleted, setDeleted] = useState(false)

  useEffect(() => {
    const s = getLocalSessions().find(x => x.id === id) ?? null
    setSession(s)
    if (s) {
      try { setOutput(JSON.parse(s.outputJson) as FlowAIOutput) } catch {}
    }
  }, [id])

  if (session === 'loading') return null

  if (!session || deleted) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-stone-200 bg-white px-6 py-12 text-center">
          <p className="text-sm text-stone-400">
            {deleted ? t.history.delete + '.' : 'Session not found or expired.'}{' '}
            <Link href="/history" className="text-indigo-500 hover:underline">{t.complete.viewAll}</Link>
          </p>
        </div>
      </div>
    )
  }

  function handleDelete() {
    deleteLocalSession(id)
    setDeleted(true)
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
            {t.history.localBadge}
          </span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-stone-900">{session.title}</h1>
            <p className="text-sm text-stone-400 mt-0.5">
              {new Date(session.createdAt).toLocaleDateString(lang === 'el' ? 'el-GR' : 'en-US', {
                weekday: 'long', month: 'long', day: 'numeric',
              })}
            </p>
          </div>
          <button
            onClick={handleDelete}
            className="shrink-0 text-xs text-stone-300 hover:text-red-400 transition-colors mt-1"
          >
            {t.history.delete}
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
        {t.history.localNote}
      </div>

      <div className="border-t border-stone-100" />

      {output ? (
        <>
          {session.flowId === 'understand' && isUnderstandOutput(output) && (
            <UnderstandResult output={output} t={t.results.understand} />
          )}
          {session.flowId === 'prepare' && isPrepareOutput(output) && (
            <PrepareResult output={output} t={t.results.prepare} />
          )}
          {session.flowId === 'decide' && isDecideOutput(output) && (
            <DecideResult output={output} t={t.results.decide} />
          )}
        </>
      ) : (
        <div className="rounded-2xl border border-stone-200 bg-white px-6 py-10 text-center">
          <p className="text-sm text-stone-400">{t.complete.noSummary}</p>
        </div>
      )}

      <div className="rounded-xl border border-amber-100 bg-amber-50 px-5 py-4">
        <p className="text-xs text-amber-700 leading-relaxed">{t.complete.disclaimer}</p>
      </div>

      <div className="flex flex-col gap-3 pt-2">
        <Link
          href="/dashboard"
          className="block w-full rounded-xl bg-indigo-600 py-3 text-center text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          {t.complete.back}
        </Link>
        <Link
          href="/history"
          className="block w-full rounded-xl border border-stone-200 bg-white py-3 text-center text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
        >
          {t.complete.viewAll}
        </Link>
      </div>
    </div>
  )
}
