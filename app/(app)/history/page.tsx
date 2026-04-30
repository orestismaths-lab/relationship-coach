import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { FLOW_DEFINITIONS } from '@/lib/flows/definitions'
import { getServerT, getServerLang } from '@/lib/i18n/server'
import { getFlowT } from '@/lib/i18n/flowTranslations'

const accentDot: Record<string, string> = {
  understand: 'bg-indigo-400',
  prepare:    'bg-violet-400',
  decide:     'bg-teal-400',
}

export default async function HistoryPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const t = await getServerT()
  const lang = await getServerLang()

  const sessions = await prisma.flowSession.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-stone-900">{t.history.title}</h1>
        <p className="text-sm text-stone-400">{t.history.total.replace('{n}', String(sessions.length))}</p>
      </div>

      {sessions.length === 0 ? (
        <div className="rounded-2xl border border-stone-200 bg-white px-6 py-12 text-center shadow-sm">
          <p className="text-sm text-stone-400">
            {t.history.empty}{' '}
            <Link href="/dashboard" className="text-indigo-600 hover:underline">
              {t.history.startOne}
            </Link>
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {sessions.map((s) => {
            const flow = FLOW_DEFINITIONS[s.flowId]
            const flowT = getFlowT(s.flowId, lang)
            const statusKey = s.status as keyof typeof t.history.status
            const statusLabel = t.history.status[statusKey] ?? t.history.status.ABANDONED
            const statusClass = {
              COMPLETED: 'bg-green-50 text-green-600',
              IN_PROGRESS: 'bg-amber-50 text-amber-600',
              ABANDONED: 'bg-stone-100 text-stone-400',
            }[s.status] ?? 'bg-stone-100 text-stone-400'
            const isComplete = s.status === 'COMPLETED'
            return (
              <div
                key={s.id}
                className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white px-5 py-4 shadow-sm"
              >
                <div className={`h-2 w-2 rounded-full shrink-0 ${accentDot[s.flowId] ?? 'bg-stone-300'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-800 truncate">
                    {flowT?.title ?? flow?.title ?? s.flowId}
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {new Date(s.createdAt).toLocaleDateString(lang === 'el' ? 'el-GR' : 'en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass}`}>
                    {statusLabel}
                  </span>
                  {isComplete && (
                    <Link
                      href={`/flows/${s.flowId}/complete?session=${s.id}`}
                      className="text-xs text-indigo-500 hover:text-indigo-700 hover:underline"
                    >
                      {t.history.view}
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
