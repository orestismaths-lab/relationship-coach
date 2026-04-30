'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { Card } from '@/components/ui/Card'
import { useLanguage } from '@/contexts/LanguageContext'

export default function LoginPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = await signIn('credentials', {
      email, password, redirect: false,
    })

    setLoading(false)
    if (result?.error) {
      setError(t.auth.login.error)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">{t.auth.login.title}</h1>
          <p className="mt-1 text-sm text-gray-500">{t.auth.login.subtitle}</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert type="error">{error}</Alert>}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">{t.auth.login.email}</label>
              <input
                type="email"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">{t.auth.login.password}</label>
              <input
                type="password"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" loading={loading} className="w-full">
              {t.auth.login.submit}
            </Button>
          </form>
        </Card>

        <p className="text-center text-sm text-gray-500">
          {t.auth.login.noAccount}{' '}
          <Link href="/register" className="text-indigo-600 hover:underline font-medium">
            {t.auth.login.createOne}
          </Link>
        </p>
      </div>
    </div>
  )
}
