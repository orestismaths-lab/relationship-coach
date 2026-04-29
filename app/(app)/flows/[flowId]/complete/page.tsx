import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getFlow } from '@/lib/flows/definitions'
import { isUnderstandOutput, isPrepareOutput, isDecideOutput } from '@/types'
import type { FlowAIOutput } from '@/types'
import { UnderstandResult } from '@/components/flows/results/UnderstandResult'
import { PrepareResult } from '@/components/flows/results/PrepareResult'
import { DecideResult } from '@/components/flows/results/DecideResult'

const accentBadge: Record<string, string> = {
  understand: 'bg-indigo-50 text-indigo-600',
  prepare:    'bg-violet-50 text-violet-600',
  decide:     'bg-teal-50 text-teal-600',
}

function ResultRenderer({ flowId, output }: { flowId: string; output: FlowAIOutput }) {
  if (flowId === 'understand' && isUnderstandOutput(output)) {
    return <UnderstandResult output={output} />
  }
  if (flowId === 'prepare' && isPrepareOutput(output)) {
    return <PrepareResult output={output} />
  }
  if (flowId === 'decide' && isDecideOutput(output)) {
    return <DecideResult output={output} />
  }
  return (
    <div className="rounded-2xl border border-stone-200 bg-white px-6 py-10 text-center">
      <p className="text-sm text-stone-400">Could not render result — unexpected format.</p>
    </div>
  )
}

export default async function CompletePage(props: {
  params: Promise<{ flowId: string }>
  searchParams: Promise<{ session?: string }>
}) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const { flowId } = await props.params
  const { session: sessionId } = await props.searchParams
  if (!sessionId) redirect('/dashboard')

  const flowSession = await prisma.flowSession.findUnique({ where: { id: sessionId } })
  if (!flowSession || flowSession.userId !== session.user.id) redirect('/dashboard')

  const flow = getFlow(flowId)
  if (!flow) redirect('/dashboard')

  const aiOutputs = JSON.parse(flowSession.aiOutputs) as Record<string, FlowAIOutput>
  const output = aiOutputs['summary'] as FlowAIOutput | undefined

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${accentBadge[flowId] ?? 'bg-stone-100 text-stone-600'}`}>
            Complete
          </span>
        </div>
        <div>
          <h1 className="text-xl font-semibold text-stone-900">{flow.title}</h1>
          <p className="text-sm text-stone-400 mt-0.5">
            {new Date(flowSession.completedAt ?? flowSession.createdAt).toLocaleDateString('en-US', {
              weekday: 'long', month: 'long', day: 'numeric',
            })}
          </p>
        </div>
      </div>

      <div className="border-t border-stone-100" />

      {output ? (
        <ResultRenderer flowId={flowId} output={output} />
      ) : (
        <div className="rounded-2xl border border-stone-200 bg-white px-6 py-10 text-center">
          <p className="text-sm text-stone-400">No summary available for this session.</p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="rounded-xl border border-amber-100 bg-amber-50 px-5 py-4">
        <p className="text-xs text-amber-700 leading-relaxed">
          This reflection is a personal thinking tool — not professional advice.
          If you are struggling, please reach out to someone you trust or a professional.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 pt-2">
        <Link
          href="/dashboard"
          className="block w-full rounded-xl bg-indigo-600 py-3 text-center text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          Back to home
        </Link>
        <Link
          href="/history"
          className="block w-full rounded-xl border border-stone-200 bg-white py-3 text-center text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
        >
          View all reflections
        </Link>
      </div>
    </div>
  )
}
