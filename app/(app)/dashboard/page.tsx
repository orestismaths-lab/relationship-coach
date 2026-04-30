import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { FlowCard } from '@/components/flows/FlowCard'
import { FLOW_DEFINITIONS } from '@/lib/flows/definitions'
import { getServerT, getServerLang } from '@/lib/i18n/server'
import { getFlowT } from '@/lib/i18n/flowTranslations'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const t = await getServerT()
  const lang = await getServerLang()
  const flows = Object.values(FLOW_DEFINITIONS)
  const firstName = session?.user?.name?.split(' ')[0]

  const greeting = firstName
    ? t.dashboard.greeting.replace('{name}', firstName)
    : t.dashboard.greetingAnon

  return (
    <div className="space-y-10">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-stone-900">{greeting}</h1>
        <p className="text-stone-500 text-sm">{t.dashboard.subtitle}</p>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
          {t.dashboard.chooseFlow}
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {flows.map((flow) => {
            const flowT = getFlowT(flow.id, lang)
            return (
              <FlowCard
                key={flow.id}
                flow={flow}
                titleOverride={flowT?.title}
                taglineOverride={flowT?.tagline}
                minutesOverride={flowT?.estimatedMinutes}
              />
            )
          })}
        </div>
      </div>

      <div className="rounded-xl border border-amber-100 bg-amber-50 px-5 py-4">
        <p className="text-xs text-amber-700 leading-relaxed">
          <span className="font-semibold">{t.dashboard.safetyLabel}</span>{' '}
          {t.dashboard.safetyNote}
        </p>
      </div>
    </div>
  )
}
