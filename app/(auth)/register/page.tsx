'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { Card } from '@/components/ui/Card'
import { useLanguage } from '@/contexts/LanguageContext'

export default function RegisterPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (password.length < 8) {
      setError(t.auth.register.passwordError)
      return
    }
    setLoading(true)

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? t.auth.register.failed)
      setLoading(false)
      return
    }

    await signIn('credentials', { email, password, redirect: false })
    router.push('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">{t.auth.register.title}</h1>
          <p className="mt-1 text-sm text-gray-500">{t.auth.register.subtitle}</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert type="error">{error}</Alert>}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">{t.auth.register.name}</label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">{t.auth.register.email}</label>
              <input
                type="email"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">{t.auth.register.password}</label>
              <input
                type="password"
                required
                minLength={8}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-xs text-gray-400">{t.auth.register.passwordHint}</p>
            </div>
            <Button type="submit" loading={loading} className="w-full">
              {t.auth.register.submit}
            </Button>
          </form>
        </Card>

        <p className="text-center text-sm text-gray-500">
          {t.auth.register.hasAccount}{' '}
          <Link href="/login" className="text-indigo-600 hover:underline font-medium">
            {t.auth.register.signIn}
          </Link>
        </p>
      </div>
    </div>
  )
}
