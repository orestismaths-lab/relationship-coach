'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { useLanguage } from '@/contexts/LanguageContext'
import { LangToggle } from '@/components/ui/LangToggle'

export function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const { t } = useLanguage()

  const navLinks = [
    { href: '/dashboard', label: t.nav.home },
    { href: '/history',   label: t.nav.history },
    { href: '/settings',  label: t.nav.settings },
  ]

  return (
    <header className="border-b border-stone-200 bg-white/90 backdrop-blur-sm sticky top-0 z-10">
      <div className="mx-auto flex h-13 max-w-2xl items-center justify-between px-5">
        <Link
          href="/dashboard"
          className="text-sm font-semibold tracking-tight text-stone-800 hover:text-indigo-600 transition-colors"
        >
          {t.nav.brand}
        </Link>

        <nav className="flex items-center gap-1">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
                }`}
              >
                {label}
              </Link>
            )
          })}

          <LangToggle className="ml-1" />

          {session && (
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="ml-1 rounded-lg px-3 py-1.5 text-sm text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              {t.nav.signOut}
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
