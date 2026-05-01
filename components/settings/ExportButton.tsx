'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export function ExportButton() {
  const { t } = useLanguage()
  const s = t.settings

  return (
    <div className="flex items-start justify-between px-5 py-4 gap-4">
      <div className="space-y-0.5">
        <p className="text-sm text-stone-700">{s.exportData}</p>
        <p className="text-xs text-stone-400">{s.exportNote}</p>
      </div>
      <a
        href="/api/export"
        download="relationship-coach-export.json"
        className="shrink-0 text-xs text-indigo-500 hover:text-indigo-700 font-medium mt-0.5"
      >
        ↓ JSON
      </a>
    </div>
  )
}
