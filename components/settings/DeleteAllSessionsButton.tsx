'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { clearLocalSessions } from '@/lib/history'
import { useLanguage } from '@/contexts/LanguageContext'

export function DeleteAllSessionsButton() {
  const { t } = useLanguage()
  const router = useRouter()
  const [phase, setPhase] = useState<'idle' | 'confirm' | 'done'>('idle')
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    if (phase === 'idle') {
      setPhase('confirm')
      setTimeout(() => setPhase('idle'), 5000)
      return
    }
    if (phase === 'confirm') {
      setLoading(true)
      clearLocalSessions()
      await fetch('/api/flows', { method: 'DELETE' })
      setPhase('done')
      setLoading(false)
      router.refresh()
    }
  }

  if (phase === 'done') {
    return (
      <div className="flex items-center justify-between px-5 py-4">
        <span className="text-sm text-stone-400">{t.settings.deleteSessions}</span>
        <span className="text-xs text-green-500">✓</span>
      </div>
    )
  }

  return (
    <div className="space-y-0">
      <div className="flex items-center justify-between px-5 py-4">
        <span className="text-sm text-red-500">{t.settings.deleteSessions}</span>
        <button
          onClick={handleClick}
          disabled={loading}
          className={`text-xs font-medium transition-colors ${
            phase === 'confirm' ? 'text-red-600 font-semibold' : 'text-stone-300 hover:text-red-400'
          }`}
        >
          {phase === 'confirm' ? t.history.confirmDelete : t.history.delete}
        </button>
      </div>
      {phase === 'confirm' && (
        <p className="px-5 pb-3 text-xs text-red-500">{t.settings.deleteSessionsConfirm}</p>
      )}
    </div>
  )
}
