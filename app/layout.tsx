import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { cookies } from 'next/headers'
import './globals.css'
import { SessionProvider } from '@/components/SessionProvider'
import { ToastProvider } from '@/contexts/ToastContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import type { Lang } from '@/lib/i18n/translations'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: 'Relationship Coach',
  description: 'A guided tool for understanding and navigating difficult relationships.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies()
  const initialLang = (store.get('lang')?.value === 'el' ? 'el' : 'en') as Lang

  return (
    <html lang={initialLang} className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full bg-stone-50 font-sans">
        <SessionProvider>
          <ToastProvider>
            <LanguageProvider initialLang={initialLang}>
              {children}
            </LanguageProvider>
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
