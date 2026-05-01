'use client'

import { useEffect, useState } from 'react'
import { getSaveHistoryPref, setSaveHistoryPref } from '@/lib/history'
import { useLanguage } from '@/contexts/LanguageContext'

export function SaveHistoryToggle() {
  const { t } = useLanguage()
  const [enabled, setEnabled] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setEnabled(getSaveHistoryPref())
    setMounted(true)
  }, [])

  function toggle() {
    const next = !enabled
    setEnabled(next)
    setSaveHistoryPref(next)
  }

  if (!mounted) return null

  return (
    <div className="flex items-start justify-between px-5 py-4 gap-4">
      <div className="space-y-1">
        <p className="text-sm text-stone-700">{t.settings.saveHistory}</p>
        <p className="text-xs text-stone-400 leading-relaxed">{t.settings.saveHistoryNote}</p>
      </div>
      <button
        onClick={toggle}
        role="switch"
        aria-checked={enabled}
        className={`shrink-0 mt-0.5 relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
          enabled ? 'bg-indigo-600' : 'bg-stone-200'
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${
            enabled ? 'translate-x-4' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}
