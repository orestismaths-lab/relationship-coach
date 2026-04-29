import type { PrepareOutput } from '@/types'
import { ResultCard, BulletList, ArrowList, Prose } from './ResultCard'

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

export function PrepareResult({ output }: { output: PrepareOutput }) {
  return (
    <div className="space-y-4">
      {/* Goal */}
      <ResultCard label="Conversation goal" accent="violet">
        <Prose text={output.conversationGoal} />
      </ResultCard>

      {/* Recommended message */}
      <MessageCard label="Recommended message" text={output.recommendedMessage} accent="violet" />

      {/* Three versions */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 px-1">
          Alternative versions
        </p>
        <MessageCard label="Softer — if you want to tread lightly" text={output.softerVersion} accent="stone" />
        <MessageCard label="Direct — if you want to be clear" text={output.directVersion} accent="stone" />
        <MessageCard label="Boundary-focused — if you need to centre yourself" text={output.boundaryFocusedVersion} accent="teal" />
      </div>

      {/* What to avoid */}
      {output.whatToAvoid.length > 0 && (
        <ResultCard label="What to avoid" accent="amber">
          <BulletList items={output.whatToAvoid} marker="✕" />
        </ResultCard>
      )}

      {/* If they react badly */}
      {output.ifTheyReactBadly.length > 0 && (
        <ResultCard label="If they react badly" accent="stone">
          <ArrowList items={output.ifTheyReactBadly} />
        </ResultCard>
      )}

      {/* Follow-up */}
      <ResultCard label="After the conversation" accent="violet">
        <Prose text={output.followUpSuggestion} />
      </ResultCard>
    </div>
  )
}
