'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export function ChangePasswordForm() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (next.length < 8) { setError(t.settings.passwordTooShort); return }
    if (next !== confirm) { setError(t.settings.passwordMismatch); return }
    setLoading(true)
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: current, newPassword: next }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(data.error === 'wrong_password' ? t.settings.passwordWrong : t.chat.genericError)
      return
    }
    setSuccess(true)
    setCurrent(''); setNext(''); setConfirm('')
    setTimeout(() => { setSuccess(false); setOpen(false) }, 2000)
  }

  if (!open) {
    return (
      <div className="flex items-center justify-between px-5 py-4">
        <span className="text-sm text-stone-700">{t.settings.changePassword}</span>
        <button onClick={() => setOpen(true)} className="text-xs text-indigo-500 hover:text-indigo-700">
          {t.settings.changePassword} →
        </button>
      </div>
    )
  }

  return (
    <div className="px-5 py-4 space-y-3">
      <p className="text-sm font-medium text-stone-700">{t.settings.changePassword}</p>
      {success && <p className="text-xs text-green-600">{t.settings.passwordChanged}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="password" required placeholder={t.settings.currentPassword} value={current}
          onChange={e => setCurrent(e.target.value)}
          className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
        />
        <input
          type="password" required placeholder={t.settings.newPassword} value={next}
          onChange={e => setNext(e.target.value)}
          className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
        />
        <input
          type="password" required placeholder={t.settings.confirmPassword} value={confirm}
          onChange={e => setConfirm(e.target.value)}
          className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
        />
        <div className="flex gap-2 pt-1">
          <button type="submit" disabled={loading}
            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
            {loading ? '…' : t.settings.changePassword}
          </button>
          <button type="button" onClick={() => { setOpen(false); setError(null) }}
            className="rounded-lg border border-stone-200 px-4 py-1.5 text-xs text-stone-500 hover:bg-stone-50">
            ✕
          </button>
        </div>
      </form>
    </div>
  )
}
