import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { FlowCard } from '@/components/flows/FlowCard'
import { FLOW_DEFINITIONS } from '@/lib/flows/definitions'
import { getServerT, getServerLang } from '@/lib/i18n/server'
import { getFlowT } from '@/lib/i18n/flowTranslations'

const accentDot: Record<string, string> = {
  understand: 'bg-indigo-400',
  prepare: 'bg-violet-400',
  decide: 'bg-teal-400',
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const t = await getServerT()
  const lang = await getServerLang()
  const flows = Object.values(FLOW_DEFINITIONS)
  const firstName = session?.user?.name?.split(' ')[0]

  const greeting = firstName
    ? t.dashboard.greeting.replace('{name}', firstName)
    : t.dashboard.greetingAnon

  const recentSessions = session?.user?.id
    ? await prisma.flowSession.findMany({
        where: { userId: session.user.id, status: 'COMPLETED' },
        orderBy: { completedAt: 'desc' },
        take: 3,
        select: { id: true, flowId: true, title: true, completedAt: true, createdAt: true },
      })
    : []

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

      {recentSessions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
              {t.history.recentTitle}
            </p>
            <Link href="/history" className="text-xs text-indigo-500 hover:underline">
              {t.history.view}
            </Link>
          </div>
          <div className="space-y-2">
            {recentSessions.map((s) => {
              const flowT = getFlowT(s.flowId, lang)
              const flow = FLOW_DEFINITIONS[s.flowId]
              const title = s.title ?? flowT?.title ?? flow?.title ?? s.flowId
              const date = new Date(s.completedAt ?? s.createdAt).toLocaleDateString(
                lang === 'el' ? 'el-GR' : 'en-US',
                { month: 'short', day: 'numeric' }
              )
              return (
                <Link
                  key={s.id}
                  href={`/flows/${s.flowId}/complete?session=${s.id}`}
                  className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-sm hover:border-indigo-200 transition-colors"
                >
                  <div className={`h-2 w-2 rounded-full shrink-0 ${accentDot[s.flowId] ?? 'bg-stone-300'}`} />
                  <p className="flex-1 text-sm text-stone-700 truncate">{title}</p>
                  <span className="text-xs text-stone-400 shrink-0">{date}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-amber-100 bg-amber-50 px-5 py-4">
        <p className="text-xs text-amber-700 leading-relaxed">
          <span className="font-semibold">{t.dashboard.safetyLabel}</span>{' '}
          {t.dashboard.safetyNote}
        </p>
      </div>
    </div>
  )
}
