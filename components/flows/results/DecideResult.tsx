import type { DecideOutput } from '@/types'
import { ResultCard, BulletList, ArrowList, Prose } from './ResultCard'

export function DecideResult({ output }: { output: DecideOutput }) {
  return (
    <div className="space-y-4">
      {/* Summary */}
      <ResultCard label="Where you are" accent="teal">
        <Prose text={output.situationSummary} />
      </ResultCard>

      {/* Healthy vs concerning */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-500">Seems healthy</p>
          <BulletList items={output.whatSeemsHealthy} />
        </div>
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-rose-400">Seems concerning</p>
          <BulletList items={output.whatSeemsConcerning} />
        </div>
      </div>

      {/* Boundaries */}
      {output.boundariesToConsider.length > 0 && (
        <ResultCard label="Boundaries to consider" accent="teal">
          <BulletList items={output.boundariesToConsider} marker="–" />
        </ResultCard>
      )}

      {/* Options */}
      <ResultCard label="Your options" accent="teal">
        <ArrowList items={output.availableOptions} />
      </ResultCard>

      {/* Trade-offs */}
      {output.tradeOffs.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 px-1">Trade-offs</p>
          {output.tradeOffs.map((t, i) => (
            <div key={i} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm space-y-3">
              <p className="text-sm font-medium text-stone-800">{t.option}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-teal-500">Benefits</p>
                  <BulletList items={t.benefits} />
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-rose-400">Risks</p>
                  <BulletList items={t.risks} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Questions before deciding */}
      {output.questionsBeforeDeciding.length > 0 && (
        <ResultCard label="Questions to sit with" accent="stone">
          <BulletList items={output.questionsBeforeDeciding} marker="?" />
        </ResultCard>
      )}

      {/* Safety note */}
      {output.safetyNote && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-600">Safety note</p>
          <p className="text-sm text-amber-800 leading-relaxed">{output.safetyNote}</p>
        </div>
      )}

      {/* Recommended next step */}
      <ResultCard label="Recommended low-risk next step" accent="teal">
        <Prose text={output.recommendedLowRiskNextStep} />
      </ResultCard>

      {/* Action plan */}
      {output.actionPlan.length > 0 && (
        <ResultCard label="Action plan" accent="teal">
          <ArrowList items={output.actionPlan} />
        </ResultCard>
      )}
    </div>
  )
}
