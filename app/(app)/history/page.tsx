import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { FLOW_DEFINITIONS } from '@/lib/flows/definitions'

const statusStyles: Record<string, { label: string; class: string }> = {
  COMPLETED:   { label: 'Completed',  class: 'bg-green-50 text-green-600' },
  IN_PROGRESS: { label: 'In progress', class: 'bg-amber-50 text-amber-600' },
  ABANDONED:   { label: 'Abandoned',  class: 'bg-stone-100 text-stone-400' },
}

const accentDot: Record<string, string> = {
  understand: 'bg-indigo-400',
  prepare:    'bg-violet-400',
  decide:     'bg-teal-400',
}

export default async function HistoryPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const sessions = await prisma.flowSession.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-stone-900">Your Reflections</h1>
        <p className="text-sm text-stone-400">{sessions.length} total</p>
      </div>

      {sessions.length === 0 ? (
        <div className="rounded-2xl border border-stone-200 bg-white px-6 py-12 text-center shadow-sm">
          <p className="text-sm text-stone-400">
            No reflections yet.{' '}
            <Link href="/dashboard" className="text-indigo-600 hover:underline">
              Start one →
            </Link>
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {sessions.map((s) => {
            const flow = FLOW_DEFINITIONS[s.flowId]
            const status = statusStyles[s.status] ?? statusStyles.ABANDONED
            const isComplete = s.status === 'COMPLETED'
            return (
              <div
                key={s.id}
                className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white px-5 py-4 shadow-sm"
              >
                {/* Dot */}
                <div className={`h-2 w-2 rounded-full shrink-0 ${accentDot[s.flowId] ?? 'bg-stone-300'}`} />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-800 truncate">
                    {flow?.title ?? s.flowId}
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {new Date(s.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                  </p>
                </div>

                {/* Status + link */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status.class}`}>
                    {status.label}
                  </span>
                  {isComplete && (
                    <Link
                      href={`/flows/${s.flowId}/complete?session=${s.id}`}
                      className="text-xs text-indigo-500 hover:text-indigo-700 hover:underline"
                    >
                      View →
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
