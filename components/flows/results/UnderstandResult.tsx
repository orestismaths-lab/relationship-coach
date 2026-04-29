import type { UnderstandOutput } from '@/types'
import { ResultCard, BulletList, ArrowList, Prose, TwoColumn } from './ResultCard'

export function UnderstandResult({ output }: { output: UnderstandOutput }) {
  return (
    <div className="space-y-4">
      {/* Situation summary */}
      <ResultCard label="What happened" accent="indigo">
        <Prose text={output.situationSummary} />
      </ResultCard>

      {/* Facts vs interpretations */}
      <ResultCard label="Facts vs. interpretations" accent="indigo">
        <TwoColumn
          left={output.factsVsInterpretations.facts}
          right={output.factsVsInterpretations.interpretations}
          leftLabel="What you observed"
          rightLabel="How you interpreted it"
        />
      </ResultCard>

      {/* Feelings and needs */}
      <ResultCard label="Feelings & needs" accent="rose">
        <TwoColumn
          left={output.feelingsAndNeeds.feelings}
          right={output.feelingsAndNeeds.needs}
          leftLabel="How you felt"
          rightLabel="What you need"
        />
      </ResultCard>

      {/* Other perspective */}
      <ResultCard label="Another possible perspective" accent="stone">
        <Prose text={output.possibleOtherPerspective} />
      </ResultCard>

      {/* Patterns */}
      {output.patternsToNotice.length > 0 && (
        <ResultCard label="Patterns to notice" accent="amber">
          <BulletList items={output.patternsToNotice} />
        </ResultCard>
      )}

      {/* What's unclear */}
      {output.whatIsUnclear.length > 0 && (
        <ResultCard label="What's still unclear" accent="stone">
          <BulletList items={output.whatIsUnclear} />
        </ResultCard>
      )}

      {/* Safety concerns */}
      {output.redFlagsOrSafetyConcerns.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-600">Safety to consider</p>
          <BulletList items={output.redFlagsOrSafetyConcerns} marker="⚠" />
        </div>
      )}

      {/* Reframe */}
      <ResultCard label="A healthier way to see this" accent="teal">
        <Prose text={output.healthierReframe} />
      </ResultCard>

      {/* Next step */}
      <ResultCard label="Suggested next step" accent="indigo">
        <Prose text={output.suggestedNextStep} />
      </ResultCard>

      {/* Action plan */}
      {output.actionPlan.length > 0 && (
        <ResultCard label="Action plan" accent="indigo">
          <ArrowList items={output.actionPlan} />
        </ResultCard>
      )}
    </div>
  )
}
