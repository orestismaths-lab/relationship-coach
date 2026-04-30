'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '@/lib/i18n/translations'
import type { Lang, T } from '@/lib/i18n/translations'

type LanguageContextValue = {
  lang: Lang
  t: T
  setLang: (l: Lang) => void
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  t: translations.en,
  setLang: () => {},
})

export function LanguageProvider({
  children,
  initialLang,
}: {
  children: React.ReactNode
  initialLang: Lang
}) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  useEffect(() => {
    // Sync with localStorage on mount (in case client has a different preference)
    const stored = localStorage.getItem('lang') as Lang | null
    if (stored === 'en' || stored === 'el') {
      if (stored !== lang) setLangState(stored)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem('lang', l)
    document.cookie = `lang=${l}; path=/; max-age=31536000; SameSite=Lax`
  }

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
