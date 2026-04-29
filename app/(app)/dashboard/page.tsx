import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { FlowCard } from '@/components/flows/FlowCard'
import { FLOW_DEFINITIONS } from '@/lib/flows/definitions'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const flows = Object.values(FLOW_DEFINITIONS)
  const firstName = session?.user?.name?.split(' ')[0]

  return (
    <div className="space-y-10">
      {/* Greeting */}
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-stone-900">
          {firstName ? `Hi, ${firstName}.` : 'Hi.'}
        </h1>
        <p className="text-stone-500 text-sm">What would you like to work through today?</p>
      </div>

      {/* Flow selection */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
          Choose a flow
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {flows.map((flow) => (
            <FlowCard key={flow.id} flow={flow} />
          ))}
        </div>
      </div>

      {/* Safety note */}
      <div className="rounded-xl border border-amber-100 bg-amber-50 px-5 py-4">
        <p className="text-xs text-amber-700 leading-relaxed">
          <span className="font-semibold">Important:</span>{' '}
          This tool supports reflection and communication. It is not therapy, crisis support,
          legal advice, medical advice, or emergency help.
        </p>
      </div>
    </div>
  )
}
