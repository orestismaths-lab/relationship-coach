'use client'

import { useState } from 'react'
import type { PrepareOutput } from '@/types'
import type { T } from '@/lib/i18n/translations'
import { ResultCard, BulletList, ArrowList, Prose } from './ResultCard'
import { CopyButton } from '@/components/ui/CopyButton'

type Labels = T['results']['prepare']

const bgMap = {
  violet: 'bg-violet-50 border-violet-100',
  stone: 'bg-stone-50 border-stone-200',
  teal: 'bg-teal-50 border-teal-100',
}
const textMap = {
  violet: 'text-violet-700',
  stone: 'text-stone-700',
  teal: 'text-teal-700',
}
const labelMap = {
  violet: 'text-violet-400',
  stone: 'text-stone-400',
  teal: 'text-teal-400',
}

function EditableMessageCard({ label, initialText, accent }: {
  label: string
  initialText: string
  accent: 'violet' | 'stone' | 'teal'
}) {
  const [text, setText] = useState(initialText)

  return (
    <div className={`rounded-2xl border p-5 space-y-2 ${bgMap[accent]}`}>
      <div className="flex items-center justify-between gap-2">
        <p className={`text-sm font-medium ${labelMap[accent]}`}>{label}</p>
        <CopyButton text={text} />
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={Math.max(3, Math.ceil(text.length / 60))}
        className={`w-full bg-transparent text-sm leading-relaxed italic resize-none focus:outline-none focus:ring-1 focus:ring-indigo-200 rounded-lg px-1 -mx-1 ${textMap[accent]}`}
        spellCheck={false}
      />
    </div>
  )
}

export function PrepareResult({ output, t }: { output: PrepareOutput; t: Labels }) {
  return (
    <div className="space-y-4">
      <ResultCard label={t.goal} accent="violet">
        <Prose text={output.conversationGoal} />
      </ResultCard>

      <EditableMessageCard label={t.recommended} initialText={output.recommendedMessage} accent="violet" />

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 px-1">
          {t.alternatives}
        </p>
        <EditableMessageCard label={t.softer} initialText={output.softerVersion} accent="stone" />
        <EditableMessageCard label={t.direct} initialText={output.directVersion} accent="stone" />
        <EditableMessageCard label={t.boundary} initialText={output.boundaryFocusedVersion} accent="teal" />
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
