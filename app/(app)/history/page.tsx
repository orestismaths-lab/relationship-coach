import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { FLOW_DEFINITIONS } from '@/lib/flows/definitions'
import { getServerT, getServerLang } from '@/lib/i18n/server'
import { getFlowT } from '@/lib/i18n/flowTranslations'
import { DeleteButton } from '@/components/history/DeleteButton'
import { LocalSessionsList } from '@/components/history/LocalSessionsList'

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
    where: { userId: session.user.id, status: 'COMPLETED' },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-stone-900">{t.history.title}</h1>
        <p className="text-sm text-stone-400">{t.history.total.replace('{n}', String(sessions.length))}</p>
      </div>

      <div className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-xs text-stone-500">
        🔒 {t.history.privacyNote}
      </div>

      {/* Local (browser-only) sessions */}
      <LocalSessionsList />

      {/* Saved sessions */}
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
            const title = s.title ?? flowT?.title ?? flow?.title ?? s.flowId
            return (
              <div
                key={s.id}
                className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white px-5 py-4 shadow-sm"
              >
                <div className={`h-2 w-2 rounded-full shrink-0 ${accentDot[s.flowId] ?? 'bg-stone-300'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-800 truncate">{title}</p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {new Date(s.createdAt).toLocaleDateString(lang === 'el' ? 'el-GR' : 'en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-600">
                    {t.history.status.COMPLETED}
                  </span>
                  <Link
                    href={`/flows/${s.flowId}/complete?session=${s.id}`}
                    className="text-xs text-indigo-500 hover:text-indigo-700 hover:underline"
                  >
                    {t.history.view}
                  </Link>
                  <DeleteButton sessionId={s.id} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
