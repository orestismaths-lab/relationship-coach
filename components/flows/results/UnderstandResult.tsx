import type { UnderstandOutput } from '@/types'
import type { T } from '@/lib/i18n/translations'
import { ResultCard, BulletList, ArrowList, Prose, TwoColumn } from './ResultCard'

type Labels = T['results']['understand']

export function UnderstandResult({ output, t }: { output: UnderstandOutput; t: Labels }) {
  return (
    <div className="space-y-4">
      <ResultCard label={t.whatHappened} accent="indigo">
        <Prose text={output.situationSummary} />
      </ResultCard>

      <ResultCard label={t.factsVsInterpretations} accent="indigo">
        <TwoColumn
          left={output.factsVsInterpretations.facts}
          right={output.factsVsInterpretations.interpretations}
          leftLabel={t.factsLabel}
          rightLabel={t.interpretationsLabel}
        />
      </ResultCard>

      <ResultCard label={t.feelingsNeeds} accent="rose">
        <TwoColumn
          left={output.feelingsAndNeeds.feelings}
          right={output.feelingsAndNeeds.needs}
          leftLabel={t.feelingsLabel}
          rightLabel={t.needsLabel}
        />
      </ResultCard>

      <ResultCard label={t.otherPerspective} accent="stone">
        <Prose text={output.possibleOtherPerspective} />
      </ResultCard>

      {output.patternsToNotice.length > 0 && (
        <ResultCard label={t.patterns} accent="amber">
          <BulletList items={output.patternsToNotice} />
        </ResultCard>
      )}

      {output.whatIsUnclear.length > 0 && (
        <ResultCard label={t.unclear} accent="stone">
          <BulletList items={output.whatIsUnclear} />
        </ResultCard>
      )}

      {output.redFlagsOrSafetyConcerns.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 space-y-2">
          <p className="text-sm font-semibold text-amber-800">{t.safety}</p>
          <BulletList items={output.redFlagsOrSafetyConcerns} marker="⚠" />
        </div>
      )}

      <ResultCard label={t.reframe} accent="teal">
        <Prose text={output.healthierReframe} />
      </ResultCard>

      <ResultCard label={t.nextStep} accent="indigo">
        <Prose text={output.suggestedNextStep} />
      </ResultCard>

      {output.actionPlan.length > 0 && (
        <ResultCard label={t.actionPlan} accent="indigo">
          <ArrowList items={output.actionPlan} />
        </ResultCard>
      )}
    </div>
  )
}
