'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import type { FlowStep } from '@/types'

interface Props {
  step: FlowStep
  onSubmit: (answer: string) => void
  loading?: boolean
}

export function SingleSelectStep({ step, onSubmit, loading }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  const isSafetyOption = (opt: string) =>
    step.safetyTriggerValues?.includes(opt) ?? false

  return (
    <div className="space-y-4">
      {step.hint && (
        <p className="text-sm text-stone-400 leading-relaxed">{step.hint}</p>
      )}
      <div className="flex flex-col gap-2">
        {step.options?.map((opt) => {
          const isSelected = selected === opt
          const isSafety = isSafetyOption(opt)
          return (
            <button
              key={opt}
              onClick={() => setSelected(opt)}
              className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all cursor-pointer
                ${isSelected && isSafety
                  ? 'border-amber-300 bg-amber-50 text-amber-800'
                  : isSelected
                    ? 'border-indigo-300 bg-indigo-50 text-indigo-700 shadow-sm'
                    : isSafety
                      ? 'border-stone-200 bg-white text-amber-700 hover:border-amber-200 hover:bg-amber-50'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50'
                }`}
            >
              {isSafety && (
                <span className="mr-2 text-amber-500">⚠</span>
              )}
              {opt}
            </button>
          )
        })}
      </div>
      <Button
        onClick={() => selected && onSubmit(selected)}
        disabled={!selected}
        loading={loading}
        className="w-full"
      >
        Continue
      </Button>
    </div>
  )
}
