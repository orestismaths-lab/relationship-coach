import Link from 'next/link'
import { getServerT, getServerLang } from '@/lib/i18n/server'
import { getFlowT } from '@/lib/i18n/flowTranslations'
import { LangToggle } from '@/components/ui/LangToggle'

export default async function LandingPage() {
  const t = await getServerT()
  const lang = await getServerLang()
  const l = t.landing

  const flows = [
    { id: 'understand', accent: 'indigo' as const },
    { id: 'prepare',    accent: 'violet' as const },
    { id: 'decide',     accent: 'teal'   as const },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
          <span className="text-sm font-semibold tracking-tight text-stone-800">{t.nav.brand}</span>
          <div className="flex items-center gap-2">
            <LangToggle />
            <Link href="/login" className="rounded-lg px-3.5 py-1.5 text-sm text-stone-600 hover:bg-stone-100 transition-colors">
              {l.signIn}
            </Link>
            <Link href="/register" className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
              {l.startFree}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="mx-auto w-full max-w-3xl px-5 pt-20 pb-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-4">{l.tagline}</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 leading-tight">{l.hero}</h1>
          <p className="mt-5 text-lg text-stone-600 max-w-lg mx-auto leading-relaxed">{l.subtitle}</p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register" className="w-full sm:w-auto rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm">
              {l.startFree}
            </Link>
            <Link href="/login" className="w-full sm:w-auto rounded-xl border border-stone-200 bg-white px-6 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors">
              {l.signIn}
            </Link>
          </div>
        </section>

        {/* Flow Cards */}
        <section className="mx-auto w-full max-w-4xl px-5 pb-16">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {flows.map(({ id, accent }) => {
              const ft = getFlowT(id, lang)
              return (
                <FlowPreviewCard
                  key={id}
                  accent={accent}
                  label={id.charAt(0).toUpperCase() + id.slice(1)}
                  title={ft?.title ?? id}
                  description={ft?.tagline ?? ''}
                  minutes={ft?.estimatedMinutes ?? 8}
                />
              )
            })}
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto w-full max-w-3xl px-5 pb-20">
          <div className="rounded-2xl border border-stone-200 bg-white p-8">
            <h2 className="text-base font-semibold text-stone-800 mb-6 text-center">{l.howItWorks}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              {l.steps.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-600">
                    {idx + 1}
                  </div>
                  <p className="text-sm font-semibold text-stone-800">{item.title}</p>
                  <p className="text-sm text-stone-500">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Safety Note */}
        <section className="mx-auto w-full max-w-2xl px-5 pb-20">
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-6 py-5 text-center">
            <p className="text-sm font-semibold text-amber-800 mb-2">{l.important}</p>
            <p className="text-sm text-amber-800 leading-relaxed">{l.safetyNote}</p>
            <p className="mt-3 text-xs text-amber-600">{l.crisisNote}</p>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200 bg-white py-6">
        <p className="text-center text-xs text-stone-400">{l.footerNote}</p>
      </footer>
    </div>
  )
}

function FlowPreviewCard({ accent, label, title, description, minutes }: {
  accent: 'indigo' | 'violet' | 'teal'
  label: string
  title: string
  description: string
  minutes: number
}) {
  const s = {
    indigo: { badge: 'bg-indigo-50 text-indigo-600', dot: 'bg-indigo-400' },
    violet: { badge: 'bg-violet-50 text-violet-600', dot: 'bg-violet-400' },
    teal:   { badge: 'bg-teal-50 text-teal-600',     dot: 'bg-teal-400'   },
  }[accent]

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.badge}`}>{label}</span>
        <span className="text-xs text-stone-400">~{minutes} min</span>
      </div>
      <div className="space-y-1.5">
        <h3 className="text-sm font-semibold text-stone-900">{title}</h3>
        <p className="text-sm text-stone-500 leading-relaxed">{description}</p>
      </div>
      <div className={`h-0.5 w-8 rounded-full ${s.dot}`} />
    </div>
  )
}
