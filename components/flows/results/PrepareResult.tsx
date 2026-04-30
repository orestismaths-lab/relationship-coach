import type { PrepareOutput } from '@/types'
import type { T } from '@/lib/i18n/translations'
import { ResultCard, BulletList, ArrowList, Prose } from './ResultCard'

type Labels = T['results']['prepare']

function MessageCard({ label, text, accent }: {
  label: string
  text: string
  accent: 'violet' | 'stone' | 'teal'
}) {
  const bg = { violet: 'bg-violet-50 border-violet-100', stone: 'bg-stone-50 border-stone-200', teal: 'bg-teal-50 border-teal-100' }[accent]
  const textColor = { violet: 'text-violet-700', stone: 'text-stone-700', teal: 'text-teal-700' }[accent]
  const labelColor = { violet: 'text-violet-400', stone: 'text-stone-400', teal: 'text-teal-400' }[accent]
  return (
    <div className={`rounded-2xl border p-5 space-y-2 ${bg}`}>
      <p className={`text-xs font-semibold uppercase tracking-widest ${labelColor}`}>{label}</p>
      <p className={`text-sm leading-relaxed italic ${textColor}`}>{text}</p>
    </div>
  )
}

export function PrepareResult({ output, t }: { output: PrepareOutput; t: Labels }) {
  return (
    <div className="space-y-4">
      <ResultCard label={t.goal} accent="violet">
        <Prose text={output.conversationGoal} />
      </ResultCard>

      <MessageCard label={t.recommended} text={output.recommendedMessage} accent="violet" />

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 px-1">
          {t.alternatives}
        </p>
        <MessageCard label={t.softer} text={output.softerVersion} accent="stone" />
        <MessageCard label={t.direct} text={output.directVersion} accent="stone" />
        <MessageCard label={t.boundary} text={output.boundaryFocusedVersion} accent="teal" />
      </div>

      {output.whatToAvoid.length > 0 && (
        <ResultCard label={t.avoid} accent="amber">
          <BulletList items={output.whatToAvoid} marker="✕" />
        </ResultCard>
      )}

      {output.ifTheyReactBadly.length > 0 && (
        <ResultCard label={t.ifBad} accent="stone">
          <ArrowList items={output.ifTheyReactBadly} />
        </ResultCard>
      )}

      <ResultCard label={t.followUp} accent="violet">
        <Prose text={output.followUpSuggestion} />
      </ResultCard>
    </div>
  )
}
