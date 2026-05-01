'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getLocalSessions, deleteLocalSession, type LocalSession } from '@/lib/history'
import { useLanguage } from '@/contexts/LanguageContext'

const accentDot: Record<string, string> = {
  understand: 'bg-indigo-400',
  prepare: 'bg-violet-400',
  decide: 'bg-teal-400',
}

export function LocalSessionsList() {
  const { t, lang } = useLanguage()
  const [sessions, setSessions] = useState<LocalSession[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setSessions(getLocalSessions())
  }, [])

  if (!mounted || sessions.length === 0) return null

  function handleDelete(id: string) {
    deleteLocalSession(id)
    setSessions(s => s.filter(x => x.id !== id))
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
        {t.history.localTitle}
      </p>
      <div className="space-y-2">
        {sessions.map((s) => (
          <div key={s.id} className="flex items-center gap-4 rounded-xl border border-amber-100 bg-amber-50/50 px-5 py-4">
            <div className={`h-2 w-2 rounded-full shrink-0 ${accentDot[s.flowId] ?? 'bg-stone-300'}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-800 truncate">{s.title}</p>
              <p className="text-xs text-stone-400 mt-0.5">
                {new Date(s.createdAt).toLocaleDateString(lang === 'el' ? 'el-GR' : 'en-US', {
                  month: 'short', day: 'numeric', year: 'numeric',
                })}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                {t.history.localBadge}
              </span>
              <Link
                href={`/history/local?id=${s.id}`}
                className="text-xs text-indigo-500 hover:text-indigo-700 hover:underline"
              >
                {t.history.view}
              </Link>
              <button
                onClick={() => handleDelete(s.id)}
                className="text-xs text-stone-300 hover:text-red-400 transition-colors"
              >
                {t.history.delete}
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-stone-400">{t.history.localNote}</p>
    </div>
  )
}
