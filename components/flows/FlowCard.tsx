import Link from 'next/link'
import type { FlowDefinition } from '@/types'

const accents: Record<string, {
  badge: string
  bar: string
  hover: string
}> = {
  understand: { badge: 'bg-indigo-50 text-indigo-600', bar: 'bg-indigo-400', hover: 'hover:border-indigo-200' },
  prepare:    { badge: 'bg-violet-50 text-violet-600', bar: 'bg-violet-400', hover: 'hover:border-violet-200' },
  decide:     { badge: 'bg-teal-50 text-teal-600',     bar: 'bg-teal-400',   hover: 'hover:border-teal-200'   },
}

interface Props {
  flow: FlowDefinition
  titleOverride?: string
  taglineOverride?: string
  minutesOverride?: number
  startLabel?: string
}

export function FlowCard({ flow, titleOverride, taglineOverride, minutesOverride, startLabel = 'Start →' }: Props) {
  const a = accents[flow.id] ?? accents.understand
  const title = titleOverride ?? flow.title
  const tagline = taglineOverride ?? flow.tagline
  const minutes = minutesOverride ?? flow.estimatedMinutes

  return (
    <Link href={`/flows/${flow.id}`} className="group block">
      <div
        className={`h-full rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-all duration-150 group-hover:shadow-md ${a.hover} group-active:scale-[0.99]`}
      >
        <div className="flex items-start justify-between mb-4">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${a.badge}`}>
            {flow.id.charAt(0).toUpperCase() + flow.id.slice(1)}
          </span>
          <span className="text-xs text-stone-400">~{minutes} min</span>
        </div>

        <div className="space-y-1.5 mb-5">
          <h3 className="text-sm font-semibold text-stone-900">{title}</h3>
          <p className="text-sm text-stone-500 leading-relaxed">{tagline}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className={`h-0.5 w-8 rounded-full ${a.bar}`} />
          <span className="text-xs text-stone-400 group-hover:text-stone-600 transition-colors">
            {startLabel}
          </span>
        </div>
      </div>
    </Link>
  )
}
