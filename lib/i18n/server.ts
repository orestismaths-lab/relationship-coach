import { cookies } from 'next/headers'
import { translations } from './translations'
import type { Lang, T } from './translations'

export async function getServerLang(): Promise<Lang> {
  const store = await cookies()
  const val = store.get('lang')?.value
  return val === 'el' ? 'el' : 'en'
}

export async function getServerT(): Promise<T> {
  const lang = await getServerLang()
  return translations[lang]
}
