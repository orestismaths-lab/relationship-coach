import type { DecideOutput } from '@/types'
import type { T } from '@/lib/i18n/translations'
import { ResultCard, BulletList, ArrowList, Prose } from './ResultCard'

type Labels = T['results']['decide']

export function DecideResult({ output, t }: { output: DecideOutput; t: Labels }) {
  return (
    <div className="space-y-4">
      <ResultCard label={t.whereYouAre} accent="teal">
        <Prose text={output.situationSummary} />
      </ResultCard>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-500">{t.healthy}</p>
          <BulletList items={output.whatSeemsHealthy} />
        </div>
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-rose-400">{t.concerning}</p>
          <BulletList items={output.whatSeemsConcerning} />
        </div>
      </div>

      {output.boundariesToConsider.length > 0 && (
        <ResultCard label={t.boundaries} accent="teal">
          <BulletList items={output.boundariesToConsider} marker="–" />
        </ResultCard>
      )}

      <ResultCard label={t.options} accent="teal">
        <ArrowList items={output.availableOptions} />
      </ResultCard>

      {output.tradeOffs.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 px-1">{t.tradeoffs}</p>
          {output.tradeOffs.map((item, i) => (
            <div key={i} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm space-y-3">
              <p className="text-sm font-medium text-stone-800">{item.option}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-teal-500">{t.benefits}</p>
                  <BulletList items={item.benefits} />
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-rose-400">{t.risks}</p>
                  <BulletList items={item.risks} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {output.questionsBeforeDeciding.length > 0 && (
        <ResultCard label={t.questions} accent="stone">
          <BulletList items={output.questionsBeforeDeciding} marker="?" />
        </ResultCard>
      )}

      {output.safetyNote && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 space-y-2">
          <p className="text-sm font-semibold text-amber-800">{t.safetyNote}</p>
          <p className="text-sm text-amber-800 leading-relaxed">{output.safetyNote}</p>
        </div>
      )}

      <ResultCard label={t.nextStep} accent="teal">
        <Prose text={output.recommendedLowRiskNextStep} />
      </ResultCard>

      {output.actionPlan.length > 0 && (
        <ResultCard label={t.actionPlan} accent="teal">
          <ArrowList items={output.actionPlan} />
        </ResultCard>
      )}
    </div>
  )
}
