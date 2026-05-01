'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'

export function DeleteButton({ sessionId }: { sessionId: string }) {
  const { t } = useLanguage()
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    if (!confirming) {
      setConfirming(true)
      // Auto-cancel confirmation after 3 seconds
      setTimeout(() => setConfirming(false), 3000)
      return
    }
    setLoading(true)
    await fetch(`/api/flows/${sessionId}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`text-xs transition-colors ${
        confirming
          ? 'text-red-500 hover:text-red-700 font-medium'
          : 'text-stone-300 hover:text-red-400'
      }`}
    >
      {confirming ? t.history.confirmDelete : t.history.delete}
    </button>
  )
}
