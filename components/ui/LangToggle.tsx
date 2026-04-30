'use client'

import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'

export function LangToggle({ className = '' }: { className?: string }) {
  const { lang, setLang } = useLanguage()
  const router = useRouter()

  function toggle() {
    setLang(lang === 'en' ? 'el' : 'en')
    router.refresh()
  }

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors cursor-pointer ${className}`}
      title={lang === 'en' ? 'Switch to Greek / Αλλαγή σε Ελληνικά' : 'Switch to English'}
    >
      <span className="text-base leading-none">{lang === 'en' ? '🇬🇷' : '🇬🇧'}</span>
      <span>{lang === 'en' ? 'ΕΛ' : 'EN'}</span>
    </button>
  )
}
