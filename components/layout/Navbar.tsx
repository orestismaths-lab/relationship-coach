'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

export function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const navLinks = [
    { href: '/dashboard', label: 'Home' },
    { href: '/history',   label: 'History' },
    { href: '/settings',  label: 'Settings' },
  ]

  return (
    <header className="border-b border-stone-200 bg-white sticky top-0 z-10">
      <div className="mx-auto flex h-13 max-w-2xl items-center justify-between px-5">
        <Link
          href="/dashboard"
          className="text-sm font-semibold tracking-tight text-stone-800 hover:text-indigo-600 transition-colors"
        >
          Relationship Coach
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
          {session && (
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="ml-2 rounded-lg px-3 py-1.5 text-sm text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Sign out
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
