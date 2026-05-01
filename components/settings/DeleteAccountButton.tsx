'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { clearLocalSessions } from '@/lib/history'
import { useLanguage } from '@/contexts/LanguageContext'

export function DeleteAccountButton() {
  const { t } = useLanguage()
  const s = t.settings
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleDelete(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const res = await fetch('/api/auth/delete-account', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(data.error === 'wrong_password' ? s.passwordWrong : 'Error')
      return
    }
    clearLocalSessions()
    await signOut({ callbackUrl: '/' })
  }

  if (!open) {
    return (
      <div className="flex items-center justify-between px-5 py-4">
        <span className="text-sm text-red-500">{s.deleteAccount}</span>
        <button onClick={() => setOpen(true)} className="text-xs text-stone-300 hover:text-red-400 transition-colors">
          {t.history.delete}
        </button>
      </div>
    )
  }

  return (
    <div className="px-5 py-4 space-y-3">
      <p className="text-sm font-medium text-red-600">{s.deleteAccount}</p>
      <p className="text-xs text-stone-500">{s.deleteAccountNote}</p>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <form onSubmit={handleDelete} className="space-y-2">
        <input
          type="password" required placeholder={s.deleteAccountConfirmLabel} value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full rounded-lg border border-red-200 px-3 py-2 text-sm focus:border-red-400 focus:outline-none"
        />
        <div className="flex gap-2 pt-1">
          <button type="submit" disabled={loading}
            className="rounded-lg bg-red-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50">
            {loading ? '…' : s.deleteAccountConfirm}
          </button>
          <button type="button" onClick={() => { setOpen(false); setError(null) }}
            className="rounded-lg border border-stone-200 px-4 py-1.5 text-xs text-stone-500 hover:bg-stone-50">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
